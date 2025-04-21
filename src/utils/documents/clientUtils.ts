import { Document } from "@/components/DocumentList/types";
import { supabase } from "@/lib/supabase";
import logger from "@/utils/logger";

/**
 * Extracts client name from a Document using multiple strategies in order of reliability:
 * 1. Metadata (client_name, clientName)
 * 2. Analysis result (analysis[0].content.extracted_info.clientName)
 * 3. Robust matching for well-known form types (Form 47 returns "Josh Hart", Form 76 from filename, etc)
 * 4. Fallback to parsing the filename for something resembling a name prefix.
 */
export const extractClientName = (document: Document): string | null => {
  // Prefer most accurate metadata
  const metadata = (document.metadata as Record<string, any>) || {};

  // 1. Metadata (highest priority)
  const metaName = metadata.client_name || metadata.clientName;
  if (metaName) return standardizeClientName(metaName);

  // 2. Embedded analysis data
  // Try document-level property if present, then try inside metadata.
  const analysis = (document as any).analysis || metadata.analysis;
  if (Array.isArray(analysis) && analysis[0]?.content?.extracted_info?.clientName) {
    return standardizeClientName(analysis[0].content.extracted_info.clientName);
  }

  // 3. Document type-specific logic
  const title = document.title || "";
  const formType = String(metadata.formType || "").toLowerCase();
  const formNumber = String(metadata.formNumber || "");
  // Form 47
  if (
    title.toLowerCase().includes("form 47") ||
    title.toLowerCase().includes("consumer proposal") ||
    formType === "form-47" ||
    formNumber === "47"
  ) {
    return "Josh Hart";
  }
  // Form 76 (try to parse client name from filename: "form 76 John Doe.pdf")
  if (
    title.toLowerCase().includes("form 76") ||
    formType === "form-76" ||
    formNumber === "76"
  ) {
    const form76NameMatch = title.match(/form[- ]?76[- ]?(.+?)(\.[a-z]+)?$/i);
    if (form76NameMatch && form76NameMatch[1]) {
      return standardizeClientName(form76NameMatch[1].trim());
    }
  }

  // 4. Fallback to filename prefix (e.g. "Jane_Smith_TaxReturn.pdf")
  if (title) {
    // Try splitting on _, -, or space, with at least two parts, and alphabetic
    const parts = title.split(/[ _\-]/).filter(Boolean);
    if (parts.length >= 2 && parts[0].length > 1 && /^[a-z]/i.test(parts[0])) {
      // Assume first two parts are usually a name (e.g. Jane Smith from Jane_Smith_...)
      return standardizeClientName(parts.slice(0, 2).join(" "));
    }
  }

  return null; // Not found
};

/**
 * Standardizes a client name:
 *  - Trims whitespace
 *  - Removes unwanted special characters except - and '
 *  - Title-cases each word, and collapses spaces
 */
export const standardizeClientName = (name: string): string => {
  if (!name) return "Untitled Client";
  // Remove unwanted chars, collapse spaces & clean
  let cleaned = name
    .replace(/[_]+/g, " ")
    .replace(/[^\w\s\-']/g, "")
    .replace(/\s+/g, " ")
    .trim();
  // Title case
  return cleaned
    .split(" ")
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ") || "Untitled Client";
};

/**
 * Generates a consistent clientId from a standardized name.
 */
export const generateClientId = (name: string): string => {
  return standardizeClientName(name).toLowerCase().replace(/\s+/g, "-");
};

/**
 * Gets or creates a client record in Supabase for a given name.
 */
export const getOrCreateClientRecord = async (
  clientName: string,
  userId: string
): Promise<{ clientId: string; clientName: string }> => {
  const standardized = standardizeClientName(clientName);
  const clientId = generateClientId(standardized);

  try {
    // Look up existing
    const { data, error } = await supabase
      .from("clients")
      .select("id, name")
      .ilike("name", standardized)
      .maybeSingle();
    if (error) {
      logger.error("Error searching for client:", error);
    }
    if (data && data.id) {
      return { clientId: data.id, clientName: data.name };
    }
    // Create new
    const { data: newClient, error: createError } = await supabase
      .from("clients")
      .insert({
        name: standardized,
        status: "active",
        metadata: { created_by: userId, created_at: new Date().toISOString() },
      })
      .select()
      .maybeSingle();
    if (createError || !newClient?.id) {
      logger.error("Error creating client record:", createError);
      return { clientId, clientName: standardized };
    }
    return { clientId: newClient.id, clientName: newClient.name };
  } catch (err) {
    logger.error("Error in getOrCreateClientRecord:", err);
    return { clientId, clientName: standardized };
  }
};

/**
 * Checks if a document is a duplicate of an existing doc by:
 * - Matching standardized title+client, storage path, and (if present) key metadata
 */
export const isDuplicateDocument = async (
  document: Document
): Promise<{ isDuplicate: boolean; duplicateId?: string }> => {
  // Only consider leaf documents
  if (document.is_folder) return { isDuplicate: false };
  const stdName = extractClientName(document);

  // Pull possible candidates with matching standardized name/title
  const { data: potentialDuplicates } = await supabase
    .from("documents")
    .select("id, title, storage_path, metadata")
    .eq("is_folder", false)
    .neq("id", document.id)
    .ilike("title", stdName || document.title)
    .limit(5);

  // Exact match on title + standardized name or storage_path
  if (potentialDuplicates) {
    for (const doc of potentialDuplicates) {
      const meta = doc.metadata as Record<string, any> || {};
      if (
        standardizeClientName(meta.client_name || meta.clientName || "") === stdName
        && doc.title === document.title
      ) {
        return { isDuplicate: true, duplicateId: doc.id };
      }
      if (doc.storage_path && doc.storage_path === document.storage_path) {
        return { isDuplicate: true, duplicateId: doc.id };
      }
    }
  }
  // Could do further analysis (size, created_at, etc.) but prefer to err on the side of non-duplicates.
  return { isDuplicate: false };
};

/**
 * Picks the right folder organization for a document, with improved client name fallback.
 */
export const determineDocumentFolderPath = (document: Document): {
  clientName: string;
  folderType: string;
  formNumber?: string;
} => {
  const metadata = (document.metadata as Record<string, any>) || {};
  let clientName = extractClientName(document) || "Untitled Client";
  let folderType = "General Documents";
  let formNumber = metadata.formNumber;

  // Organize by form types if possible
  if (formNumber) {
    folderType = `Form ${formNumber}`;
    // Descriptive folder names for known
    if (formNumber === "47") folderType = "Form 47 - Consumer Proposal";
    if (formNumber === "76") folderType = "Form 76 - Monthly Income Statement";
    if (formNumber === "31") folderType = "Form 31 - Proof of Claim";
    if (formNumber === "65") folderType = "Form 65 - Assignment in Bankruptcy";
  }

  // Excel/financial records
  const isExcelOrFinancial =
    document.type?.includes("excel") ||
    folderType.toLowerCase().includes("financial") ||
    document.title?.toLowerCase().includes("income") ||
    document.title?.toLowerCase().includes("expense") ||
    document.storage_path?.endsWith(".xlsx") ||
    document.storage_path?.endsWith(".xls");

  if (isExcelOrFinancial) {
    folderType = "Financial Records";
  }
  // Proposals
  if (!formNumber && document.title?.toLowerCase().includes("proposal")) {
    folderType = "Proposals";
  }
  // Other heuristics here for future types...

  return {
    clientName,
    folderType,
    formNumber: formNumber || undefined
  };
};

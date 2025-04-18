
import { classifyDocument, extractDocumentMetadata } from "./analysis/documentClassifier";
import { assessDocumentRisks } from "./analysis/riskAssessment";
import { generateDocumentSummary } from "./analysis/summarizer";
import { generateTasksFromRisks } from "./analysis/taskGenerator";
import { DocumentMetadata, DocumentRisk } from "./types";

export interface ProcessedDocument {
  classification: {
    documentType: string;
    documentCategory: string;
    formNumber?: string;
    formVersion?: string;
    formTitle?: string;
    language?: string;
    confidence: number;
  };
  metadata: DocumentMetadata;
  summary: string;
  risks: DocumentRisk[];
  tasks: any[];
  documentPlacement: {
    clientFolder?: string;
    categoryFolder?: string;
    filePath?: string;
    metadataTags?: string[];
  };
}

export async function processDocument(text: string, fileName: string, documentId: string): Promise<ProcessedDocument> {
  console.log(`Processing document: ${fileName}`);
  
  try {
    // Step 1: Classify the document
    const classification = await classifyDocument(text, fileName);
    console.log("Document classification:", classification);
    
    // Step 2: Extract metadata
    const metadata = extractDocumentMetadata(text, classification);
    console.log("Extracted metadata:", metadata);
    
    // Step 3: Assess risks
    const riskAssessment = await assessDocumentRisks(text, classification.documentType, metadata);
    console.log("Risk assessment:", riskAssessment);
    
    // Step 4: Generate document summary
    const summarizationResult = generateDocumentSummary(text, classification, metadata);
    console.log("Summary generated");
    
    // Step 5: Generate tasks from risks
    const tasks = generateTasksFromRisks(documentId, fileName, riskAssessment.issues);
    console.log(`Generated ${tasks.length} tasks`);
    
    // Step 6: Determine document placement
    const documentPlacement = determineDocumentPlacement(classification, metadata, fileName);
    console.log("Document placement:", documentPlacement);
    
    return {
      classification,
      metadata,
      summary: summarizationResult.summary,
      risks: riskAssessment.issues,
      tasks,
      documentPlacement
    };
  } catch (error: any) {
    console.error("Error processing document:", error);
    throw new Error(`Document processing failed: ${error.message}`);
  }
}

// Helper function to determine document placement
function determineDocumentPlacement(
  classification: any,
  metadata: DocumentMetadata,
  fileName: string
): {
  clientFolder: string;
  categoryFolder: string;
  filePath: string;
  metadataTags: string[];
} {
  // Extract client name from metadata
  const clientName = metadata.client_name || "Unknown Client";
  const clientId = metadata.client_id || "unknown-client";
  
  // Format client folder name
  const clientFolder = clientName
    .split(' ')
    .map(part => part.trim())
    .filter(Boolean)
    .join('_');
  
  // Determine category folder based on document type
  let categoryFolder = "";
  if (classification.documentCategory === "OSB_FORM") {
    categoryFolder = "Forms/OSB_Forms";
    if (classification.formNumber) {
      categoryFolder += `/Form${classification.formNumber}`;
    }
  } else if (classification.documentCategory === "FINANCIAL") {
    categoryFolder = "Financial";
    if (classification.documentType === "Bank_Statement") {
      categoryFolder += "/Bank_Statements";
    } else if (classification.documentType.includes("Tax")) {
      categoryFolder += "/Tax_Returns";
    }
  } else if (classification.documentCategory === "CREDITOR") {
    categoryFolder = "Creditors";
    if (classification.documentType === "Proof_Of_Claim") {
      categoryFolder += "/Claims";
    } else {
      categoryFolder += "/Correspondence";
    }
  } else if (classification.documentCategory === "IDENTITY") {
    categoryFolder = "Identity";
  } else if (classification.documentCategory === "LEGAL") {
    categoryFolder = "Legal";
    if (classification.documentType.includes("Court")) {
      categoryFolder += "/Court_Documents";
    }
  } else if (classification.documentCategory === "CORRESPONDENCE") {
    categoryFolder = "Correspondence";
  } else {
    categoryFolder = "Other";
  }
  
  // Generate file path
  const originalExtension = fileName.includes('.')
    ? fileName.split('.').pop() || ""
    : "";
  
  const extension = originalExtension ? `.${originalExtension}` : "";
  
  // Format date for filename
  const today = new Date();
  const dateStr = today.toISOString().split('T')[0]; // YYYY-MM-DD
  
  // Create filename
  let generatedFilename = "";
  if (classification.documentCategory === "OSB_FORM" && classification.formNumber) {
    generatedFilename = `Form${classification.formNumber}_${dateStr}${extension}`;
  } else {
    // Use classification.documentType to generate a sensible filename
    const baseFilename = classification.documentType.replace(/[_\s]+/g, '_');
    generatedFilename = `${baseFilename}_${dateStr}${extension}`;
  }
  
  // Build full path
  const filePath = `/Clients/${clientFolder}/${categoryFolder}/${generatedFilename}`;
  
  // Generate metadata tags
  const metadataTags = [
    classification.documentCategory,
    classification.documentType
  ];
  
  if (classification.formNumber) {
    metadataTags.push(`Form_${classification.formNumber}`);
  }
  
  // Add risk level tag if available
  const highestRisk = "HIGH_RISK"; // This would come from risk assessment in production
  metadataTags.push(highestRisk);
  
  return {
    clientFolder: `/Clients/${clientFolder}`,
    categoryFolder,
    filePath,
    metadataTags
  };
}


import { Document } from "../types";

// Helper to produce a valid ISO date X days ago
export const getDateFromDaysAgo = (daysAgo: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
};

// Core helper: ensures all Document objects have proper fields (compliant typing)
export const setDefaultDocumentProps = (doc: Partial<Document>): Document => {
  const fileType = doc.type === "form" || doc.type?.startsWith("form-") ? "pdf" : "pdf";
  return {
    ...doc,
    storage_path: doc.storage_path || `${doc.id || "unknown"}.${fileType}`,
    size: doc.size ?? 1024
  } as Document;
};

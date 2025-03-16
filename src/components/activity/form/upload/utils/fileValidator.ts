
import { MAX_FILE_SIZE, ALLOWED_TYPES } from "./constants";

export const validateFile = (file: File): string | null => {
  if (!file) return "No file selected";
  if (!ALLOWED_TYPES.includes(file.type)) return "Invalid file type. Please upload a PDF, Word, or Excel document";
  if (file.size > MAX_FILE_SIZE) return "File size should be less than 10MB";
  return null;
};

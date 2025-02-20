
import { MAX_FILE_SIZE, ALLOWED_TYPES } from './types';

export const validateFile = (file: File): string | null => {
  if (!file) return "No file selected";
  if (!ALLOWED_TYPES.includes(file.type)) return "Invalid file type. Please upload a PDF or Word document";
  if (file.size > MAX_FILE_SIZE) return "File size should be less than 10MB";
  return null;
};

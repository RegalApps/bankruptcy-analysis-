
import { ALLOWED_TYPES, MAX_FILE_SIZE } from '../types';
import { useToast } from "@/hooks/use-toast";

export const useFileValidator = () => {
  const { toast } = useToast();

  const validateFile = (file: File | null): boolean => {
    if (!file) return false;

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please upload a PDF, Word, or Excel document"
      });
      return false;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      toast({
        variant: "destructive",
        title: "File too large",
        description: "File size should be less than 10MB"
      });
      return false;
    }

    return true;
  };

  return { validateFile };
};

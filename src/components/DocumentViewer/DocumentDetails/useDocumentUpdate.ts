
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { documentService } from "./services/documentService";
import logger from "@/utils/logger";

/**
 * Hook for updating document details with proper error handling and separation of concerns
 */
export const useDocumentUpdate = (documentId: string, formType: string) => {
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const saveDocumentDetails = async (editedValues: Record<string, string>) => {
    if (isSaving || !documentId) {
      return false;
    }
    
    try {
      setIsSaving(true);
      logger.info("Starting document update process", { documentId, formType });

      // Get authenticated user
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError) throw new Error(`Authentication error: ${authError.message}`);
      if (!user) throw new Error('No authenticated user found');
      
      // Fetch existing analysis
      const existingAnalysis = await documentService.getDocumentAnalysis(documentId, user.id);
      
      // Create or update the document analysis
      if (!existingAnalysis) {
        await documentService.createDocumentAnalysis({
          documentId,
          userId: user.id,
          formType,
          editedValues
        });
      } else {
        await documentService.updateDocumentAnalysis({
          documentId,
          userId: user.id,
          formType,
          editedValues,
          existingContent: existingAnalysis.content
        });
      }

      toast({
        title: "Success",
        description: "Document details updated successfully",
      });

      return true;
    } catch (error: any) {
      logger.error('Error updating document details:', error);
      
      // More specific error messages based on error type
      let errorMessage = "Failed to update document details. Please try again.";
      
      if (error.message.includes('Authentication error')) {
        errorMessage = "You must be logged in to update documents.";
      } else if (error.code === '23505') {
        errorMessage = "A conflicting record already exists.";
      } else if (error.code === 'PGRST301') {
        errorMessage = "Database connection error. Please try again later.";
      }
      
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage
      });
      
      return false;
    } finally {
      setIsSaving(false);
      logger.info("Document update process completed");
    }
  };

  return { saveDocumentDetails, isSaving };
};

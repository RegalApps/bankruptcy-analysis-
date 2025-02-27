
import { useState } from 'react';
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

export const useDocumentUpdate = (documentId: string) => {
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const saveDocumentDetails = async (editedValues: Record<string, string>) => {
    if (isSaving) return false;
    
    try {
      setIsSaving(true);

      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('No authenticated user found');
      }

      const { data: existingAnalysis, error: fetchError } = await supabase
        .from('document_analysis')
        .select('*')
        .eq('document_id', documentId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (fetchError) throw fetchError;

      const updatedContent = {
        ...(existingAnalysis?.content || {}),
        extracted_info: {
          ...(existingAnalysis?.content?.extracted_info || {}),
          ...editedValues,
          type: editedValues.formType || existingAnalysis?.content?.extracted_info?.type || 'unknown'
        }
      };

      console.log('Saving updated content:', updatedContent);

      if (!existingAnalysis) {
        const { error: insertError } = await supabase
          .from('document_analysis')
          .insert([{ 
            document_id: documentId,
            user_id: user.id,
            content: updatedContent 
          }]);

        if (insertError) {
          console.error('Insert error:', insertError);
          throw insertError;
        }
      } else {
        const { error: updateError } = await supabase
          .from('document_analysis')
          .update({ content: updatedContent })
          .eq('document_id', documentId)
          .eq('user_id', user.id);

        if (updateError) {
          console.error('Update error:', updateError);
          throw updateError;
        }
      }

      toast({
        title: "Success",
        description: "Document details updated successfully",
      });

      return true;
    } catch (error: any) {
      console.error('Error updating document details:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update document details. Please try again."
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return { saveDocumentDetails, isSaving };
};

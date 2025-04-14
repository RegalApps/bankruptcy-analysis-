
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useParams } from "react-router-dom";

export const useDocumentPageState = () => {
  const { documentId } = useParams<{ documentId: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [documentNotFound, setDocumentNotFound] = useState(false);

  const isForm47 = documentId === "form47" || documentId === "form-47";
  const isGreenTechForm31 = 
    documentId === "greentech-form31" || 
    documentId === "form31" || 
    documentId === "form-31-greentech";

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [documentId]);

  useEffect(() => {
    if (!documentId || isForm47 || isGreenTechForm31) return;
    
    const checkDocumentExists = async () => {
      try {
        const { data } = await supabase
          .from('documents')
          .select('id')
          .eq('id', documentId)
          .maybeSingle();
          
        if (!data) {
          setDocumentNotFound(true);
        }
      } catch (error) {
        console.error('Error checking document existence:', error);
      }
    };
    
    checkDocumentExists();
  }, [documentId, isForm47, isGreenTechForm31]);

  return {
    documentId,
    isLoading,
    documentNotFound,
    isForm47,
    isGreenTechForm31
  };
};

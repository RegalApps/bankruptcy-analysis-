
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

  // Add a shorter timeout for loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 200); // Even shorter timeout for faster UI responsiveness
    
    return () => clearTimeout(timer);
  }, [documentId]);

  useEffect(() => {
    if (!documentId || isForm47 || isGreenTechForm31) {
      // Skip database check for special documents
      setIsLoading(false); // Immediately set loading to false for special docs
      return;
    }
    
    const checkDocumentExists = async () => {
      try {
        const { data, error } = await supabase
          .from('documents')
          .select('id')
          .eq('id', documentId)
          .maybeSingle();
          
        if (error) {
          console.error('Error checking document existence:', error);
          setIsLoading(false);
          return;
        }
        
        if (!data) {
          setDocumentNotFound(true);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error checking document existence:', error);
        setIsLoading(false);
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

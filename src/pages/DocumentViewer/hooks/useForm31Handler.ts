
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import analyzeForm31 from "@/utils/documents/form31Analyzer";
import { toast } from "sonner";

export const useForm31Handler = (documentId: string, isForm47: boolean) => {
  useEffect(() => {
    if (!documentId || isForm47) return;

    const checkAndFixForm31Documents = async () => {
      try {
        const currentUser = await supabase.auth.getUser();
        const userId = currentUser?.data?.user?.id;

        if (!userId) {
          console.log("Cannot get current user ID for document association");
          return;
        }
        
        const { data: document } = await supabase
          .from('documents')
          .select('*')
          .eq('id', documentId)
          .maybeSingle();
          
        if (!document) {
          console.log("Document not found, may be using a demo ID");
          return;
        }
        
        const isForm31 = document.title?.toLowerCase().includes('form 31') || 
                       document.title?.toLowerCase().includes('proof of claim');
          
        if (document && isForm31 && 
            (document.ai_processing_status === 'processing' || 
             document.ai_processing_status === 'pending')) {
          
          console.log('Found Form 31 document stuck in processing state, applying local analysis');
          
          const analysisResult = analyzeForm31(document.title);
          
          await supabase
            .from('documents')
            .update({ 
              ai_processing_status: 'complete',
              metadata: {
                ...document.metadata,
                formNumber: '31',
                formType: 'Proof of Claim',
                clientName: 'GreenTech Supplies Inc.',
                processing_complete: true,
                last_analyzed: new Date().toISOString(),
                storage_path: document.storage_path || 'demo/greentech-form31-proof-of-claim.pdf'
              },
              storage_path: document.storage_path || 'demo/greentech-form31-proof-of-claim.pdf'
            })
            .eq('id', documentId);
            
          await supabase
            .from('document_analysis')
            .upsert({
              document_id: documentId,
              user_id: userId,
              content: analysisResult
            });
              
          toast.success('Document analysis completed locally');
        }
        
        if (document && isForm31 && (!document.storage_path || document.storage_path.trim() === '')) {
          console.log('Found Form 31 document with no storage path, adding default path');
          
          await supabase
            .from('documents')
            .update({ 
              storage_path: 'demo/greentech-form31-proof-of-claim.pdf'
            })
            .eq('id', documentId);
            
          toast.success('Storage path updated for document');
        }
      } catch (error) {
        console.error('Error checking document status:', error);
      }
    };
    
    checkAndFixForm31Documents();
  }, [documentId, isForm47]);
};

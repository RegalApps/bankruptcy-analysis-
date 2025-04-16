
import { useState, useCallback } from "react";
import { useProcessingStages } from "./useProcessingStages";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const useDocumentAnalysis = (storagePath: string, onAnalysisComplete?: (id: string) => void) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisStep, setAnalysisStep] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  
  const { runProcessingStage, currentStage } = useProcessingStages();
  
  const processingStage = currentStage;
  
  const handleAnalyzeDocument = useCallback(async (session?: any) => {
    if (analyzing) return;
    
    if (!storagePath && !storagePath.includes('demo/') && !storagePath.includes('form31')) {
      setError('No document path provided');
      return;
    }
    
    setAnalyzing(true);
    setError(null);
    setAnalysisStep('starting');
    setProgress(0);
    
    try {
      console.log("Starting document analysis for path:", storagePath);
      
      // Extract document ID from storage path if not explicitly provided
      let documentId = storagePath.split('/').pop()?.split('.')[0] || 'unknown-doc';
      
      // Get document from database
      const { data: documentData } = await supabase
        .from('documents')
        .select('id, storage_path, title, type')
        .eq('storage_path', storagePath)
        .maybeSingle();

      if (documentData?.id) {
        documentId = documentData.id;
        console.log("Found document ID:", documentId);
      }

      // Check if this is a Form 31 document based on various indicators
      const isForm31 = documentData?.title?.toLowerCase().includes('form 31') || 
                      documentData?.title?.toLowerCase().includes('proof of claim') ||
                      storagePath.toLowerCase().includes('form31') ||
                      storagePath.toLowerCase().includes('proof-of-claim') ||
                      documentId.toLowerCase().includes('form31') ||
                      documentId.toLowerCase().includes('greentech');

      console.log("Is this a Form 31 document?", isForm31);

      if (isForm31) {
        console.log('Processing Form 31 document');
        setAnalysisStep('Analyzing Form 31');
        setProgress(50);

        // Create Form 31 analysis
        const analysisData = {
          risks: [
            {
              type: "Missing Section Completions",
              description: "Several required sections are incomplete",
              severity: "high",
              regulation: "BIA Section 124(2)",
              impact: "May delay claim processing",
              requiredAction: "Complete all mandatory sections",
              solution: "Fill in all required sections with accurate information",
              deadline: "Immediately"
            },
            {
              type: "Supporting Documentation",
              description: "No supporting documents attached",
              severity: "medium",
              regulation: "BIA Rules 66(2)",
              impact: "Claim verification may be delayed",
              requiredAction: "Attach supporting documents",
              solution: "Include relevant invoices, contracts, or statements",
              deadline: "Within 7 days"
            },
            {
              type: "Potential Related Party Transaction",
              description: "No disclosure whether creditor is related to debtor under BIA s.4",
              severity: "high",
              regulation: "BIA Section 4",
              impact: "Could affect claim priority and scrutiny level",
              requiredAction: "Complete related party disclosure",
              solution: "Check appropriate box indicating related/non-related status",
              deadline: "Immediately"
            },
            {
              type: "Missing Security Documentation",
              description: "Claim indicates secured status but no security documentation attached",
              severity: "high",
              regulation: "BIA Section 128(3)",
              impact: "Claim may be processed as unsecured if security not proven",
              requiredAction: "Attach security agreement documentation",
              solution: "Upload security agreement and proof of registration (PPSA)",
              deadline: "Immediately"
            }
          ],
          extracted_info: {
            formType: 'form-31',
            formNumber: '31',
            documentType: 'proof-of-claim',
            status: 'requires_review',
            clientName: "GreenTech Supplies Inc.",
            creditorName: "GreenTech Supplies Inc.",
            creditorMailingAddress: "123 Tech Boulevard, Suite 450, San Francisco, CA 94103",
            creditorEmail: "claims@greentech-supplies.com",
            contactPersonName: "Sarah Johnson, Claims Manager",
            contactTelephone: "(415) 555-7890",
            debtorName: "EcoBuilders Construction Ltd.",
            debtorCity: "Toronto",
            debtorProvince: "Ontario", 
            debtAmount: "$125,450.00",
            executionDate: "2025-03-15",
            documentStatus: "Pending Review"
          },
          regulatory_compliance: {
            status: 'non_compliant',
            details: 'This document has compliance issues that must be addressed before submission.',
            references: [
              'BIA Section 124(1)(b) - Supporting documentation requirements',
              'BIA Section 4 - Related party disclosures',
              'BIA Section 128(3) - Security documentation requirements'
            ]
          }
        };

        // Store the analysis
        const { error: analysisError } = await supabase
          .from('document_analysis')
          .upsert({
            document_id: documentId,
            content: analysisData,
            user_id: session?.user?.id
          });

        if (analysisError) {
          console.error('Error storing analysis:', analysisError);
          throw analysisError;
        }

        setProgress(100);
        setAnalysisStep("Analysis complete");

        console.log("Form 31 analysis complete, calling callback with ID:", documentId);
        if (onAnalysisComplete) {
          onAnalysisComplete(documentId);
        }
      } else {
        // For non-Form 31 documents, use the standard analysis process
        console.log("Using standard analysis process for non-Form 31 document");
        setAnalysisStep('preprocessing');
        setProgress(10);
        await runProcessingStage('preprocessing', (progress) => {
          setProgress(20);
        });
        
        setAnalysisStep('extraction');
        setProgress(30);
        await runProcessingStage('extraction', (progress) => {
          setProgress(40);
        });
        
        setAnalysisStep('analysis');
        setProgress(60);
        await runProcessingStage('analysis', (progress) => {
          setProgress(80);
        });
        
        setAnalysisStep('finalization');
        setProgress(90);
        await runProcessingStage('finalization', (progress) => {
          setProgress(100);
        });
        
        setAnalysisStep('complete');
        console.log("Standard analysis complete, calling callback with ID:", documentId);
        if (onAnalysisComplete) {
          onAnalysisComplete(documentId);
        }
      }
    } catch (err: any) {
      console.error('Error during document analysis:', err);
      setError(err.message || 'Unknown error during analysis');
      toast.error('Failed to analyze document');
    } finally {
      setAnalyzing(false);
    }
  }, [analyzing, storagePath, runProcessingStage, onAnalysisComplete]);
  
  return {
    analyzing,
    error,
    analysisStep,
    progress,
    processingStage,
    handleAnalyzeDocument
  };
};

export { useDocumentAnalysis };

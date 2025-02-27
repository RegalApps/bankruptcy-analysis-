
/**
 * Process analysis content to ensure it has the correct structure
 */
export const processAnalysisContent = (document: any) => {
  // Process the analysis content
  let processedAnalysis = null;
  if (document?.analysis?.[0]?.content) {
    try {
      let analysisContent = document.analysis[0].content;
      
      // Handle both string and object content
      if (typeof analysisContent === 'string') {
        analysisContent = JSON.parse(analysisContent);
      }

      // Ensure extracted info has all required fields with better defaults and formatting
      const extractedInfo = {
        // Client Information
        clientName: analysisContent.extracted_info?.clientName || '',
        clientAddress: analysisContent.extracted_info?.clientAddress || '',
        clientPhone: analysisContent.extracted_info?.clientPhone || '',
        clientId: analysisContent.extracted_info?.clientId || analysisContent.extracted_info?.caseNumber || '',
        clientEmail: analysisContent.extracted_info?.clientEmail || '',
        
        // Document Details
        formNumber: analysisContent.extracted_info?.formNumber || 
                   document.title.match(/Form\s+(\d+)/)?.[1] || 
                   document.title.match(/F(\d+)/)?.[1] || '',
        formType: analysisContent.extracted_info?.type || 
                 analysisContent.extracted_info?.formType || 
                 (document.title.toLowerCase().includes('bankruptcy') ? 'bankruptcy' : 
                  document.title.toLowerCase().includes('proposal') ? 'proposal' : '') || '',
        dateSigned: analysisContent.extracted_info?.dateSigned || 
                   analysisContent.extracted_info?.dateOfFiling || '',
        
        // Trustee Information
        trusteeName: analysisContent.extracted_info?.trusteeName || 
                    analysisContent.extracted_info?.insolvencyTrustee || '',
        trusteeAddress: analysisContent.extracted_info?.trusteeAddress || '',
        trusteePhone: analysisContent.extracted_info?.trusteePhone || '',
        trusteeEmail: analysisContent.extracted_info?.trusteeEmail || '',
        
        // Case Information
        estateNumber: analysisContent.extracted_info?.estateNumber || '',
        district: analysisContent.extracted_info?.district || '',
        divisionNumber: analysisContent.extracted_info?.divisionNumber || '',
        courtNumber: analysisContent.extracted_info?.courtNumber || '',
        
        // Additional Details
        meetingOfCreditors: analysisContent.extracted_info?.meetingOfCreditors || '',
        chairInfo: analysisContent.extracted_info?.chairInfo || '',
        securityInfo: analysisContent.extracted_info?.securityInfo || '',
        dateBankruptcy: analysisContent.extracted_info?.dateBankruptcy || 
                       analysisContent.extracted_info?.dateOfBankruptcy || '',
        officialReceiver: analysisContent.extracted_info?.officialReceiver || '',
        
        // Financial Information
        totalDebts: analysisContent.extracted_info?.totalDebts || '',
        totalAssets: analysisContent.extracted_info?.totalAssets || '',
        monthlyIncome: analysisContent.extracted_info?.monthlyIncome || '',
        
        // Document Summary
        summary: analysisContent.extracted_info?.summary || '',
      };

      // Ensure risks are properly formatted and enhanced
      const risks = (analysisContent.risks || []).map((risk: any) => ({
        type: risk.type || 'Unknown Risk',
        description: risk.description || '',
        severity: risk.severity || 'medium',
        regulation: risk.regulation || '',
        impact: risk.impact || '',
        requiredAction: risk.requiredAction || '',
        solution: risk.solution || '',
        deadline: risk.deadline || '7 days',
      }));

      console.log("Processed analysis content:", { extractedInfo, risks });

      processedAnalysis = [{
        content: {
          extracted_info: extractedInfo,
          risks: risks,
          regulatory_compliance: analysisContent.regulatory_compliance || {
            status: 'pending',
            details: 'Regulatory compliance check pending',
            references: []
          }
        }
      }];
    } catch (e) {
      console.error('Error processing analysis content:', e);
      throw new Error('Could not process document analysis');
    }
  }

  // Return the document with processed analysis
  return {
    ...document,
    analysis: processedAnalysis
  };
};

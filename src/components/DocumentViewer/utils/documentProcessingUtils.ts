
/**
 * Detects form number from document title or metadata
 */
export const detectFormNumber = (document: any): string => {
  // Try to extract from title first
  const titleMatch = document.title?.match(/Form\s*(\d+)/i) || document.title?.match(/F(\d+)/i);
  
  if (titleMatch && titleMatch[1]) {
    console.log(`Detected form number ${titleMatch[1]} from title`);
    return titleMatch[1];
  }
  
  // Check if form number is in the filename
  if (document.title?.toLowerCase().includes('66')) {
    console.log('Detected form 66 from filename');
    return '66';
  }
  
  if (document.title?.toLowerCase().includes('65')) {
    console.log('Detected form 65 from filename');
    return '65';
  }
  
  if (document.title?.toLowerCase().includes('76')) {
    console.log('Detected form 76 from filename');
    return '76';
  }
  
  // Fallback - detect based on form type in title
  if (document.title?.toLowerCase().includes('consumer proposal')) {
    console.log('Detected form 66 based on "consumer proposal" in title');
    return '66';
  }
  
  if (document.title?.toLowerCase().includes('notice of intention')) {
    console.log('Detected form 65 based on "notice of intention" in title');
    return '65';
  }
  
  if (document.title?.toLowerCase().includes('bankruptcy')) {
    console.log('Detected form 76 based on "bankruptcy" in title');
    return '76';
  }
  
  return '';
};

/**
 * Detects form type from document title or metadata
 */
export const detectFormType = (document: any): string => {
  const title = document.title?.toLowerCase() || '';
  
  if (title.includes('consumer proposal') || title.includes('form 66') || title.includes('f66')) {
    console.log('Detected form type: consumer proposal');
    return 'consumer proposal';
  }
  
  if (title.includes('notice of intention') || title.includes('form 65') || title.includes('f65')) {
    console.log('Detected form type: notice of intention');
    return 'notice of intention';
  }
  
  if (title.includes('bankruptcy') || title.includes('form 76') || title.includes('f76')) {
    console.log('Detected form type: bankruptcy');
    return 'bankruptcy';
  }
  
  // Check for form number and infer type
  const formNum = detectFormNumber(document);
  if (formNum === '66') return 'consumer proposal';
  if (formNum === '65') return 'notice of intention';
  if (formNum === '76') return 'bankruptcy';
  
  return '';
};

/**
 * Process analysis content to ensure it has the correct structure
 */
export const processAnalysisContent = (document: any) => {
  // Process the analysis content
  let processedAnalysis = null;
  
  // Detect form information for better analysis
  const formNumber = detectFormNumber(document);
  const formType = detectFormType(document);
  
  console.log(`Processing document with detected form: ${formNumber}, type: ${formType}`);
  
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
        formNumber: analysisContent.extracted_info?.formNumber || formNumber || 
                   document.title.match(/Form\s+(\d+)/)?.[1] || 
                   document.title.match(/F(\d+)/)?.[1] || '',
        formType: analysisContent.extracted_info?.type || 
                 analysisContent.extracted_info?.formType || 
                 formType || '',
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

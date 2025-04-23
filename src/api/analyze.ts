import { Request, Response } from 'express';

/**
 * Document analysis API endpoint
 * 
 * This is a simple implementation that processes uploaded PDF files
 * and returns analysis results. In a production environment, this would
 * connect to a more sophisticated document analysis service.
 */
export const analyzeDocument = async (req: Request, res: Response) => {
  try {
    // Check if a file was uploaded
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Get the file information
    const file = req.file;
    
    // Log the file details
    console.log(`Processing file: ${file.originalname}, size: ${file.size} bytes, type: ${file.mimetype}`);
    
    // In a real implementation, this would send the file to a document analysis service
    // For now, we'll generate a more dynamic analysis based on the file name and size
    
    // Extract potential form number from filename
    const formNumberMatch = file.originalname.match(/form[_\s-]*(\d+)/i) || 
                           file.originalname.match(/f(\d+)/i);
    const formNumber = formNumberMatch ? formNumberMatch[1] : '';
    
    // Determine form type based on filename
    let formType = 'Unknown';
    if (file.originalname.toLowerCase().includes('bankruptcy')) {
      formType = 'Bankruptcy Filing';
    } else if (file.originalname.toLowerCase().includes('proposal') || formNumber === '47') {
      formType = 'Consumer Proposal';
    } else if (file.originalname.toLowerCase().includes('claim') || formNumber === '31') {
      formType = 'Proof of Claim';
    } else if (formNumber) {
      formType = `Form ${formNumber}`;
    }
    
    // Generate a risk level based on file size (just for demonstration)
    let riskLevel: 'low' | 'medium' | 'high' = 'medium';
    if (file.size < 100000) {
      riskLevel = 'high'; // Small files might be incomplete
    } else if (file.size > 500000) {
      riskLevel = 'low'; // Larger files tend to be more complete
    }
    
    // Generate a list of potentially missing fields
    const missingFields = [];
    if (riskLevel === 'high') {
      missingFields.push('Signature', 'Date', 'Contact Information');
    } else if (riskLevel === 'medium') {
      missingFields.push('Supporting Documentation');
    }
    
    // Generate a narrative based on the form type and risk level
    let narrative = `This appears to be a ${formType} document`;
    if (formType === 'Bankruptcy Filing') {
      narrative += ` with ${riskLevel} risk level. The document ${riskLevel === 'high' ? 'has several missing required fields' : riskLevel === 'medium' ? 'may need additional supporting documentation' : 'appears to be complete'}.`;
    } else if (formType === 'Consumer Proposal') {
      narrative += ` (Form 47) with ${riskLevel} risk level. The proposal ${riskLevel === 'high' ? 'is missing critical information' : riskLevel === 'medium' ? 'needs additional details' : 'contains all required information'}.`;
    } else if (formType === 'Proof of Claim') {
      narrative += ` with ${riskLevel} risk level. The claim ${riskLevel === 'high' ? 'lacks required creditor information' : riskLevel === 'medium' ? 'needs verification of claim amount' : 'appears to be properly documented'}.`;
    } else {
      narrative += `. The document has a ${riskLevel} risk level and ${missingFields.length > 0 ? 'may be missing some required information' : 'appears to be complete'}.`;
    }
    
    // Create the analysis result
    const analysisResult = {
      formType,
      keyFields: {
        fileName: file.originalname,
        fileSize: `${(file.size / 1024).toFixed(2)} KB`,
        formNumber: formNumber || 'Unknown',
        uploadDate: new Date().toISOString(),
        mimeType: file.mimetype
      },
      missingFields,
      validationIssues: missingFields.map(field => `Missing ${field}`),
      riskLevel,
      narrative
    };
    
    // Return the analysis result
    return res.status(200).json(analysisResult);
    
  } catch (error) {
    console.error('Error analyzing document:', error);
    return res.status(500).json({ error: 'Failed to analyze document' });
  }
};

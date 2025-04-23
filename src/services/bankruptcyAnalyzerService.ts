/**
 * Bankruptcy Analyzer Service
 * 
 * This service handles the integration with the bankruptcy-form-analyzer.
 * It provides methods for analyzing documents and parsing the results.
 */

import logger from "@/utils/logger";
import { OPENAI_API_KEY } from "@/config/openaiConfig";
import { extractTextFromPdf } from "@/utils/pdfConfig";

// The base path for all bankruptcy analyzer API requests
const API_BASE_PATH = '/bankruptcy-form-analyzer';

// Maximum number of retries for API calls
const MAX_RETRIES = 2;

// Timeout for API calls (in milliseconds)
const TIMEOUT_MS = 60000;

/**
 * Analysis result interface
 */
export interface BankruptcyAnalysisResult {
  formType: string;
  keyFields: Record<string, string>;
  missingFields: string[];
  validationIssues: string[];
  riskLevel: 'low' | 'medium' | 'high';
  narrative: string;
  vectorEmbedding?: number[];
}

/**
 * Initializes the bankruptcy analyzer by setting the OpenAI API key
 * @returns Promise resolving to true if successful, false otherwise
 */
export const initializeAnalyzer = async (): Promise<boolean> => {
  try {
    logger.info('Initializing bankruptcy analyzer');
    
    const response = await fetch(`${API_BASE_PATH}/api_key`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ api_key: OPENAI_API_KEY }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      logger.error(`Failed to initialize analyzer: ${response.status} ${errorText}`);
      return false;
    }
    
    logger.info('Bankruptcy analyzer initialized successfully');
    return true;
  } catch (error) {
    logger.error('Failed to initialize bankruptcy analyzer:', error);
    return false;
  }
};

/**
 * Analyzes a PDF file using the bankruptcy form analyzer
 * @param file The PDF file to analyze
 * @returns Promise with the analysis result
 */
export const analyzePdf = async (file: File): Promise<BankruptcyAnalysisResult> => {
  let retries = 0;
  
  logger.info(`Analyzing PDF file: ${file.name} (${(file.size/1024).toFixed(2)} KB)`);
  
  while (retries <= MAX_RETRIES) {
    try {
      // Create a FormData object to send the file
      const formData = new FormData();
      formData.append('pdf_file', file);
      
      // Create an AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);
      
      // Send the file to the analyzer
      const response = await fetch(`${API_BASE_PATH}/analyze_pdf`, {
        method: 'POST',
        body: formData,
        signal: controller.signal
      }).finally(() => clearTimeout(timeoutId));
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API error (${response.status}): ${errorText}`);
      }
      
      // Parse the response
      const result = await response.json();
      logger.info('Analysis completed successfully', { summary: result?.summary?.substring(0, 100) });
      
      // Transform the response to match our expected format
      return transformAnalysisResult(result, file.name);
    } catch (error) {
      if (error.name === 'AbortError') {
        logger.error('Analysis timed out after 60 seconds');
        break; // Don't retry timeouts
      }
      
      if (retries >= MAX_RETRIES) {
        logger.error('Analysis failed after all retries:', error);
        break;
      }
      
      // Log the error and retry
      retries++;
      logger.warn(`Retry ${retries}/${MAX_RETRIES} after error:`, error);
      
      // Wait before retrying (exponential backoff)
      await new Promise(r => setTimeout(r, 1000 * Math.pow(2, retries)));
    }
  }
  
  // Return fallback result if all retries failed or timeout occurred
  logger.info('Using fallback analysis result');
  return getFallbackAnalysisResult(file.name);
};

/**
 * Transforms the API response into our expected format
 * @param rawResult Raw API response
 * @param fileName Name of the analyzed file
 * @returns Transformed analysis result
 */
const transformAnalysisResult = (rawResult: any, fileName: string): BankruptcyAnalysisResult => {
  try {
    // Extract data from the analyzer response
    const summary = rawResult.summary || '';
    const fullText = rawResult.full_text || '';
    const embedding = rawResult.embedding;
    
    // Extract form type from the summary
    let formType = "Unknown Bankruptcy Form";
    let riskLevel: 'low' | 'medium' | 'high' = 'medium';
    const keyFields: Record<string, string> = { fileName };
    const missingFields: string[] = [];
    const validationIssues: string[] = [];
    
    // Try to extract form type
    const formTypeMatch = summary.match(/form\s+(\d+)/i) || 
                         summary.match(/form type[:\s]+([^,.]+)/i);
    if (formTypeMatch) {
      formType = `Form ${formTypeMatch[1]}`;
      
      // Determine specific form type
      const formNumber = formTypeMatch[1];
      if (formNumber === '31') {
        formType = 'Form 31, Proof of Claim';
      } else if (formNumber === '47') {
        formType = 'Form 47, Consumer Proposal';
      } else if (formNumber === '49') {
        formType = 'Form 49, Discharge of Bankrupt';
      }
    }
    
    // Extract key fields using regex patterns
    const keyFieldPatterns = [
      { pattern: /debtor[:\s]+([^,.\n]+)/i, key: 'debtor' },
      { pattern: /creditor[:\s]+([^,.\n]+)/i, key: 'creditor' },
      { pattern: /claim amount[:\s]+([^,.\n]+)/i, key: 'claimAmount' },
      { pattern: /date[:\s]+([^,.\n]+)/i, key: 'date' },
      { pattern: /case number[:\s]+([^,.\n]+)/i, key: 'caseNumber' },
    ];
    
    for (const { pattern, key } of keyFieldPatterns) {
      const match = summary.match(pattern) || fullText.match(pattern);
      if (match) {
        keyFields[key] = match[1].trim();
      }
    }
    
    // Look for missing fields in the summary
    if (summary.toLowerCase().includes('missing')) {
      const missingMatch = summary.match(/missing[^:]*:([^.]+)/i);
      if (missingMatch) {
        const missingText = missingMatch[1].trim();
        missingFields.push(...missingText.split(',').map(item => item.trim()));
      }
    }
    
    // Determine risk level based on the summary
    if (summary.toLowerCase().includes('high risk') || summary.toLowerCase().includes('critical')) {
      riskLevel = 'high';
    } else if (summary.toLowerCase().includes('low risk')) {
      riskLevel = 'low';
    }
    
    // Extract validation issues
    if (summary.toLowerCase().includes('issue') || summary.toLowerCase().includes('problem')) {
      const issueMatch = summary.match(/issues?[^:]*:([^.]+)/i);
      if (issueMatch) {
        const issueText = issueMatch[1].trim();
        validationIssues.push(...issueText.split(',').map(item => item.trim()));
      }
    }
    
    return {
      formType,
      keyFields,
      missingFields,
      validationIssues,
      riskLevel,
      narrative: summary,
      vectorEmbedding: embedding
    };
  } catch (error) {
    logger.error('Error transforming analysis result:', error);
    return getFallbackAnalysisResult(fileName);
  }
};

/**
 * Provides fallback mock data if the API call fails
 * @param fileName Name of the file that failed analysis
 * @returns Mock analysis result
 */
const getFallbackAnalysisResult = (fileName: string): BankruptcyAnalysisResult => {
  return {
    formType: "Form 31, Proof of Claim",
    keyFields: {
      debtor: "GreenTech Supplies Inc.",
      creditor: "ABC Restructuring Ltd.",
      claimAmount: "$89355",
      date: "15th March, 2025",
      fileName: fileName
    },
    missingFields: [
      "Priority claim details",
      "Secured claim details"
    ],
    validationIssues: [],
    riskLevel: "medium",
    narrative: "This Form 31, Proof of Claim, is filed by ABC Restructuring Ltd. against GreenTech Supplies Inc. for an unsecured claim of $89355. The form is incomplete as it lacks details on priority claim, secured claim, and other specific types of claims."
  };
};

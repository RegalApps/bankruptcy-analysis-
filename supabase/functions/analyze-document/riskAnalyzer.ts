
import { Risk, DocumentAnalysis } from "./types.ts";

const checkBIADocumentation = (text: string): Risk | null => {
  if (!text.includes('Notice of Bankruptcy') && !text.includes('Statement of Affairs')) {
    return {
      type: 'BIA Documentation Risk',
      description: 'Missing required bankruptcy documentation under BIA Section 49(1)',
      severity: 'high',
      impact: 'Non-compliance with mandatory bankruptcy filing requirements',
      regulation: 'Bankruptcy and Insolvency Act (BIA) Section 49(1)',
      requiredAction: 'Submit complete bankruptcy documentation including Notice of Bankruptcy and Statement of Affairs',
      solution: "Review Directive No. 23 at https://ised-isde.canada.ca/site/office-superintendent-bankruptcy/en/directives-and-circulars for documentation requirements"
    };
  }
  return null;
};

const checkCreditorMeeting = (text: string): Risk | null => {
  if (text.includes('meeting of creditors') && !text.includes('notice to creditors')) {
    return {
      type: 'Creditor Meeting Compliance Risk',
      description: 'Inadequate creditor notification for meeting under BIA Section 102(2)',
      severity: 'high',
      impact: 'Potential invalidation of creditors meeting proceedings',
      regulation: 'BIA Section 102(2) and Directive No. 9R6',
      requiredAction: 'Ensure proper notice is given to all creditors within prescribed timeframe',
      solution: "Follow notification requirements outlined in Directive No. 9R6 at https://ised-isde.canada.ca/site/office-superintendent-bankruptcy/en/directives-and-circulars"
    };
  }
  return null;
};

const checkTrusteeAuthorization = (text: string): Risk | null => {
  if (!text.includes('trustee') || !text.includes('licensed')) {
    return {
      type: 'Trustee Authorization Risk',
      description: 'Potential unauthorized administration of bankruptcy estate',
      severity: 'high',
      impact: 'Violation of BIA trustee licensing requirements',
      regulation: 'BIA Section 13.2 and Directive No. 13R6',
      requiredAction: 'Verify trustee licensing status and authorization',
      solution: "Consult OSB's Licensed Insolvency Trustee requirements at https://ised-isde.canada.ca/site/office-superintendent-bankruptcy/en/directives-and-circulars/directive-no-13r6-licensing-trustees"
    };
  }
  return null;
};

const checkConsumerProposal = (text: string): Risk | null => {
  if (text.includes('consumer proposal') && !text.includes('assessment certificate')) {
    return {
      type: 'Consumer Proposal Compliance Risk',
      description: 'Missing mandatory counselling assessment for consumer proposal',
      severity: 'high',
      impact: 'Non-compliance with BIA counselling requirements',
      regulation: 'BIA Directive No. 1R5',
      requiredAction: 'Complete mandatory counselling sessions and obtain assessment certificate',
      solution: "Review counselling requirements in Directive No. 1R5 at https://ised-isde.canada.ca/site/office-superintendent-bankruptcy/en/directives-and-circulars"
    };
  }
  return null;
};

const checkDocumentExecution = (text: string): Risk | null => {
  if (!text.includes('signed') || !text.includes('dated')) {
    return {
      type: 'Document Execution Risk',
      description: 'Improper document execution under BIA requirements',
      severity: 'high',
      impact: 'Potential invalidity of bankruptcy documentation',
      regulation: 'BIA Section 148 and General Rules',
      requiredAction: 'Ensure all documents are properly signed and dated by authorized parties',
      solution: "Review documentation requirements in the BIA General Rules at https://laws-lois.justice.gc.ca/eng/regulations/C.R.C.,_c._368/"
    };
  }
  return null;
};

const checkCCAACompliance = (text: string): Risk | null => {
  if (text.includes('CCAA') || text.includes('Companies\' Creditors Arrangement Act')) {
    return {
      type: 'CCAA Compliance Risk',
      description: 'Additional compliance requirements under CCAA',
      severity: 'high',
      impact: 'Potential non-compliance with CCAA requirements',
      regulation: 'Companies\' Creditors Arrangement Act (CCAA)',
      requiredAction: 'Review and ensure compliance with CCAA requirements',
      solution: "Consult CCAA guidelines at https://laws-lois.justice.gc.ca/eng/acts/C-36/index.html"
    };
  }
  return null;
};

export function analyzeDocument(text: string): DocumentAnalysis {
  const analysis: DocumentAnalysis = {
    extracted_info: {
      type: 'unknown',
      formNumber: '',
      summary: ''
    },
    risks: []
  };

  // Basic form info extraction
  const formMatches = text.match(/FORM (\d+)|Form (\d+)/);
  if (formMatches) {
    analysis.extracted_info.formNumber = formMatches[1] || formMatches[2];
  }

  // Run all risk checks and filter out null results
  const risks = [
    checkBIADocumentation(text),
    checkCreditorMeeting(text),
    checkTrusteeAuthorization(text),
    checkConsumerProposal(text),
    checkDocumentExecution(text),
    checkCCAACompliance(text)
  ].filter((risk): risk is Risk => risk !== null);

  analysis.risks = risks;
  console.log('Enhanced BIA/CCAA compliance analysis completed:', analysis);
  return analysis;
}

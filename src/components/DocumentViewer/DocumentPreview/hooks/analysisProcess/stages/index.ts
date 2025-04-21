
import { documentIngestion } from './documentIngestion';
import { documentClassification } from './documentClassification';
import { dataExtraction } from './dataExtraction';
import { riskAssessment } from './riskAssessment';
import { issuePrioritization } from './issuePrioritization';
import { documentOrganization } from './documentOrganization';
import { collaborationSetup } from './collaborationSetup';
import { continuousLearning } from './continuousLearning';

export const stages = {
  documentIngestion: {
    description: 'Document Ingestion & Preprocessing',
    detailedDescription: 'Retrieving document record and preparing for analysis'
  },
  documentClassification: {
    description: 'Document Classification & Understanding',
    detailedDescription: 'Analyzing document type and extracting initial insights'
  },
  dataExtraction: {
    description: 'Data Extraction & Content Processing',
    detailedDescription: 'Extracting key information and metadata from the document'
  },
  riskAssessment: {
    description: 'Risk & Compliance Assessment',
    detailedDescription: 'Evaluating potential risks and regulatory compliance'
  },
  issuePrioritization: {
    description: 'Issue Prioritization & Task Management',
    detailedDescription: 'Identifying and prioritizing key issues for action'
  },
  documentOrganization: {
    description: 'Document Organization & Client Management',
    detailedDescription: 'Organizing document details and preparing client-related information'
  },
  collaborationSetup: {
    description: 'User Notification & Collaboration',
    detailedDescription: 'Setting up collaboration workspace and user notifications'
  },
  continuousLearning: {
    description: 'Continuous AI Learning & Improvement',
    detailedDescription: 'Gathering insights for AI model improvement'
  }
};

export {
  documentIngestion,
  documentClassification,
  dataExtraction,
  riskAssessment,
  issuePrioritization,
  documentOrganization,
  collaborationSetup,
  continuousLearning
};

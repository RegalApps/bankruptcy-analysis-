
import { DocumentRisk } from '../types';

export interface Task {
  taskID: string;
  sourceReference: string;
  taskTitle: string;
  taskDescription: string;
  taskType: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'open' | 'in_progress' | 'complete' | 'overdue';
  dueDate?: string;
  daysRemaining?: number;
  assignedTo?: {
    userRole?: string;
    userId?: string;
  };
  documentReferences?: Array<{
    documentID: string;
    documentName: string;
    page?: number;
    fieldID?: string;
  }>;
  actionRequired?: {
    actionType: string;
    actionInstructions: string;
  };
}

export function generateTasksFromRisks(
  documentId: string,
  documentName: string,
  risks: DocumentRisk[],
  assignmentRules?: Record<string, string>
): Task[] {
  if (!risks || risks.length === 0) {
    return [];
  }
  
  return risks
    .filter(risk => risk.severity === 'critical' || risk.severity === 'high' || risk.severity === 'medium')
    .map(risk => {
      return createTaskFromRisk(risk, documentId, documentName, assignmentRules);
    });
}

function createTaskFromRisk(
  risk: DocumentRisk,
  documentId: string,
  documentName: string,
  assignmentRules?: Record<string, string>
): Task {
  // Generate a unique task ID
  const taskID = `TASK-${crypto.randomUUID().substring(0, 8)}`;
  
  // Determine task type based on risk type
  const taskType = determineTaskType(risk.type);
  
  // Determine task due date based on risk severity
  const { dueDate, daysRemaining } = calculateDueDate(risk.severity, risk.deadline);
  
  // Determine who should be assigned based on risk type
  const assignedRole = determineAssignedRole(risk.type, assignmentRules);
  
  // Create the task
  const task: Task = {
    taskID,
    sourceReference: risk.id,
    taskTitle: createTaskTitle(risk),
    taskDescription: risk.description,
    taskType,
    severity: risk.severity,
    status: 'open',
    dueDate,
    daysRemaining,
    assignedTo: {
      userRole: assignedRole
    },
    documentReferences: [
      {
        documentID: documentId,
        documentName,
        page: risk.position?.page
      }
    ],
    actionRequired: {
      actionType: determineActionType(risk.type),
      actionInstructions: risk.solution || `Address the ${risk.severity} issue: ${risk.description}`
    }
  };
  
  return task;
}

// Helper function to create a task title from a risk
function createTaskTitle(risk: DocumentRisk): string {
  // For common risk types, create specific titles
  if (risk.type.includes('MISSING_') || risk.type.includes('MISSING ')) {
    const missingItem = risk.type
      .replace('MISSING_', '')
      .replace('MISSING ', '')
      .replace(/_/g, ' ')
      .toLowerCase();
    
    return `Add missing ${missingItem}`;
  }
  
  if (risk.type.includes('INCOMPLETE_') || risk.type.includes('INCOMPLETE ')) {
    const incompleteItem = risk.type
      .replace('INCOMPLETE_', '')
      .replace('INCOMPLETE ', '')
      .replace(/_/g, ' ')
      .toLowerCase();
    
    return `Complete ${incompleteItem}`;
  }
  
  // Default to using the risk description
  return risk.description;
}

// Helper function to determine task type based on risk type
function determineTaskType(riskType: string): string {
  const riskTypeLower = riskType.toLowerCase();
  
  if (riskTypeLower.includes('missing') || riskTypeLower.includes('incomplete')) {
    return 'DOCUMENT_CORRECTION';
  }
  
  if (riskTypeLower.includes('signature')) {
    return 'SIGNATURE_REQUIRED';
  }
  
  if (riskTypeLower.includes('calculation') || riskTypeLower.includes('amount')) {
    return 'DATA_CORRECTION';
  }
  
  if (riskTypeLower.includes('deadline') || riskTypeLower.includes('date')) {
    return 'TIMELINE_REQUIREMENT';
  }
  
  if (riskTypeLower.includes('privacy') || riskTypeLower.includes('security')) {
    return 'PRIVACY_SECURITY';
  }
  
  if (riskTypeLower.includes('verification') || riskTypeLower.includes('validate')) {
    return 'VERIFICATION';
  }
  
  return 'GENERAL_TASK';
}

// Helper function to calculate due date based on severity
function calculateDueDate(severity: string, deadline?: string): { dueDate?: string; daysRemaining?: number } {
  // If there's a specific deadline mentioned in the risk, parse and use it
  if (deadline) {
    if (deadline === 'BEFORE_FILING') {
      // Set deadline to 1 day from now for "before filing" deadlines
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 1);
      const formattedDueDate = dueDate.toISOString().split('T')[0];
      return {
        dueDate: formattedDueDate,
        daysRemaining: 1
      };
    }
    
    if (deadline.match(/\d{4}-\d{2}-\d{2}/)) {
      // It's already in YYYY-MM-DD format
      const dueDate = new Date(deadline);
      const today = new Date();
      const daysRemaining = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      return {
        dueDate: deadline,
        daysRemaining
      };
    }
  }
  
  // Set due date based on severity
  const today = new Date();
  let daysToAdd = 0;
  
  switch (severity) {
    case 'critical':
      daysToAdd = 1; // 1 day for critical issues
      break;
    case 'high':
      daysToAdd = 3; // 3 days for high-priority issues
      break;
    case 'medium':
      daysToAdd = 7; // 7 days for medium-priority issues
      break;
    default:
      daysToAdd = 14; // 14 days for low-priority issues
  }
  
  const dueDate = new Date(today);
  dueDate.setDate(today.getDate() + daysToAdd);
  
  return {
    dueDate: dueDate.toISOString().split('T')[0],
    daysRemaining: daysToAdd
  };
}

// Helper function to determine assigned role based on risk type
function determineAssignedRole(riskType: string, assignmentRules?: Record<string, string>): string {
  const riskTypeLower = riskType.toLowerCase();
  
  // If assignment rules are provided, check for matches
  if (assignmentRules) {
    for (const [pattern, role] of Object.entries(assignmentRules)) {
      if (riskTypeLower.includes(pattern.toLowerCase())) {
        return role;
      }
    }
  }
  
  // Default assignment rules
  if (riskTypeLower.includes('signature')) {
    return 'trustee';
  }
  
  if (riskTypeLower.includes('calculation') || riskTypeLower.includes('amount')) {
    return 'financial_analyst';
  }
  
  if (riskTypeLower.includes('deadline') || riskTypeLower.includes('date')) {
    return 'administrator';
  }
  
  if (riskTypeLower.includes('legal') || riskTypeLower.includes('compliance')) {
    return 'compliance_officer';
  }
  
  if (riskTypeLower.includes('privacy') || riskTypeLower.includes('security')) {
    return 'privacy_officer';
  }
  
  if (riskTypeLower.includes('incomplete') || riskTypeLower.includes('missing')) {
    return 'case_manager';
  }
  
  return 'case_manager'; // Default assignment
}

// Helper function to determine action type
function determineActionType(riskType: string): string {
  const riskTypeLower = riskType.toLowerCase();
  
  if (riskTypeLower.includes('signature')) {
    return 'OBTAIN_SIGNATURE';
  }
  
  if (riskTypeLower.includes('missing')) {
    return 'ADD_INFORMATION';
  }
  
  if (riskTypeLower.includes('incomplete')) {
    return 'COMPLETE_FORM';
  }
  
  if (riskTypeLower.includes('verification')) {
    return 'VERIFY';
  }
  
  if (riskTypeLower.includes('calculation')) {
    return 'RECALCULATE';
  }
  
  if (riskTypeLower.includes('privacy')) {
    return 'SECURE_INFO';
  }
  
  return 'REVIEW';
}

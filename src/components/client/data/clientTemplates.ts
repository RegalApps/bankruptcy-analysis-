
import { Client, Document, Task } from "../types";

// Template client data
export const getClientData = (clientId: string): Client => {
  const clientTemplates: Record<string, Client> = {
    'josh-hart': {
      id: 'josh-hart',
      name: 'Josh Hart',
      status: 'active',
      location: 'Ontario',
      email: 'josh.hart@example.com',
      phone: '(555) 123-4567',
      address: '123 Maple Street',
      city: 'Toronto',
      province: 'Ontario',
      postalCode: 'M5V 2L7',
      company: 'ABC Corporation',
      occupation: 'Software Developer',
      mobilePhone: '(555) 987-6543',
      notes: 'Josh is a priority client who needs regular updates on his case.',
      metrics: {
        openTasks: 3,
        pendingDocuments: 2,
        urgentDeadlines: 1
      },
      last_interaction: new Date().toISOString(),
      engagement_score: 85
    },
    'jane-smith': {
      id: 'jane-smith',
      name: 'Jane Smith',
      status: 'active',
      location: 'British Columbia',
      email: 'jane.smith@example.com',
      phone: '(555) 234-5678',
      address: '456 Oak Avenue',
      city: 'Vancouver',
      province: 'British Columbia',
      postalCode: 'V6B 1S3',
      company: 'Coastal Designs',
      occupation: 'Graphic Designer',
      mobilePhone: '(555) 765-4321',
      notes: 'Jane is a new client who has been very responsive to communications.',
      metrics: {
        openTasks: 2,
        pendingDocuments: 1,
        urgentDeadlines: 0
      },
      last_interaction: new Date(Date.now() - 86400000 * 2).toISOString(),
      engagement_score: 92
    },
    'robert-johnson': {
      id: 'robert-johnson',
      name: 'Robert Johnson',
      status: 'pending',
      location: 'Alberta',
      email: 'robert.johnson@example.com',
      phone: '(555) 345-6789',
      address: '789 Pine Boulevard',
      city: 'Calgary',
      province: 'Alberta',
      postalCode: 'T2P 1J9',
      company: 'Mountain Financial Services',
      occupation: 'Financial Advisor',
      mobilePhone: '(555) 432-1098',
      notes: 'Robert needs to complete his Form 32 documentation as soon as possible.',
      metrics: {
        openTasks: 5,
        pendingDocuments: 3,
        urgentDeadlines: 2
      },
      last_interaction: new Date(Date.now() - 86400000 * 5).toISOString(),
      engagement_score: 67
    },
    'maria-garcia': {
      id: 'maria-garcia',
      name: 'Maria Garcia',
      status: 'flagged',
      location: 'Quebec',
      email: 'maria.garcia@example.com',
      phone: '(555) 456-7890',
      address: '101 Elm Street',
      city: 'Montreal',
      province: 'Quebec',
      postalCode: 'H2Y 1C6',
      company: 'Innovative Solutions Inc.',
      occupation: 'Project Manager',
      mobilePhone: '(555) 321-0987',
      notes: 'Urgent: Maria needs to sign her Form 43 Consumer Proposal before the deadline.',
      metrics: {
        openTasks: 4,
        pendingDocuments: 3,
        urgentDeadlines: 3
      },
      last_interaction: new Date(Date.now() - 86400000 * 8).toISOString(),
      engagement_score: 45
    }
  };

  // Return the specific client template or a default one if not found
  return clientTemplates[clientId] || {
    id: clientId,
    name: clientId.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' '),
    status: 'active',
    location: 'Unknown',
    metrics: {
      openTasks: 0,
      pendingDocuments: 0,
      urgentDeadlines: 0
    }
  };
};

// Template document data for each client
export const getClientDocuments = (clientId: string): Document[] => {
  const now = new Date().toISOString();
  const yesterday = new Date(Date.now() - 86400000).toISOString();
  const lastWeek = new Date(Date.now() - 86400000 * 7).toISOString();

  // Documents specific to each client
  const clientDocuments: Record<string, Document[]> = {
    'josh-hart': [
      {
        id: 'form47-document',
        title: 'Form 47 - Consumer Proposal',
        type: 'Legal',
        created_at: yesterday,
        updated_at: now,
        metadata: {
          client_id: 'josh-hart',
          status: 'pending-review',
          urgency: 'high'
        }
      },
      {
        id: 'budget-2025',
        title: 'Budget 2025',
        type: 'Financial',
        created_at: lastWeek,
        updated_at: yesterday,
        metadata: {
          client_id: 'josh-hart',
          status: 'draft'
        }
      },
      {
        id: 'id-verification',
        title: 'ID Verification Documents',
        type: 'Personal',
        created_at: lastWeek,
        updated_at: lastWeek,
        metadata: {
          client_id: 'josh-hart',
          status: 'complete'
        }
      }
    ],
    'jane-smith': [
      {
        id: 'tax-return-2023',
        title: 'Tax Return 2023',
        type: 'Financial',
        created_at: lastWeek,
        updated_at: lastWeek,
        metadata: {
          client_id: 'jane-smith',
          status: 'complete'
        }
      },
      {
        id: 'employment-verification',
        title: 'Employment Verification',
        type: 'Documentation',
        created_at: lastWeek,
        updated_at: yesterday,
        metadata: {
          client_id: 'jane-smith',
          status: 'complete'
        }
      },
      {
        id: 'financial-assessment',
        title: 'Financial Assessment Report',
        type: 'Analysis',
        created_at: yesterday,
        updated_at: now,
        metadata: {
          client_id: 'jane-smith',
          status: 'pending-review'
        }
      }
    ],
    'robert-johnson': [
      {
        id: 'form32-draft',
        title: 'Form 32 - Debt Restructuring (Draft)',
        type: 'Legal',
        created_at: lastWeek,
        updated_at: yesterday,
        metadata: {
          client_id: 'robert-johnson',
          status: 'needs-review'
        }
      },
      {
        id: 'bank-statements-q1',
        title: 'Bank Statements Q1 2024',
        type: 'Financial',
        created_at: yesterday,
        updated_at: yesterday,
        metadata: {
          client_id: 'robert-johnson',
          status: 'complete'
        }
      },
      {
        id: 'credit-report',
        title: 'Credit Report',
        type: 'Financial',
        created_at: yesterday,
        updated_at: now,
        metadata: {
          client_id: 'robert-johnson',
          status: 'complete'
        }
      }
    ],
    'maria-garcia': [
      {
        id: 'form43-proposal',
        title: 'Form 43 - Consumer Proposal',
        type: 'Legal',
        created_at: lastWeek,
        updated_at: yesterday,
        metadata: {
          client_id: 'maria-garcia',
          status: 'needs-signature',
          urgency: 'critical'
        }
      },
      {
        id: 'creditor-list',
        title: 'Creditor List',
        type: 'Financial',
        created_at: lastWeek,
        updated_at: lastWeek,
        metadata: {
          client_id: 'maria-garcia',
          status: 'needs-review'
        }
      },
      {
        id: 'income-expense-statement',
        title: 'Income & Expense Statement',
        type: 'Financial',
        created_at: lastWeek,
        updated_at: now,
        metadata: {
          client_id: 'maria-garcia',
          status: 'needs-review'
        }
      }
    ]
  };

  return clientDocuments[clientId] || [];
};

// Template tasks for each client
export const getClientTasks = (clientId: string): Task[] => {
  const now = new Date().toISOString();
  const nextWeek = new Date(Date.now() + 86400000 * 7).toISOString();
  const twoWeeks = new Date(Date.now() + 86400000 * 14).toISOString();

  const clientTasks: Record<string, Task[]> = {
    'josh-hart': [
      {
        id: 'task-1',
        title: 'Review Form 47 submission',
        dueDate: now,
        status: 'pending',
        priority: 'high'
      },
      {
        id: 'task-2',
        title: 'Collect additional financial documents',
        dueDate: nextWeek,
        status: 'pending',
        priority: 'medium'
      },
      {
        id: 'task-3',
        title: 'Schedule follow-up meeting',
        dueDate: twoWeeks,
        status: 'pending',
        priority: 'low'
      }
    ],
    'jane-smith': [
      {
        id: 'task-4',
        title: 'Finalize financial assessment',
        dueDate: nextWeek,
        status: 'pending',
        priority: 'medium'
      },
      {
        id: 'task-5',
        title: 'Request additional references',
        dueDate: twoWeeks,
        status: 'pending',
        priority: 'low'
      }
    ],
    'robert-johnson': [
      {
        id: 'task-6',
        title: 'Complete Form 32 review',
        dueDate: now,
        status: 'pending',
        priority: 'high'
      },
      {
        id: 'task-7',
        title: 'Verify credit report data',
        dueDate: nextWeek,
        status: 'pending',
        priority: 'medium'
      },
      {
        id: 'task-8',
        title: 'Contact financial institution',
        dueDate: nextWeek,
        status: 'pending',
        priority: 'medium'
      },
      {
        id: 'task-9',
        title: 'Prepare restructuring proposal',
        dueDate: twoWeeks,
        status: 'pending',
        priority: 'high'
      },
      {
        id: 'task-10',
        title: 'Schedule client meeting',
        dueDate: twoWeeks,
        status: 'pending',
        priority: 'medium'
      }
    ],
    'maria-garcia': [
      {
        id: 'task-11',
        title: 'Urgent: Follow up on Form 43 signature',
        dueDate: now,
        status: 'pending',
        priority: 'high'
      },
      {
        id: 'task-12',
        title: 'Update creditor contact information',
        dueDate: nextWeek,
        status: 'pending',
        priority: 'medium'
      },
      {
        id: 'task-13',
        title: 'Review expense statement discrepancies',
        dueDate: nextWeek,
        status: 'pending',
        priority: 'high'
      },
      {
        id: 'task-14',
        title: 'Prepare for creditor meeting',
        dueDate: twoWeeks,
        status: 'pending',
        priority: 'medium'
      }
    ]
  };

  return clientTasks[clientId] || [];
};

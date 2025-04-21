
import { Client } from "../types";
import { getDateFromDaysAgo } from "./clientDocumentHelpers";

// All static client info templates
export const getClientData = (clientId: string): Client => {
  switch (clientId) {
    case 'jane-smith':
      return {
        id: 'jane-smith',
        name: 'Jane Smith',
        status: 'active',
        location: 'British Columbia',
        email: 'jane.smith@example.com',
        phone: '(555) 987-6543',
        address: '456 Pine Avenue',
        city: 'Vancouver',
        province: 'British Columbia',
        postalCode: 'V6C 1G8',
        company: 'XYZ Ltd.',
        occupation: 'Marketing Director',
        mobilePhone: '(555) 555-1234',
        notes: 'Jane is a returning client with excellent communication.',
        metrics: {
          openTasks: 2,
          pendingDocuments: 1,
          urgentDeadlines: 0
        },
        last_interaction: getDateFromDaysAgo(3),
        engagement_score: 88
      };
    case 'robert-johnson':
      return {
        id: 'robert-johnson',
        name: 'Robert Johnson',
        status: 'pending',
        location: 'Alberta',
        email: 'robert.johnson@example.com',
        phone: '(555) 222-3333',
        address: '789 Maple Drive',
        city: 'Calgary',
        province: 'Alberta',
        postalCode: 'T2P 2M5',
        company: 'Johnson Construction',
        occupation: 'Contractor',
        mobilePhone: '(555) 444-5555',
        notes: 'Robert needs help with file organization and documentation.',
        metrics: {
          openTasks: 3,
          pendingDocuments: 2,
          urgentDeadlines: 1
        },
        last_interaction: getDateFromDaysAgo(5),
        engagement_score: 72
      };
    case 'maria-garcia':
      return {
        id: 'maria-garcia',
        name: 'Maria Garcia',
        status: 'flagged',
        location: 'Quebec',
        email: 'maria.garcia@example.com',
        phone: '(555) 666-7777',
        address: '321 Oak Boulevard',
        city: 'Montreal',
        province: 'Quebec',
        postalCode: 'H3B 2Y5',
        company: 'Garcia Designs',
        occupation: 'Graphic Designer',
        mobilePhone: '(555) 888-9999',
        notes: 'Maria requires urgent attention with her proposal documentation.',
        metrics: {
          openTasks: 2,
          pendingDocuments: 3,
          urgentDeadlines: 2
        },
        last_interaction: getDateFromDaysAgo(1),
        engagement_score: 65
      };
    default:
      return {
        id: clientId,
        name: clientId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
        status: 'active',
        location: 'Unknown',
        metrics: {
          openTasks: 0,
          pendingDocuments: 0,
          urgentDeadlines: 0
        }
      };
  }
};

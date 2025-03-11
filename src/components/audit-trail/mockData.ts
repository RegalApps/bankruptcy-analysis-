
import { AuditEntry } from "./types";

// Generate a random SHA-256 like hash
const generateHash = () => {
  return 'sha256:' + Array.from({ length: 64 }, () => 
    Math.floor(Math.random() * 16).toString(16)
  ).join('');
};

export const mockAuditData: AuditEntry[] = [
  {
    id: "1",
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    user: {
      id: "user1",
      name: "John Smith",
      role: "Administrator",
      ipAddress: "192.168.1.101",
      location: "New York, US"
    },
    action: "upload",
    document: {
      id: "doc1",
      name: "Form 47 - Consumer Proposal",
      type: "application/pdf",
      version: "1.0"
    },
    critical: false,
    hash: generateHash(),
    regulatoryFramework: "OSB-EF"
  },
  {
    id: "2",
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    user: {
      id: "user2",
      name: "Sarah Johnson",
      role: "Compliance Officer",
      ipAddress: "192.168.1.102",
      location: "Toronto, CA"
    },
    action: "risk_assessment",
    document: {
      id: "doc1",
      name: "Form 47 - Consumer Proposal",
      type: "application/pdf",
      version: "1.0"
    },
    changes: [
      {
        field: "Risk Level",
        type: "modified",
        previousValue: "Low",
        newValue: "Medium"
      },
      {
        field: "Compliance Notes",
        type: "added",
        newValue: "Additional verification required for income sources."
      }
    ],
    critical: true,
    hash: generateHash(),
    regulatoryFramework: "OSB-EF"
  },
  {
    id: "3",
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    user: {
      id: "user3",
      name: "Michael Chen",
      role: "Trustee",
      ipAddress: "192.168.1.103",
      location: "Vancouver, CA"
    },
    action: "edit",
    document: {
      id: "doc1",
      name: "Form 47 - Consumer Proposal",
      type: "application/pdf",
      version: "1.1"
    },
    changes: [
      {
        field: "Client Name",
        type: "modified",
        previousValue: "Josh Hart",
        newValue: "Joshua Hart"
      },
      {
        field: "Monthly Income",
        type: "modified",
        previousValue: "$4,500",
        newValue: "$4,850"
      }
    ],
    critical: false,
    hash: generateHash()
  },
  {
    id: "4",
    timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    user: {
      id: "user4",
      name: "Emma Wilson",
      role: "Legal Advisor",
      ipAddress: "192.168.1.104",
      location: "Calgary, CA"
    },
    action: "signature",
    document: {
      id: "doc1",
      name: "Form 47 - Consumer Proposal",
      type: "application/pdf",
      version: "1.1"
    },
    changes: [
      {
        field: "Administrator Signature",
        type: "added",
        newValue: "Digitally signed by Emma Wilson"
      }
    ],
    critical: true,
    hash: generateHash(),
    regulatoryFramework: "OSB-EF"
  },
  {
    id: "5",
    timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    user: {
      id: "user5",
      name: "Alex Rodriguez",
      role: "System Administrator",
      ipAddress: "192.168.1.105",
      location: "Montreal, CA"
    },
    action: "export",
    document: {
      id: "doc1",
      name: "Form 47 - Consumer Proposal",
      type: "application/pdf",
      version: "1.1"
    },
    critical: false,
    hash: generateHash()
  },
  {
    id: "6",
    timestamp: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
    user: {
      id: "user6",
      name: "Olivia Brown",
      role: "Auditor",
      ipAddress: "192.168.1.106",
      location: "Ottawa, CA"
    },
    action: "download",
    document: {
      id: "doc1",
      name: "Form 47 - Consumer Proposal",
      type: "application/pdf",
      version: "1.1"
    },
    critical: false,
    hash: generateHash()
  },
  {
    id: "7",
    timestamp: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    user: {
      id: "user1",
      name: "John Smith",
      role: "Administrator",
      ipAddress: "192.168.1.101",
      location: "New York, US"
    },
    action: "share",
    document: {
      id: "doc1",
      name: "Form 47 - Consumer Proposal",
      type: "application/pdf",
      version: "1.0"
    },
    changes: [
      {
        field: "Shared With",
        type: "added",
        newValue: "Sarah Johnson (sarah.johnson@example.com)"
      }
    ],
    critical: false,
    hash: generateHash()
  },
  {
    id: "8",
    timestamp: new Date(Date.now() - 1000 * 60 * 400).toISOString(),
    user: {
      id: "user7",
      name: "David Lee",
      role: "Compliance Manager",
      ipAddress: "192.168.1.107",
      location: "Edmonton, CA"
    },
    action: "task_assignment",
    document: {
      id: "doc1",
      name: "Form 47 - Consumer Proposal",
      type: "application/pdf",
      version: "1.0"
    },
    changes: [
      {
        field: "Assigned Task",
        type: "added",
        newValue: "Verify debtor's income sources and documentation"
      },
      {
        field: "Assigned To",
        type: "added",
        newValue: "Sarah Johnson"
      }
    ],
    critical: false,
    hash: generateHash()
  }
];


import { IntegrationProvider } from "./types";

export const AVAILABLE_INTEGRATIONS: IntegrationProvider[] = [
  {
    id: "adobe",
    name: "Adobe",
    description: "Direct document interaction with Adobe's powerful tools",
    icon: "A",
    category: "document",
    requiredFields: [
      {
        name: "api_key",
        label: "API Key",
        type: "password"
      },
      {
        name: "client_id",
        label: "Client ID",
        type: "text"
      }
    ]
  },
  {
    id: "teamviewer",
    name: "TeamViewer",
    description: "Remote communication and support platform",
    icon: "T",
    category: "communication",
    requiredFields: [
      {
        name: "api_key",
        label: "API Token",
        type: "password"
      },
      {
        name: "client_id",
        label: "Client ID",
        type: "text"
      }
    ]
  },
  {
    id: "slack",
    name: "Slack",
    description: "Team communication platform",
    icon: "S",
    category: "communication",
    requiredFields: [
      {
        name: "api_key",
        label: "Bot Token",
        type: "password"
      },
      {
        name: "signing_secret",
        label: "Signing Secret",
        type: "password"
      }
    ]
  },
  {
    id: "docusign",
    name: "DocuSign",
    description: "Electronic signature and document management",
    icon: "D",
    category: "legal",
    requiredFields: [
      {
        name: "api_key",
        label: "Integration Key",
        type: "password"
      },
      {
        name: "account_id",
        label: "Account ID",
        type: "text"
      }
    ]
  },
  {
    id: "google_workspace",
    name: "Google Workspace",
    description: "Comprehensive suite of Google productivity tools",
    icon: "G",
    category: "productivity",
    requiredFields: [
      {
        name: "client_id",
        label: "Client ID",
        type: "text"
      },
      {
        name: "client_secret",
        label: "Client Secret",
        type: "password"
      }
    ]
  },
  {
    id: "twilio",
    name: "Twilio",
    description: "Multi-channel communication platform",
    icon: "T",
    category: "communication",
    requiredFields: [
      {
        name: "account_sid",
        label: "Account SID",
        type: "text"
      },
      {
        name: "auth_token",
        label: "Auth Token",
        type: "password"
      }
    ]
  }
];

export const INTEGRATION_FEATURES = {
  adobe: [
    "Comment and annotate documents",
    "Use Adobe's editing tools without leaving the app",
    "Real-time PDF collaboration"
  ],
  teamviewer: [
    "Host secure video calls during CRM activities",
    "Screen-sharing for document walkthroughs",
    "Remote support for users and clients"
  ],
  slack: [
    "In-app messaging between users",
    "Dedicated channels for task discussions",
    "Real-time notifications for tasks and updates"
  ],
  docusign: [
    "Secure, legally binding signatures",
    "Document signing status tracking",
    "Automated notifications for signatures"
  ],
  google_workspace: [
    "Sync meetings with Google Calendar",
    "Import and manage emails",
    "Access Google Drive for documents"
  ],
  twilio: [
    "SMS notifications for updates",
    "Voice call capabilities",
    "Two-factor authentication (2FA)"
  ]
};

export const INTEGRATION_BENEFITS = {
  adobe: "Streamlines document review and feedback processes",
  teamviewer: "Improves client onboarding, communication, and internal collaboration",
  slack: "Promotes seamless team collaboration and faster decision-making",
  docusign: "Speeds up the approval process and ensures compliance with legal standards",
  google_workspace: "Provides a seamless ecosystem for document management and scheduling",
  twilio: "Keeps users and clients informed in real-time, enhancing engagement"
};

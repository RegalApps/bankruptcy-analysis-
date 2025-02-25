
import { IntegrationProvider } from "./types";

export const AVAILABLE_INTEGRATIONS: IntegrationProvider[] = [
  {
    id: "mailchimp",
    name: "Mailchimp",
    description: "Email marketing automation",
    icon: "M",
    category: "marketing",
    requiredFields: [
      {
        name: "api_key",
        label: "API Key",
        type: "password"
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
      }
    ]
  },
  {
    id: "docusign",
    name: "DocuSign",
    description: "Digital document signing",
    icon: "D",
    category: "legal",
    requiredFields: [
      {
        name: "api_key",
        label: "Integration Key",
        type: "password"
      }
    ]
  }
];

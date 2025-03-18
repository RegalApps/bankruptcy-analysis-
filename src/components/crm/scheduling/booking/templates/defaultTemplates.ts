
import { EmailTemplate } from "./types";

export const DEFAULT_TEMPLATES: EmailTemplate[] = [
  {
    id: "template-1",
    name: "Initial Booking Request",
    subject: "Schedule Your Appointment - {{caseType}} Case",
    content: `Dear {{clientName}},

We hope this email finds you well. We're writing to provide you with a personalized booking link that will allow you to schedule your upcoming appointment for your {{caseType}} case.

Please click the link below to access our self-booking portal:
{{bookingLink}}

Based on your case details, our AI system has identified optimal appointment slots with the most suitable trustee for your specific situation. The booking system will guide you through selecting a time that works best for you.

If you have any questions or need assistance with the booking process, please don't hesitate to contact us.

Best regards,
The Trustee Team`
  },
  {
    id: "template-2",
    name: "Appointment Confirmation",
    subject: "Your Appointment is Confirmed - {{caseType}}",
    content: `Dear {{clientName}},

This email confirms your upcoming appointment:

Date: {{appointmentDate}}
Time: {{appointmentTime}}
Trustee: {{trusteeName}}
Location: {{officeAddress}}

Please arrive 10 minutes early and bring the following documents:
- Government-issued photo ID
- Recent pay stubs or income statements
- List of assets and liabilities
- Any relevant court documents

If you need to reschedule, please contact us at least 24 hours in advance.

We look forward to meeting with you.

Best regards,
The Trustee Team`
  }
];

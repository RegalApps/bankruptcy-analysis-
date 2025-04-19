
import { FormDefinition } from "@/types/formFields";

/**
 * Form 47 - Consumer Proposal
 * Based on Bankruptcy and Insolvency Act (BIA), BIA General Rules
 */
export const Form47Definition: FormDefinition = {
  id: "form-47",
  name: "Consumer Proposal",
  description: "Form for filing a consumer proposal under the BIA",
  formNumber: "47",
  category: "consumer_proposal",
  sections: [
    {
      id: "section-1",
      title: "Consumer Debtor Identification",
      fields: [
        {
          id: "consumer-debtor-name",
          name: "consumerDebtorName",
          type: "text",
          label: "Consumer Debtor Full Name",
          section: "section-1",
          required: true,
          validationRules: [
            {
              type: "required",
              message: "Debtor name is required",
              severity: "critical",
              validate: (value) => !!value,
              regulation: "BIA s. 66.13"
            }
          ],
          metadata: {
            legalSchema: "BIA s. 66.13",
            riskIndicators: ["Empty → Flag: Critical"],
            uiBehavior: "static",
            pdfLocation: { x: 1, y: 1 },
            fieldSource: "Debtor File",
            systemAction: ["Validate", "Auto-fill"],
            form11Mapping: "form1.1_debtor_name"
          }
        },
        {
          id: "consumer-debtor-address",
          name: "consumerDebtorAddress",
          type: "text",
          label: "Consumer Debtor Address",
          section: "section-1",
          required: true,
          validationRules: [
            {
              type: "required",
              message: "Debtor address is required",
              severity: "critical",
              validate: (value) => !!value,
              regulation: "BIA s. 66.13"
            }
          ],
          metadata: {
            legalSchema: "BIA s. 66.13",
            riskIndicators: ["Empty → Flag: Critical"],
            uiBehavior: "static",
            pdfLocation: { x: 2, y: 2 },
            fieldSource: "Debtor File",
            systemAction: ["Validate", "Auto-fill"],
            form11Mapping: "form1.1_debtor_address"
          }
        },
        // Additional fields would be defined similarly
      ]
    },
    {
      id: "section-2",
      title: "Administrator Identification",
      fields: [
        {
          id: "administrator-name",
          name: "administratorName",
          type: "text",
          label: "Administrator Name",
          section: "section-2",
          required: true,
          validationRules: [
            {
              type: "required",
              message: "Administrator name is required",
              severity: "critical",
              validate: (value) => !!value,
              regulation: "BIA s. 66.13(2)(c)"
            }
          ],
          metadata: {
            legalSchema: "BIA s. 66.13(2)(c)",
            riskIndicators: [
              "Empty → Flag: Critical",
              "Not in LIT registry → Flag: Critical"
            ],
            uiBehavior: "static",
            pdfLocation: { x: 8, y: 8 },
            fieldSource: "Trustee CRM",
            systemAction: ["Validate", "Auto-fill"],
            form11Mapping: "form1.1_administrator"
          }
        },
        // Additional fields would be defined similarly
      ]
    },
    // Additional sections would be defined
  ],
  validationRules: [
    (formData) => {
      // Cross-field validation example: Payment schedule validation
      const startDate = new Date(formData.paymentStartDate);
      const endDate = new Date(formData.paymentEndDate);
      
      if (startDate && endDate) {
        const fiveYearsInMs = 5 * 365 * 24 * 60 * 60 * 1000;
        if (endDate.getTime() - startDate.getTime() > fiveYearsInMs) {
          return {
            valid: false,
            message: "Payment schedule exceeds 5-year maximum term",
            severity: "high"
          };
        }
      }
      return { valid: true, message: "", severity: "low" };
    }
  ]
};

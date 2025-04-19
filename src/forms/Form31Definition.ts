
import { FormDefinition } from "@/types/formFields";

/**
 * Form 31 - Proof of Claim
 * Based on Bankruptcy and Insolvency Act (BIA), BIA General Rules
 */
export const Form31Definition: FormDefinition = {
  id: "form-31",
  name: "Proof of Claim",
  description: "Form for filing a claim in bankruptcy, proposal, or receivership proceedings",
  formNumber: "31",
  category: "claims",
  sections: [
    {
      id: "section-1",
      title: "Creditor Contact Information",
      fields: [
        {
          id: "creditor-name",
          name: "creditorName",
          type: "text",
          label: "Creditor Name",
          section: "section-1",
          required: true,
          validationRules: [
            {
              type: "required",
              message: "Creditor name is required",
              severity: "critical",
              validate: (value) => !!value,
              regulation: "BIA s. 124(1)"
            }
          ],
          metadata: {
            legalSchema: "BIA s. 124(1)",
            riskIndicators: ["Empty → Flag: Critical"],
            uiBehavior: "static"
          }
        },
        {
          id: "creditor-address",
          name: "creditorAddress",
          type: "text",
          label: "Creditor Street Address",
          section: "section-1",
          required: true,
          validationRules: [
            {
              type: "required",
              message: "Street address is required",
              severity: "critical",
              validate: (value) => !!value,
              regulation: "BIA s. 124(1)"
            }
          ],
          metadata: {
            legalSchema: "BIA s. 124(1)",
            riskIndicators: ["Empty → Flag: Critical"],
            uiBehavior: "static"
          }
        },
        {
          id: "creditor-city",
          name: "creditorCity",
          type: "text",
          label: "Creditor City",
          section: "section-1",
          required: true,
          validationRules: [
            {
              type: "required",
              message: "City is required",
              severity: "critical",
              validate: (value) => !!value,
              regulation: "BIA s. 124(1)"
            }
          ],
          metadata: {
            legalSchema: "BIA s. 124(1)",
            riskIndicators: ["Empty → Flag: Critical"],
            uiBehavior: "static"
          }
        },
        {
          id: "creditor-province",
          name: "creditorProvince",
          type: "text",
          label: "Creditor Province/Territory",
          section: "section-1",
          required: true,
          validationRules: [
            {
              type: "required",
              message: "Province/Territory is required",
              severity: "critical",
              validate: (value) => !!value,
              regulation: "BIA s. 124(1)"
            }
          ],
          metadata: {
            legalSchema: "BIA s. 124(1)",
            riskIndicators: ["Empty → Flag: Critical"],
            uiBehavior: "static"
          }
        },
        {
          id: "creditor-postal-code",
          name: "creditorPostalCode",
          type: "text",
          label: "Creditor Postal Code",
          section: "section-1",
          required: true,
          validationRules: [
            {
              type: "format",
              message: "Invalid postal code format",
              severity: "medium",
              validate: (value) => !value || /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/.test(value),
              regulation: "BIA s. 124(1)"
            }
          ],
          metadata: {
            legalSchema: "BIA s. 124(1)",
            riskIndicators: ["Invalid format → Flag: Medium"],
            uiBehavior: "static"
          }
        },
        // Additional fields would be defined similarly
      ]
    },
    {
      id: "section-2",
      title: "Debtor & Proceeding Identification",
      fields: [
        {
          id: "proceeding-type",
          name: "proceedingType",
          type: "dropdown",
          label: "Proceeding Type",
          section: "section-2",
          required: true,
          options: [
            { label: "Bankruptcy", value: "bankruptcy" },
            { label: "Proposal", value: "proposal" },
            { label: "Receivership", value: "receivership" }
          ],
          validationRules: [
            {
              type: "required",
              message: "Proceeding type is required",
              severity: "critical",
              validate: (value) => !!value,
              regulation: "BIA s. 2"
            }
          ],
          metadata: {
            legalSchema: "BIA s. 2",
            riskIndicators: ["Mismatch with case → Flag: Critical"],
            uiBehavior: "static"
          }
        },
        {
          id: "debtor-name",
          name: "debtorName",
          type: "text",
          label: "Debtor Full Legal Name",
          section: "section-2",
          required: true,
          validationRules: [
            {
              type: "required",
              message: "Debtor name is required",
              severity: "critical",
              validate: (value) => !!value,
              regulation: "BIA s. 2"
            }
          ],
          metadata: {
            legalSchema: "BIA s. 2",
            riskIndicators: ["Empty → Flag: Critical"],
            uiBehavior: "static"
          }
        },
        // Additional fields would be defined similarly
      ]
    },
    // Additional sections would be defined similarly
  ],
  validationRules: [
    (formData) => {
      // Cross-field validation example: Related party validation
      if (formData.relatedToDebtor === 'yes' && !formData.transactionsDisclosure) {
        return {
          valid: false,
          message: "Related party requires transaction disclosure",
          severity: "critical"
        };
      }
      return { valid: true, message: "", severity: "low" };
    }
  ]
};

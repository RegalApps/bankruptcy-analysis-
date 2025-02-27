
# BIA Compliance Analysis Edge Function

This edge function performs detailed analysis of document compliance against the Bankruptcy and Insolvency Act (BIA) and Office of the Superintendent of Bankruptcy (OSB) Directives.

## Features

- Analyzes documents for compliance with BIA sections and OSB directives
- Identifies common compliance risks in bankruptcy and insolvency documents
- Provides detailed references to specific legal sections and directives
- Suggests corrective actions with deadlines
- Saves analysis results to the database

## Request Format

```json
{
  "documentId": "required-uuid",
  "documentText": "optional-extracted-text",
  "formNumber": "optional-form-number",
  "formType": "optional-form-type",
  "extractedInfo": {
    "optional": "previously-extracted-document-info"
  }
}
```

## Response Format

```json
{
  "documentId": "uuid",
  "formNumber": "extracted-or-provided-form-number",
  "formType": "extracted-or-provided-form-type",
  "clientName": "extracted-client-name",
  "trusteeName": "extracted-trustee-name",
  "dateSigned": "extracted-date-signed",
  "complianceRisks": [
    {
      "type": "risk-type",
      "description": "detailed-description",
      "severity": "high|medium|low",
      "biaReference": "specific-bia-section",
      "biaDescription": "description-of-bia-requirement",
      "directiveReference": "specific-osb-directive",
      "directiveDescription": "description-of-directive-requirement",
      "impact": "impact-description",
      "requiredAction": "action-to-resolve",
      "deadline": "time-to-resolve"
    }
  ],
  "complianceStatus": "compliant|non_compliant",
  "summary": "summary-of-findings"
}
```

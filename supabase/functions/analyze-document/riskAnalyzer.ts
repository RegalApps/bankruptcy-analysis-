
import { RiskAssessment, LegalReference } from "./types.ts";

export class RiskAnalyzer {
  private generateLegalReference(
    source: 'BIA' | 'CCAA' | 'OSB' | 'DIRECTIVE',
    referenceData: { number: string; title: string; description: string; sections: string[] }
  ): LegalReference {
    return {
      source,
      referenceNumber: referenceData.number,
      title: referenceData.title,
      description: referenceData.description,
      relevantSections: referenceData.sections
    };
  }

  public analyzeRisks(formNumber: string, extractedFields: Record<string, any>): RiskAssessment[] {
    const risks: RiskAssessment[] = [];
    
    // Form-specific risk analysis
    switch (formNumber) {
      case "1":
        // Voluntary Petition risks
        this.analyzeVoluntaryPetitionRisks(extractedFields, risks);
        break;
      // Add cases for other forms
    }

    // Common risks across all forms
    this.analyzeCommonRisks(extractedFields, risks);

    console.log(`Identified ${risks.length} risks for form ${formNumber}`);
    return risks;
  }

  private analyzeVoluntaryPetitionRisks(
    extractedFields: Record<string, any>,
    risks: RiskAssessment[]
  ) {
    // Check for missing or invalid debtor information
    if (!extractedFields.debtorName) {
      risks.push({
        category: "Missing Critical Information",
        severity: "high",
        description: "Debtor name is missing from the petition",
        legalReferences: [
          this.generateLegalReference("BIA", {
            number: "Section 43(1)",
            title: "Bankruptcy Petition Requirements",
            description: "Requirements for valid bankruptcy petition",
            sections: ["43(1)(a)"]
          })
        ],
        impactAnalysis: "Petition may be rejected or delayed",
        recommendedActions: ["Provide complete debtor information"],
        complianceStatus: "non_compliant"
      });
    }

    // Validate filing date
    if (extractedFields.filingDate) {
      const filingDate = new Date(extractedFields.filingDate);
      const today = new Date();
      if (filingDate > today) {
        risks.push({
          category: "Invalid Date",
          severity: "high",
          description: "Filing date cannot be in the future",
          legalReferences: [
            this.generateLegalReference("OSB", {
              number: "Directive 31",
              title: "Filing Requirements",
              description: "Requirements for filing dates",
              sections: ["31.1"]
            })
          ],
          impactAnalysis: "Petition will be rejected",
          recommendedActions: ["Correct the filing date"],
          complianceStatus: "non_compliant"
        });
      }
    }
  }

  private analyzeCommonRisks(
    extractedFields: Record<string, any>,
    risks: RiskAssessment[]
  ) {
    // Check for data consistency
    if (Object.keys(extractedFields).length === 0) {
      risks.push({
        category: "Data Extraction",
        severity: "high",
        description: "No data could be extracted from the form",
        legalReferences: [],
        impactAnalysis: "Unable to process the form",
        recommendedActions: ["Review document quality", "Manually verify form content"],
        complianceStatus: "needs_review"
      });
    }

    // Check for potentially fraudulent information
    this.analyzeFraudRisks(extractedFields, risks);
  }

  private analyzeFraudRisks(
    extractedFields: Record<string, any>,
    risks: RiskAssessment[]
  ) {
    // Example fraud detection logic
    const suspiciousPatterns = this.detectSuspiciousPatterns(extractedFields);
    if (suspiciousPatterns.length > 0) {
      risks.push({
        category: "Potential Fraud",
        severity: "high",
        description: "Suspicious patterns detected in form data",
        legalReferences: [
          this.generateLegalReference("BIA", {
            number: "Section 198",
            title: "Fraudulent Bankruptcy",
            description: "Offenses in relation to fraudulent bankruptcy",
            sections: ["198(1)"]
          })
        ],
        impactAnalysis: "Possible fraudulent filing",
        recommendedActions: [
          "Review suspicious entries",
          "Request additional documentation",
          "Consider reporting to authorities"
        ],
        complianceStatus: "needs_review"
      });
    }
  }

  private detectSuspiciousPatterns(extractedFields: Record<string, any>): string[] {
    const patterns: string[] = [];
    
    // Check for suspicious amounts
    const amountFields = Object.entries(extractedFields)
      .filter(([_, value]) => typeof value === "string" && value.includes("$"));
    
    for (const [field, value] of amountFields) {
      const amount = parseFloat(value.replace(/[$,]/g, ""));
      if (amount > 1000000) {
        patterns.push(`Unusually large amount in ${field}: ${value}`);
      }
    }

    return patterns;
  }
}

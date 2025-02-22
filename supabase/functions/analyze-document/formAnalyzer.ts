
import { FormTemplate, FormField, formTemplates } from './formTemplates.ts';
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.0";

interface AnalysisResult {
  formNumber: string | null;
  extractedFields: { [key: string]: any };
  validationResults: { [key: string]: string[] };
  confidenceScore: number;
  status: 'success' | 'partial' | 'failed';
}

export class FormAnalyzer {
  private supabase;

  constructor() {
    this.supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
  }

  public async analyzeDocument(text: string): Promise<AnalysisResult> {
    console.log('Starting document analysis...');
    
    // Detect form number
    const formNumber = this.detectFormNumber(text);
    if (!formNumber) {
      console.log('No form number detected');
      return this.createFailedResult('Unable to detect form number');
    }

    const template = formTemplates[formNumber];
    if (!template) {
      console.log(`No template found for form ${formNumber}`);
      return this.createFailedResult(`No template found for form ${formNumber}`);
    }

    // Extract fields based on template
    const extractedFields = this.extractFields(text, template);
    
    // Validate extracted fields
    const validationResults = this.validateFields(extractedFields, template);
    
    // Calculate confidence score
    const confidenceScore = this.calculateConfidenceScore(extractedFields, template);

    const status = this.determineStatus(validationResults);

    console.log('Analysis completed:', {
      formNumber,
      extractedFieldsCount: Object.keys(extractedFields).length,
      status
    });

    return {
      formNumber,
      extractedFields,
      validationResults,
      confidenceScore,
      status
    };
  }

  private detectFormNumber(text: string): string | null {
    const formPatterns = [
      /form\s*(?:no\.|number|#)?\s*(\d+)/i,
      /^(?:official\s+)?form\s*(\d+)/im,
      /b\s*(\d+)/i
    ];

    for (const pattern of formPatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        const formNumber = match[1];
        console.log('Detected form number:', formNumber);
        return formNumber;
      }
    }

    return null;
  }

  private extractFields(text: string, template: FormTemplate): { [key: string]: any } {
    const extractedFields: { [key: string]: any } = {};
    
    for (const [fieldName, patterns] of Object.entries(template.fieldMappings)) {
      for (const pattern of patterns) {
        const regex = new RegExp(`${pattern}\\s*[:\\.]?\\s*([^\\n]+)`, 'i');
        const match = text.match(regex);
        
        if (match && match[1]) {
          extractedFields[fieldName] = match[1].trim();
          console.log(`Extracted ${fieldName}:`, extractedFields[fieldName]);
          break;
        }
      }
    }

    return extractedFields;
  }

  private validateFields(
    extractedFields: { [key: string]: any },
    template: FormTemplate
  ): { [key: string]: string[] } {
    const validationResults: { [key: string]: string[] } = {};

    for (const field of template.requiredFields) {
      const fieldValue = extractedFields[field.name];
      const fieldRules = template.validationRules[field.name] || [];
      
      validationResults[field.name] = [];

      if (field.required && !fieldValue) {
        validationResults[field.name].push(`${field.name} is required`);
      }

      if (fieldValue && field.pattern) {
        const regex = new RegExp(field.pattern);
        if (!regex.test(fieldValue)) {
          validationResults[field.name].push(`${field.name} format is invalid`);
        }
      }

      // Additional validation based on field type
      if (fieldValue) {
        switch (field.type) {
          case 'date':
            if (isNaN(Date.parse(fieldValue))) {
              validationResults[field.name].push(`${field.name} must be a valid date`);
            }
            break;
          case 'number':
          case 'currency':
            if (isNaN(parseFloat(fieldValue))) {
              validationResults[field.name].push(`${field.name} must be a valid number`);
            }
            break;
        }
      }
    }

    return validationResults;
  }

  private calculateConfidenceScore(
    extractedFields: { [key: string]: any },
    template: FormTemplate
  ): number {
    const requiredFieldsCount = template.requiredFields.length;
    const extractedRequiredFields = template.requiredFields.filter(
      field => extractedFields[field.name] !== undefined
    ).length;

    return (extractedRequiredFields / requiredFieldsCount) * 100;
  }

  private determineStatus(validationResults: { [key: string]: string[] }): 'success' | 'partial' | 'failed' {
    const totalErrors = Object.values(validationResults)
      .reduce((sum, errors) => sum + errors.length, 0);

    if (totalErrors === 0) return 'success';
    if (totalErrors < Object.keys(validationResults).length) return 'partial';
    return 'failed';
  }

  private createFailedResult(message: string): AnalysisResult {
    return {
      formNumber: null,
      extractedFields: {},
      validationResults: { error: [message] },
      confidenceScore: 0,
      status: 'failed'
    };
  }
}

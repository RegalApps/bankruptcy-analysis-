
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.0";
import { FormAnalyzer } from "./formAnalyzer.ts";
import { RiskAnalyzer } from "./riskAnalyzer.ts";
import { getFormConfig } from "./formConfig.ts";
import type { AnalysisResult } from "./types.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { documentText, documentId } = await req.json();

    if (!documentText || !documentId) {
      throw new Error('Missing required parameters');
    }

    console.log('Starting enhanced document analysis for document:', documentId);
    
    // Initialize analyzers
    const formAnalyzer = new FormAnalyzer();
    const riskAnalyzer = new RiskAnalyzer();
    
    // Perform initial form analysis
    const initialAnalysis = await formAnalyzer.analyzeDocument(documentText);
    
    if (!initialAnalysis.formNumber) {
      throw new Error('Could not determine form number');
    }

    // Get form configuration
    const formConfig = getFormConfig(initialAnalysis.formNumber);
    
    // Perform risk analysis
    const risks = riskAnalyzer.analyzeRisks(
      initialAnalysis.formNumber,
      initialAnalysis.extractedFields
    );

    // Generate narrative summary
    const narrativeSummary = generateNarrativeSummary(
      initialAnalysis,
      risks,
      formConfig
    );

    // Prepare final analysis result
    const analysisResult: AnalysisResult = {
      ...initialAnalysis,
      riskAssessment: risks,
      legalCompliance: determineLegalCompliance(risks),
      narrativeSummary,
      validationResults: enrichValidationResults(
        initialAnalysis.validationResults,
        formConfig
      )
    };

    // Save to database
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { error: analysisError } = await supabase
      .from('form_analysis_results')
      .upsert({
        document_id: documentId,
        form_number: analysisResult.formNumber,
        extracted_fields: analysisResult.extractedFields,
        validation_results: analysisResult.validationResults,
        risk_assessment_details: analysisResult.riskAssessment,
        legal_compliance_status: analysisResult.legalCompliance,
        narrative_summary: analysisResult.narrativeSummary,
        confidence_score: analysisResult.confidenceScore,
        status: analysisResult.status
      });

    if (analysisError) {
      console.error('Error saving analysis results:', analysisError);
      throw analysisError;
    }

    console.log('Analysis completed and saved successfully');

    return new Response(
      JSON.stringify({ 
        message: 'Analysis completed',
        result: analysisResult
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in analyze-document function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

function generateNarrativeSummary(
  analysis: any,
  risks: any[],
  config: any
): string {
  const riskSeverities = risks.map(r => r.severity);
  const highRisks = risks.filter(r => r.severity === 'high');
  const complianceIssues = risks.filter(r => r.complianceStatus === 'non_compliant');

  let summary = `Form ${analysis.formNumber} Analysis Summary:\n\n`;

  // Add extraction confidence
  summary += `Data Extraction: ${analysis.confidenceScore}% confidence\n`;

  // Add risk overview
  if (risks.length > 0) {
    summary += `\nRisks Identified: ${risks.length} total\n`;
    summary += `- High Risk Issues: ${highRisks.length}\n`;
    summary += `- Compliance Issues: ${complianceIssues.length}\n`;
    
    if (highRisks.length > 0) {
      summary += "\nCritical Issues:\n";
      highRisks.forEach(risk => {
        summary += `- ${risk.description}\n`;
      });
    }
  } else {
    summary += "\nNo significant risks identified.\n";
  }

  // Add regulatory framework references
  if (config.biaSections.length > 0) {
    summary += `\nRelevant BIA Sections: ${config.biaSections.join(', ')}\n`;
  }
  if (config.ccaaSections.length > 0) {
    summary += `CCAA Sections: ${config.ccaaSections.join(', ')}\n`;
  }
  if (config.osbDirectives.length > 0) {
    summary += `OSB Directives: ${config.osbDirectives.join(', ')}\n`;
  }

  return summary;
}

function determineLegalCompliance(risks: any[]) {
  const hasNonCompliant = risks.some(r => r.complianceStatus === 'non_compliant');
  const hasNeedsReview = risks.some(r => r.complianceStatus === 'needs_review');

  return {
    status: hasNonCompliant ? 'non_compliant' :
           hasNeedsReview ? 'needs_review' : 'compliant',
    details: {
      riskCount: risks.length,
      nonCompliantCount: risks.filter(r => r.complianceStatus === 'non_compliant').length,
      needsReviewCount: risks.filter(r => r.complianceStatus === 'needs_review').length
    }
  };
}

function enrichValidationResults(results: any[], config: any) {
  return results.map(result => ({
    ...result,
    legalReferences: getLegalReferencesForField(result.field, config)
  }));
}

function getLegalReferencesForField(field: string, config: any) {
  // Map fields to relevant legal references
  // This is a simplified version - expand based on your needs
  return {
    biaSections: config.biaSections,
    ccaaSections: config.ccaaSections,
    osbDirectives: config.osbDirectives
  };
}

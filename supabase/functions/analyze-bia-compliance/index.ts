
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || ''
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''

// BIA Sections reference data
const BIA_SECTIONS = {
  '158a': 'Section 158(a) requires full financial disclosure',
  '158c': 'Section 158(c) requires disclosure of all debts',
  '50_4_8': 'Section 50.4(8) requires proper authentication',
  '155d_1': 'Section 155(d.1) requires timely notification',
  '67_1': 'Section 67(1) discusses division of assets under bankruptcy',
}

// OSB Directives reference data
const OSB_DIRECTIVES = {
  '6R3': 'OSB Directive No. 6R3 mandates a complete Statement of Affairs',
  '11': 'OSB Directive No. 11 outlines creditor claim procedures',
  '11R2': 'OSB Directive No. 11R2 details asset disclosure requirements',
  'form_guidelines': 'OSB Form Guidelines mandate signatures for legal validation',
  'timeliness': 'OSB Timeliness Rules mandate proper scheduling',
}

interface AnalysisRequest {
  documentId: string
  documentText?: string
  formNumber?: string
  formType?: string
  extractedInfo?: Record<string, any>
}

interface ComplianceRisk {
  type: string
  description: string
  severity: 'high' | 'medium' | 'low'
  biaReference: string
  biaDescription: string
  directiveReference: string
  directiveDescription: string
  impact: string
  requiredAction: string
  deadline: string
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }
  
  try {
    const requestData: AnalysisRequest = await req.json()
    const { documentId, documentText, formNumber, formType, extractedInfo } = requestData
    
    console.log(`Analyzing BIA compliance for document ID: ${documentId}`)
    console.log(`Form number: ${formNumber}, Form type: ${formType}`)
    
    if (!documentId) {
      throw new Error('Document ID is required')
    }
    
    // Initialize Supabase client
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
    
    // If no document text is provided, fetch the document from the database
    let analysis = extractedInfo
    if (!analysis) {
      console.log('No extracted info provided, fetching from database')
      const { data: documentAnalysis, error: analysisError } = await supabase
        .from('document_analysis')
        .select('content')
        .eq('document_id', documentId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()
      
      if (analysisError) {
        throw new Error(`Error fetching document analysis: ${analysisError.message}`)
      }
      
      if (!documentAnalysis?.content) {
        throw new Error('No document analysis found')
      }
      
      analysis = typeof documentAnalysis.content === 'string' 
        ? JSON.parse(documentAnalysis.content).extracted_info 
        : documentAnalysis.content.extracted_info
    }
    
    console.log('Analyzing extracted information:', analysis)
    
    // Perform compliance analysis based on the extracted information
    const complianceRisks: ComplianceRisk[] = []
    
    // 1. Financial Disclosure Issues
    const hasFinancialDetails = analysis.totalDebts || analysis.totalAssets || 
                               (analysis.metadata && (analysis.metadata.assets || analysis.metadata.liabilities))
    
    if (!hasFinancialDetails) {
      complianceRisks.push({
        type: 'Financial Disclosure Issues',
        description: 'Financial details (assets, liabilities, or creditor details) are missing from the document',
        severity: 'high',
        biaReference: 'Section 158(a)',
        biaDescription: BIA_SECTIONS['158a'],
        directiveReference: 'OSB Directive No. 6R3',
        directiveDescription: OSB_DIRECTIVES['6R3'],
        impact: 'Incomplete financial disclosure may invalidate the filing and lead to rejection by the OSB',
        requiredAction: 'Ensure all financial details are listed before proceeding',
        deadline: '5 business days'
      })
    }
    
    // 2. Signature & Authorization Issues
    const hasSignatures = analysis.dateSigned || analysis.signatureDate || 
                         (analysis.metadata && analysis.metadata.signatures)
    
    if (!hasSignatures) {
      complianceRisks.push({
        type: 'Signature & Authorization Issues',
        description: 'Required signatures (debtor, trustee) may be missing from the document',
        severity: 'medium',
        biaReference: 'Section 50.4(8)',
        biaDescription: BIA_SECTIONS['50_4_8'],
        directiveReference: 'OSB Form Guidelines',
        directiveDescription: OSB_DIRECTIVES['form_guidelines'],
        impact: 'Unsigned documents lack legal validation and may be rejected',
        requiredAction: 'Require digital or physical signatures before processing',
        deadline: '3 business days'
      })
    }
    
    // 3. Missing Creditor Information
    const hasCreditorInfo = analysis.creditors || 
                           (analysis.metadata && analysis.metadata.creditors)
    
    if (!hasCreditorInfo) {
      complianceRisks.push({
        type: 'Missing Creditor Information',
        description: 'The form may not list all creditors and owed amounts',
        severity: 'high',
        biaReference: 'Section 158(c)',
        biaDescription: BIA_SECTIONS['158c'],
        directiveReference: 'OSB Directive No. 11',
        directiveDescription: OSB_DIRECTIVES['11'],
        impact: 'Failing to disclose all creditors can lead to sanctions and non-discharge',
        requiredAction: 'Ensure debtor submits a full list of creditors',
        deadline: '5 business days'
      })
    }
    
    // 4. Late or Invalid Notice Issues
    const meetingDate = analysis.meetingOfCreditors || analysis.meetingDate
    const docDate = analysis.dateSigned || analysis.dateOfFiling || analysis.documentDate
    
    if (meetingDate && docDate) {
      const meetingTimestamp = new Date(meetingDate).getTime()
      const docTimestamp = new Date(docDate).getTime()
      
      // Check if document was issued less than 5 days before meeting
      if (meetingTimestamp - docTimestamp < 5 * 24 * 60 * 60 * 1000) {
        complianceRisks.push({
          type: 'Late or Invalid Notice Issues',
          description: 'The document may not provide sufficient notice before the meeting date',
          severity: 'high',
          biaReference: 'Section 155(d.1)',
          biaDescription: BIA_SECTIONS['155d_1'],
          directiveReference: 'OSB Timeliness Rules',
          directiveDescription: OSB_DIRECTIVES['timeliness'],
          impact: 'Insufficient notice may invalidate proceedings and require rescheduling',
          requiredAction: 'Reissue notice at least 5 days in advance',
          deadline: 'Immediately'
        })
      }
    }
    
    // 5. Procedural Compliance Issues
    // This is a general check for any other missing required elements
    const missingRequiredElements = !analysis.estateNumber || !analysis.district || !analysis.formNumber
    
    if (missingRequiredElements) {
      complianceRisks.push({
        type: 'Procedural Compliance Issues',
        description: 'The document may be missing procedural elements required by law',
        severity: 'medium',
        biaReference: 'Section 67(1)',
        biaDescription: BIA_SECTIONS['67_1'],
        directiveReference: 'OSB Directive No. 11R2',
        directiveDescription: OSB_DIRECTIVES['11R2'],
        impact: 'Procedural errors can delay processing and lead to administrative rejection',
        requiredAction: 'Conduct a pre-filing review before submission',
        deadline: '7 business days'
      })
    }
    
    // Prepare response with all identified risks
    const responseData = {
      documentId,
      formNumber: analysis.formNumber || formNumber,
      formType: analysis.type || formType,
      clientName: analysis.clientName,
      trusteeName: analysis.trusteeName,
      dateSigned: analysis.dateSigned,
      complianceRisks,
      complianceStatus: complianceRisks.length === 0 ? 'compliant' : 'non_compliant',
      summary: complianceRisks.length === 0 
        ? "No critical compliance risks detected based on BIA and OSB Directives."
        : `Detected ${complianceRisks.length} compliance issues requiring attention.`
    }
    
    // Save compliance analysis results to database
    const { error: saveError } = await supabase
      .from('form_analysis_results')
      .upsert({
        document_id: documentId,
        form_number: analysis.formNumber || formNumber,
        legal_compliance_status: {
          status: responseData.complianceStatus,
          risks: complianceRisks,
          lastChecked: new Date().toISOString()
        },
        risk_assessment_details: {
          riskCount: complianceRisks.length,
          highRiskCount: complianceRisks.filter(r => r.severity === 'high').length,
          mediumRiskCount: complianceRisks.filter(r => r.severity === 'medium').length,
          lowRiskCount: complianceRisks.filter(r => r.severity === 'low').length
        }
      }, { onConflict: 'document_id' })
    
    if (saveError) {
      console.error('Error saving compliance analysis:', saveError)
    } else {
      console.log('Successfully saved compliance analysis')
    }
    
    return new Response(JSON.stringify(responseData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('Error in BIA compliance analysis:', error)
    
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})

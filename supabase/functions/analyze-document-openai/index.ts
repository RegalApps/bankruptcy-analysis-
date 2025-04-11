
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Create a Supabase client with the Admin key
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { documentId, documentText, documentType } = await req.json();
    
    if (!documentId) {
      throw new Error('Document ID is required');
    }

    console.log(`Processing document analysis for ID: ${documentId}, type: ${documentType}`);
    
    // Create a Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Update document status to processing
    await supabase
      .from('documents')
      .update({ ai_processing_status: 'processing' })
      .eq('id', documentId);
      
    console.log("Document status updated to processing");
    
    // Fetch document content if documentText is not provided
    let text = documentText;
    let docTitle = '';
    if (!text) {
      const { data: document, error: docError } = await supabase
        .from('documents')
        .select('storage_path, title, type')
        .eq('id', documentId)
        .single();
        
      if (docError) throw docError;
      
      docTitle = document.title;
      console.log(`Document title: ${docTitle}`);
      
      // For this example, we'll simulate having the text content based on document type
      if (documentType === 'form31' || docTitle.includes('Form 31')) {
        text = `Form 31 - Proof of Claim
        Creditor: Neil Armstrong, Licensed Insolvency Trustee
        Firm: ABC Restructuring Ltd.
        Address: 100 Bay Street, Suite 400, Toronto, Ontario, M5J 2N8
        Debtor: GreenTech Supplies Inc. from Trenton, Ontario
        Amount Claimed: $89,355.00
        Claim basis: Debt owed as of March 15, 2025
        The document appears to have several issues including missing checkbox selections,
        missing relatedness declaration, and incomplete date format.
        Dated at 2025, this 8 day of 0.`;
      } else if (documentType === 'form47' || docTitle.includes('Form 47')) {
        text = `Form 47 - Consumer Proposal
        Debtor: Josh Hart
        Administrator: Tom Francis
        Filing Date: February 1, 2025
        Submission Deadline: March 3, 2025
        Document Status: Draft - Pending Review`;
      } else {
        text = `Generic document content for ${docTitle || 'Unknown document'}`;
      }
      
      console.log("Using simulated document content");
    }
    
    // Prepare the prompt for OpenAI
    const systemPrompt = `You are an expert document analyzer for Canadian insolvency and bankruptcy forms. 
    Analyze the provided document text in detail and extract the following information in JSON format:
    
    1. extracted_info: Include these fields (leave empty if not found):
       - formNumber (just the number)
       - formType (e.g., "Consumer Proposal", "Proof of Claim")
       - clientName (debtor name)
       - dateSigned
       - trusteeName or administratorName (depending on document type)
       - clientAddress (if available)
       - clientPhone (if available)
       - clientEmail (if available)
       - trusteeAddress (if available)
       - trusteePhone (if available)
       - trusteeEmail (if available)
       - estateNumber (if available)
       - summary (2-3 sentence summary of the document)
       - filingDate (if available)
       - submissionDeadline (if available)
       - documentStatus (if available)
    
    2. risks: Array of objects with these fields:
       - type: String (e.g., "compliance", "legal", "document")
       - description: Detailed description of the issue
       - severity: "high", "medium", or "low"
       - regulation: BIA reference or legal citation
       - impact: How this affects compliance or processing
       - requiredAction: What needs to be done
       - solution: Specific fix for the issue
       - deadline: Suggested timeframe for resolution
    
    3. regulatory_compliance: Object with:
       - status: "compliant", "non_compliant", or "needs_review"
       - details: Summary of compliance status
       - references: Array of relevant BIA sections or regulations
    
    Only include fields where you have high confidence in the extracted data. Format your response as structured JSON.`;

    console.log("Calling OpenAI API");

    // Call OpenAI API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openAIApiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Document title: ${docTitle}\nDocument text: ${text}` }
        ],
        temperature: 0.3,
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      const responseText = await response.text();
      console.error(`OpenAI API error (${response.status}): ${responseText}`);
      throw new Error(`OpenAI API error: ${response.status} - ${responseText.substring(0, 200)}...`);
    }

    const data = await response.json();
    console.log("OpenAI response received");
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message || !data.choices[0].message.content) {
      throw new Error("Unexpected response format from OpenAI");
    }
    
    const analysisResult = JSON.parse(data.choices[0].message.content);
    console.log("Analysis result parsed");
    
    // Ensure we have the basic structure
    if (!analysisResult.extracted_info) {
      analysisResult.extracted_info = {};
    }
    if (!analysisResult.risks) {
      analysisResult.risks = [];
    }
    if (!analysisResult.regulatory_compliance) {
      analysisResult.regulatory_compliance = {
        status: "needs_review",
        details: "Compliance status could not be determined",
        references: []
      };
    }
    
    // Store analysis results
    const { error: analysisError } = await supabase
      .from('document_analysis')
      .insert({
        document_id: documentId,
        content: analysisResult
      });
      
    if (analysisError) {
      console.error("Error inserting analysis:", analysisError);
      throw analysisError;
    }
    
    console.log("Analysis results stored in database");
    
    // Update document status and metadata
    const { error: updateError } = await supabase
      .from('documents')
      .update({ 
        ai_processing_status: 'complete',
        metadata: {
          formType: analysisResult.extracted_info.formType || documentType,
          formNumber: analysisResult.extracted_info.formNumber,
          clientName: analysisResult.extracted_info.clientName,
          analysisCompleted: true,
          lastAnalyzed: new Date().toISOString()
        }
      })
      .eq('id', documentId);
      
    if (updateError) {
      console.error("Error updating document:", updateError);
      throw updateError;
    }
    
    console.log("Document status updated to complete");

    return new Response(
      JSON.stringify({ 
        success: true, 
        analysis: analysisResult 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error in analyze-document-openai function:', error);
    
    // Try to update document status on error
    try {
      const { documentId } = await req.json();
      if (documentId) {
        const supabase = createClient(supabaseUrl, supabaseServiceKey);
        await supabase
          .from('documents')
          .update({ 
            ai_processing_status: 'failed',
            metadata: {
              analysisError: error.message,
              lastAnalysisAttempt: new Date().toISOString()
            }
          })
          .eq('id', documentId);
          
        console.log("Document status updated to failed");
      }
    } catch (updateError) {
      console.error("Could not update document status on error:", updateError);
    }
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

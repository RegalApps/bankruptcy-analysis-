
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL')
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')
const supabase = createClient(supabaseUrl!, supabaseAnonKey!)

// OpenAI API key from environment variable
const openAIApiKey = Deno.env.get('OPENAI_API_KEY')

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }
  
  try {
    const body = await req.json()
    const { message, module, documentId, testMode, debug, formType, title } = body
    
    console.log(`Processing request - testMode: ${testMode}, module: ${module}, documentId: ${documentId}`)
    
    // Test mode just checks if OpenAI API key is working
    if (testMode) {
      // Verify OpenAI API connection without sending full prompts
      try {
        const debugInfo = {
          status: {
            openAIKeyPresent: !!openAIApiKey,
            timestamp: new Date().toISOString(),
          },
          environment: {
            supabaseUrl: !!supabaseUrl,
            supabaseAnonKey: !!supabaseAnonKey
          }
        }
        
        if (!openAIApiKey) {
          return new Response(
            JSON.stringify({
              success: false,
              error: "OpenAI API key not configured.",
              debugInfo
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
        
        // Make a minimal call to OpenAI API just to verify key works
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openAIApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: 'Test API connection.' }],
            max_tokens: 5
          })
        })
        
        const data = await response.json()
        
        if (data.error) {
          console.error("OpenAI API error:", data.error)
          return new Response(
            JSON.stringify({
              success: false,
              error: `OpenAI API error: ${data.error.message || JSON.stringify(data.error)}`,
              debugInfo: { ...debugInfo, openAIResponse: data }
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
        
        return new Response(
          JSON.stringify({
            success: true,
            message: "OpenAI API connection successful",
            debugInfo: { ...debugInfo, openAIResponse: data }
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      } catch (error) {
        console.error("Error testing OpenAI connection:", error)
        return new Response(
          JSON.stringify({
            success: false,
            error: `Error testing OpenAI connection: ${error.message}`,
            debugInfo: { error: error.message, stack: error.stack }
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        )
      }
    }
    
    // Document analysis mode
    if (module === 'document-analysis' && documentId) {
      console.log(`Processing document analysis for documentId: ${documentId}`)
      
      try {
        // Check if OpenAI API key is configured
        if (!openAIApiKey) {
          throw new Error("OpenAI API key not configured.")
        }
        
        // Get document information for analysis context
        let documentTitle = title || "Unknown Document"
        let documentFormType = formType || null
        
        if (!title) {
          try {
            const { data: document, error: documentError } = await supabase
              .from('documents')
              .select('title, metadata')
              .eq('id', documentId)
              .single()
              
            if (documentError) {
              console.error("Error fetching document:", documentError)
            } else if (document) {
              documentTitle = document.title
              // Try to detect form type from metadata or title
              if (document.metadata?.formType) {
                documentFormType = document.metadata.formType
              } else if (document.title) {
                const lcTitle = document.title.toLowerCase()
                if (lcTitle.includes('form 31') || lcTitle.includes('proof of claim')) {
                  documentFormType = 'form-31'
                } else if (lcTitle.includes('form 47') || lcTitle.includes('consumer proposal')) {
                  documentFormType = 'form-47'
                } else if (lcTitle.includes('form 65') || lcTitle.includes('notice of intention')) {
                  documentFormType = 'form-65'
                } else if (lcTitle.includes('form 76') || lcTitle.includes('assignment')) {
                  documentFormType = 'form-76'
                }
              }
            }
          } catch (err) {
            console.error("Error fetching document details:", err)
          }
        }
        
        // Prepare the system prompt based on form type
        let systemPrompt = "You are an expert in analyzing financial and legal documents, particularly bankruptcy forms."
        
        // Enhanced system prompt based on form type
        if (documentFormType) {
          switch(documentFormType) {
            case 'form-31':
              systemPrompt = "You are an expert in analyzing Form 31 (Proof of Claim) documents under the Bankruptcy and Insolvency Act. Extract all relevant information, identify risks, and provide a comprehensive analysis.";
              break;
            case 'form-47':
              systemPrompt = "You are an expert in analyzing Form 47 (Consumer Proposal) documents under the Bankruptcy and Insolvency Act. Extract all relevant information, identify risks related to payment terms, debtor obligations, and regulatory compliance, and provide a comprehensive analysis.";
              break;
            case 'form-65':
              systemPrompt = "You are an expert in analyzing Form 65 (Notice of Intention) documents under the Bankruptcy and Insolvency Act. Extract all relevant information, identify risks related to timelines, missing information, and regulatory compliance, and provide a comprehensive analysis.";
              break;
            case 'form-76':
              systemPrompt = "You are an expert in analyzing Form 76 (Assignment for General Benefit of Creditors) documents under the Bankruptcy and Insolvency Act. Extract all relevant information, identify risks related to asset disclosure, creditor treatment, and regulatory compliance, and provide a comprehensive analysis.";
              break;
            default:
              systemPrompt = "You are an expert in analyzing financial and legal documents, particularly bankruptcy forms. Extract all relevant information, identify risks, and provide a comprehensive analysis.";
          }
        }
        
        // Prepare the analysis prompt
        const analysisPrompt = `
        Analyze the following document with title "${documentTitle}" ${documentFormType ? `(${documentFormType})` : ""}:
        
        ${message}
        
        Your analysis should include:
        1. A structured extraction of all client/debtor information (name, address, financial details, etc.)
        2. A concise summary of the document's purpose and contents
        3. A comprehensive risk assessment identifying any compliance issues, missing information, or potential problems
        4. Any relevant BIA (Bankruptcy and Insolvency Act) regulations that apply to this document
        
        Format your response as a JSON object with the following structure:
        {
          "extracted_info": {
            "clientName": "string",
            "type": "string",
            "formNumber": "string",
            ... (other extracted fields)
          },
          "summary": "string",
          "risks": [
            {
              "type": "string", // compliance, legal, financial, documentation
              "description": "string",
              "severity": "string", // high, medium, low
              "regulation": "string", // relevant regulation or requirement
              "impact": "string",
              "requiredAction": "string",
              "solution": "string",
              "deadline": "string" // when this should be addressed
            }
          ],
          "debug_info": {
            // any additional info
          }
        }
        `
        
        console.log(`Sending analysis request to OpenAI for document: ${documentTitle}`)
        
        // Make OpenAI API call
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openAIApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini', // Using a cost-effective model for document analysis
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: analysisPrompt }
            ],
            temperature: 0.1 // Low temperature for more consistent, structured outputs
          })
        })
        
        const data = await response.json()
        
        if (data.error) {
          console.error("OpenAI API error:", data.error)
          throw new Error(`OpenAI API error: ${data.error.message || JSON.stringify(data.error)}`)
        }
        
        // Extract the response
        const analysisContent = data.choices[0].message.content
        console.log("OpenAI response received, parsing JSON...")
        
        let parsedData
        try {
          // The response should be JSON, but handle cases where it might not be perfectly formatted
          parsedData = JSON.parse(analysisContent.replace(/```json|```/g, '').trim())
        } catch (parseError) {
          console.error("Error parsing OpenAI response as JSON:", parseError)
          console.log("Raw response:", analysisContent)
          throw new Error("Failed to parse analysis results. The API returned an invalid format.")
        }
        
        console.log("Successfully parsed analysis data")
        
        // Save the analysis results to the document_analysis table
        const { data: savedAnalysis, error: saveError } = await supabase
          .from('document_analysis')
          .upsert([
            {
              document_id: documentId,
              content: parsedData
            }
          ])
          .select()
        
        if (saveError) {
          console.error("Error saving analysis to database:", saveError)
          throw new Error(`Database error when saving analysis: ${saveError.message}`)
        }
        
        console.log("Analysis saved successfully to database")
        
        // Update document metadata with analysis information
        const { error: updateError } = await supabase
          .from('documents')
          .update({
            ai_processing_status: 'complete',
            metadata: {
              ...parsedData.extracted_info,
              analyzed_at: new Date().toISOString(),
              form_type: documentFormType || parsedData.extracted_info?.formNumber || 'unknown',
              has_risks: parsedData.risks && parsedData.risks.length > 0
            }
          })
          .eq('id', documentId)
        
        if (updateError) {
          console.error("Error updating document metadata:", updateError)
          // Don't throw here, as we still want to return the analysis
        }
        
        return new Response(
          JSON.stringify({
            success: true,
            message: "Document analysis completed and saved",
            parsedData,
            savedAnalysisId: savedAnalysis?.[0]?.id
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      } catch (error) {
        console.error("Error in document analysis:", error)
        return new Response(
          JSON.stringify({
            success: false,
            error: `Document analysis failed: ${error.message}`,
            details: { error: error.message, stack: error.stack }
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        )
      }
    }
    
    // Generic error for unknown module/mode
    return new Response(
      JSON.stringify({
        success: false,
        error: "Invalid request. Specify a valid module and parameters."
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
    
  } catch (error) {
    console.error("Error processing request:", error)
    return new Response(
      JSON.stringify({
        success: false,
        error: `Server error: ${error.message}`
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})

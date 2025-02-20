
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { ChatGPTAPI } from 'https://esm.sh/chatgpt@5.2.5'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface Risk {
  type: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  regulation?: string;
  impact?: string;
  requiredAction?: string;
  solution?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { documentText, documentId } = await req.json()

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Initialize ChatGPT
    const api = new ChatGPTAPI({
      apiKey: Deno.env.get('OPENAI_API_KEY') ?? '',
      completionParams: {
        model: 'gpt-4o',
        temperature: 0.2,
      },
    })

    const systemPrompt = `You are a legal expert specializing in Canadian Bankruptcy and Insolvency Act (BIA) forms. Analyze the provided document and:
1. Identify the BIA form number (1-96) and type
2. Extract key information based on the form type
3. Identify potential risks and compliance issues
4. Provide solutions and required actions for each risk
5. Reference specific sections of the BIA (RSC 1985, c B-3) when relevant

Return the analysis as a JSON object with these fields:
{
  type: string (form type/name),
  formNumber: string,
  clientName: string,
  trusteeName: string,
  estateNumber: string,
  district: string,
  divisionNumber: string,
  courtNumber: string,
  meetingOfCreditors?: string,
  chairInfo?: string,
  securityInfo?: string,
  dateBankruptcy?: string,
  dateSigned?: string,
  officialReceiver?: string,
  summary?: string,
  risks: Array<{
    type: string,
    description: string,
    severity: 'low' | 'medium' | 'high',
    regulation: string,
    impact: string,
    requiredAction: string,
    solution: string
  }>
}`

    // Analyze document with ChatGPT
    const response = await api.sendMessage(`${systemPrompt}\n\nDocument content:\n${documentText}`)
    console.log('ChatGPT Response:', response.text)

    let extractedInfo
    try {
      extractedInfo = JSON.parse(response.text)
    } catch (error) {
      console.error('Error parsing ChatGPT response:', error)
      throw new Error('Failed to parse document analysis')
    }

    // Store analysis in database
    const { error: analysisError } = await supabaseClient
      .from('document_analysis')
      .insert({
        document_id: documentId,
        content: {
          extracted_info: extractedInfo
        }
      })

    if (analysisError) throw analysisError

    return new Response(
      JSON.stringify({ message: 'Document analyzed successfully', analysis: extractedInfo }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in analyze-document function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})

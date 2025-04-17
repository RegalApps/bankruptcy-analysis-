
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const EXA_API_KEY = Deno.env.get('EXA_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query } = await req.json();

    console.log('Searching regulations with query:', query);
    
    const response = await fetch('https://api.exa.ai/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${EXA_API_KEY}`
      },
      body: JSON.stringify({
        query: `Find relevant regulations in the Bankruptcy and Insolvency Act (BIA) related to: ${query}`,
        num_results: 5,
        use_autoprompt: true,
        source_filters: {
          domains: ["laws-lois.justice.gc.ca"]
        }
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('Error from Exa API:', data);
      throw new Error(data.message || 'Failed to fetch regulations');
    }

    console.log('Successfully retrieved regulation results');
    
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error searching regulations:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

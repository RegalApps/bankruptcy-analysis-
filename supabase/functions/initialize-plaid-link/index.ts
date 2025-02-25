
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Configuration, PlaidApi, PlaidEnvironments } from "npm:plaid";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const clientId = Deno.env.get('PLAID_CLIENT_ID');
    const secret = Deno.env.get('PLAID_SECRET');

    if (!clientId || !secret) {
      throw new Error('Plaid credentials not configured');
    }

    const configuration = new Configuration({
      basePath: PlaidEnvironments.sandbox,
      baseOptions: {
        headers: {
          'PLAID-CLIENT-ID': clientId,
          'PLAID-SECRET': secret,
        },
      },
    });

    const plaidClient = new PlaidApi(configuration);

    const response = await plaidClient.linkTokenCreate({
      user: { client_user_id: crypto.randomUUID() },
      client_name: "Smart Income & Expenses",
      products: ["transactions"],
      country_codes: ["US"],
      language: "en"
    });

    return new Response(
      JSON.stringify({ link_token: response.data.link_token }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    );
  }
});

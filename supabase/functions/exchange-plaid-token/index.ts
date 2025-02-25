
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Configuration, PlaidApi, PlaidEnvironments } from "npm:plaid";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { public_token } = await req.json();
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

    // Exchange public token for access token
    const tokenResponse = await plaidClient.itemPublicTokenExchange({
      public_token: public_token
    });

    const access_token = tokenResponse.data.access_token;
    const item_id = tokenResponse.data.item_id;

    // Get institution details
    const itemResponse = await plaidClient.itemGet({
      access_token: access_token
    });

    const institutionResponse = await plaidClient.institutionsGetById({
      institution_id: itemResponse.data.item.institution_id,
      country_codes: ['US'],
    });

    // Store in Supabase
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { error } = await supabaseAdmin
      .from('plaid_items')
      .insert({
        access_token,
        item_id,
        institution_name: institutionResponse.data.institution.name,
        user_id: req.headers.get('x-user-id')
      });

    if (error) throw error;

    return new Response(
      JSON.stringify({ success: true }),
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

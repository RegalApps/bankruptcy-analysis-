
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { action, documentId, signatureData, metadata } = await req.json();

    if (action === 'sign') {
      // Record the signature
      const { data: signature, error: signatureError } = await supabase
        .from('signatures')
        .insert({
          document_id: documentId,
          signature_data: signatureData,
          status: 'completed',
          ip_address: req.headers.get('x-forwarded-for'),
        })
        .select()
        .single();

      if (signatureError) throw signatureError;

      // Update document status
      const { error: documentError } = await supabase
        .from('documents')
        .update({ status: 'signed' })
        .eq('id', documentId);

      if (documentError) throw documentError;

      // Create audit log
      await supabase.from('audit_logs').insert({
        document_id: documentId,
        action: 'document_signed',
        metadata: {
          signature_id: signature.id,
          ip_address: req.headers.get('x-forwarded-for'),
          timestamp: new Date().toISOString(),
        },
      });

      // Create notification
      await supabase.from('notifications').insert({
        title: 'Document Signed',
        message: `Document ${documentId} has been signed successfully`,
        type: 'signature_complete',
      });

      return new Response(
        JSON.stringify({ message: 'Document signed successfully' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'analyze') {
      // Analyze document engagement
      const { data: interactions } = await supabase
        .from('audit_logs')
        .select('action, created_at')
        .eq('document_id', documentId);

      const analysis = {
        totalInteractions: interactions?.length || 0,
        lastActivity: interactions?.[0]?.created_at || null,
        engagementScore: calculateEngagementScore(interactions || []),
      };

      return new Response(
        JSON.stringify(analysis),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    throw new Error('Invalid action');

  } catch (error) {
    console.error('Error processing document:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

function calculateEngagementScore(interactions: any[]): number {
  if (!interactions.length) return 0;
  const now = new Date();
  const recentInteractions = interactions.filter(i => {
    const interactionDate = new Date(i.created_at);
    const daysSince = (now.getTime() - interactionDate.getTime()) / (1000 * 60 * 60 * 24);
    return daysSince <= 30; // Consider only last 30 days
  });
  return Math.min(100, (recentInteractions.length / interactions.length) * 100);
}

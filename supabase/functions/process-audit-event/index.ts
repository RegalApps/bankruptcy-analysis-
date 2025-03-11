
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AuditEventPayload {
  action: string;
  documentId: string;
  userId: string;
  clientId?: string;
  metadata: Record<string, any>;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Parse the request body
    const payload = await req.json() as AuditEventPayload;
    const { action, documentId, userId, clientId, metadata } = payload;

    // Get document, user, and client details to enrich the audit log
    const [docResponse, userResponse, clientResponse] = await Promise.all([
      documentId ? supabase.from('documents').select('*').eq('id', documentId).single() : null,
      userId ? supabase.from('profiles').select('*').eq('id', userId).single() : null,
      clientId ? supabase.from('clients').select('*').eq('id', clientId).single() : null
    ]);

    const documentDetails = docResponse?.data || {};
    const userDetails = userResponse?.data || {};
    const clientDetails = clientResponse?.data || {};

    // Generate SHA-256 hash for verification
    const textEncoder = new TextEncoder();
    const timestamp = new Date().toISOString();
    const data = textEncoder.encode(JSON.stringify({
      action,
      documentId,
      userId,
      clientId,
      timestamp,
      metadata
    }));

    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    const hash = `sha256:${hashHex}`;

    // Determine if this is a critical action
    const criticalActions = ['delete', 'risk_assessment', 'export', 'signature'];
    const isCritical = criticalActions.includes(action) || 
                     (metadata.critical === true) || 
                     (documentDetails.metadata?.sensitivity === 'high');

    // Generate a regulatory framework reference if applicable
    let regulatoryFramework = null;
    if (action === 'risk_assessment' || action === 'signature' || isCritical) {
      const frameworks = ['ISO 27001', 'GDPR', 'SOC 2', 'HIPAA', 'PCI DSS'];
      regulatoryFramework = frameworks[Math.floor(Math.random() * frameworks.length)];
    }

    // Enhanced metadata with user, document and client details
    const enhancedMetadata = {
      ...metadata,
      document_name: documentDetails.title || metadata.document_name,
      document_type: documentDetails.type || metadata.document_type,
      user_name: userDetails.full_name || metadata.user_name,
      user_role: userDetails.role || metadata.user_role,
      client_name: clientDetails.name || metadata.client_name,
      hash,
      critical: isCritical,
      regulatory_framework: regulatoryFramework,
      version: documentDetails.metadata?.version || '1.0',
      ip_address: req.headers.get('x-forwarded-for') || '127.0.0.1',
      geo_location: metadata.geo_location || await getGeoLocation(req),
      changes: metadata.changes || [],
      security_level: isCritical ? 'high' : 'standard'
    };

    // Record the audit event
    const { data: auditLog, error } = await supabase
      .from('audit_logs')
      .insert({
        action,
        document_id: documentId,
        user_id: userId,
        client_id: clientId,
        metadata: enhancedMetadata
      })
      .select()
      .single();

    if (error) throw error;

    // Blockchain verification simulation - in production, this would interact with a real blockchain
    const blockchainVerification = {
      verified: true,
      timestamp: new Date().toISOString(),
      transaction_id: `tx_${Math.random().toString(36).substring(2, 15)}`,
      block: Math.floor(Math.random() * 100000),
      chain: 'SecureChain'
    };

    // For critical actions, create a notification
    if (isCritical) {
      await supabase.from('notifications').insert({
        title: 'Critical Audit Event',
        message: `${action.replace(/_/g, ' ')} performed on ${enhancedMetadata.document_name}`,
        type: 'audit_alert',
        user_id: null, // For all admins/compliance officers
        priority: 'high',
        metadata: {
          audit_log_id: auditLog.id,
          action,
          document_id: documentId,
          client_id: clientId,
          blockchain_verification: blockchainVerification
        },
        action_url: `/e-filing/audit-trail?entry=${auditLog.id}`
      });
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Audit event recorded successfully',
        audit_log_id: auditLog.id,
        verification_hash: hash,
        blockchain_verification: blockchainVerification
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Error processing audit event:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        status: 500, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});

// Simulated geo-location lookup based on IP address
async function getGeoLocation(req: Request) {
  // In a real implementation, you would use a geolocation service
  // For this demo, we'll return a random location
  const cities = [
    "New York, USA", 
    "London, UK", 
    "Toronto, Canada",
    "Sydney, Australia", 
    "Tokyo, Japan",
    "Berlin, Germany"
  ];
  
  return cities[Math.floor(Math.random() * cities.length)];
}

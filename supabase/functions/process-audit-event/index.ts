
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
    const { action, documentId, userId, metadata } = payload;

    // Get document and user details to enrich the audit log
    const [docResponse, userResponse] = await Promise.all([
      documentId ? supabase.from('documents').select('*').eq('id', documentId).single() : null,
      userId ? supabase.from('profiles').select('*').eq('id', userId).single() : null
    ]);

    const documentDetails = docResponse?.data || {};
    const userDetails = userResponse?.data || {};

    // Generate SHA-256 hash for verification
    const textEncoder = new TextEncoder();
    const data = textEncoder.encode(JSON.stringify({
      action,
      documentId,
      userId,
      timestamp: new Date().toISOString(),
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

    // Enhanced metadata with user and document details
    const enhancedMetadata = {
      ...metadata,
      document_name: documentDetails.title || metadata.document_name,
      document_type: documentDetails.type || metadata.document_type,
      user_name: userDetails.full_name || metadata.user_name,
      user_role: userDetails.role || metadata.user_role,
      hash,
      critical: isCritical,
      version: documentDetails.metadata?.version || '1.0',
      ip_address: req.headers.get('x-forwarded-for') || '127.0.0.1',
      changes: metadata.changes || []
    };

    // Record the audit event
    const { data: auditLog, error } = await supabase
      .from('audit_logs')
      .insert({
        action,
        document_id: documentId,
        user_id: userId,
        metadata: enhancedMetadata
      })
      .select()
      .single();

    if (error) throw error;

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
          document_id: documentId
        },
        action_url: `/e-filing/audit-trail?entry=${auditLog.id}`
      });
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Audit event recorded successfully',
        audit_log_id: auditLog.id,
        verification_hash: hash
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

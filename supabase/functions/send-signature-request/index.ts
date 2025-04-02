
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { Resend } from "npm:resend@2.0.0";

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

    const resend = new Resend(Deno.env.get('RESEND_API_KEY') ?? '');
    
    const { 
      documentId, 
      recipientEmail, 
      verificationCode, 
      action 
    } = await req.json();

    if (action === 'send_verification_code') {
      // Generate a 6-digit OTP code
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Store the OTP in the database with an expiration time (e.g., 15 minutes)
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 15);
      
      const { error: insertError } = await supabase
        .from('verification_codes')
        .insert({
          document_id: documentId,
          recipient_email: recipientEmail,
          code: otp,
          expires_at: expiresAt.toISOString(),
          used: false
        });
        
      if (insertError) throw insertError;
      
      // Send email with the OTP
      const { data: document, error: docError } = await supabase
        .from('documents')
        .select('title')
        .eq('id', documentId)
        .single();
        
      if (docError) throw docError;
      
      const { error: emailError } = await resend.emails.send({
        from: 'Secure Signature <onboarding@resend.dev>',
        to: [recipientEmail],
        subject: `Verification Code for Document Signature: ${document.title}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Secure Document Signature Verification</h2>
            <p>You are about to sign: <strong>${document.title}</strong></p>
            <p>Your verification code is:</p>
            <div style="background-color: #f4f4f4; padding: 20px; font-size: 24px; text-align: center; letter-spacing: 5px; font-weight: bold;">
              ${otp}
            </div>
            <p>This code will expire in 15 minutes.</p>
            <p>If you did not request to sign this document, please ignore this email.</p>
          </div>
        `,
      });
      
      if (emailError) throw emailError;
      
      return new Response(
        JSON.stringify({ message: 'Verification code sent successfully' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } 
    
    if (action === 'verify_and_send_request') {
      // Verify the OTP
      const { data: verificationData, error: verificationError } = await supabase
        .from('verification_codes')
        .select('*')
        .eq('document_id', documentId)
        .eq('recipient_email', recipientEmail)
        .eq('code', verificationCode)
        .eq('used', false)
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
        
      if (verificationError || !verificationData) {
        return new Response(
          JSON.stringify({ error: 'Invalid or expired verification code' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      // Mark the verification code as used
      await supabase
        .from('verification_codes')
        .update({ used: true })
        .eq('id', verificationData.id);
      
      // Generate a unique signature link
      const signatureToken = crypto.randomUUID();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // Expires in 7 days
      
      // Store the signature request
      const { error: requestError } = await supabase
        .from('signature_requests')
        .insert({
          document_id: documentId,
          recipient_email: recipientEmail,
          signature_token: signatureToken,
          status: 'pending',
          expires_at: expiresAt.toISOString()
        });
        
      if (requestError) throw requestError;
      
      // Update document status
      const { error: updateError } = await supabase
        .from('documents')
        .update({ status: 'pending_signature' })
        .eq('id', documentId);
        
      if (updateError) throw updateError;
      
      // Get document details
      const { data: document, error: docError } = await supabase
        .from('documents')
        .select('title')
        .eq('id', documentId)
        .single();
        
      if (docError) throw docError;
      
      // Generate the signing URL
      const signingUrl = `${Deno.env.get('SITE_URL') || 'https://app.example.com'}/sign-document/${signatureToken}`;
      
      // Send email with signature request
      const { error: emailError } = await resend.emails.send({
        from: 'Secure Signature <onboarding@resend.dev>',
        to: [recipientEmail],
        subject: `Please sign: ${document.title}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Document Signature Request</h2>
            <p>You have received a request to sign the document: <strong>${document.title}</strong></p>
            <p>Please click the button below to securely sign this document:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${signingUrl}" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
                Sign Document
              </a>
            </div>
            <p>Or copy and paste this URL into your browser:</p>
            <p style="word-break: break-all; background-color: #f4f4f4; padding: 10px; font-size: 14px;">
              ${signingUrl}
            </p>
            <p>This link will expire in 7 days.</p>
            <p>If you did not expect this request, please contact the sender.</p>
          </div>
        `,
      });
      
      if (emailError) throw emailError;
      
      // Create audit log entry
      await supabase
        .from('audit_logs')
        .insert({
          document_id: documentId,
          action: 'signature_request_sent',
          user_email: recipientEmail,
          metadata: {
            ip_address: req.headers.get('x-forwarded-for'),
            user_agent: req.headers.get('user-agent'),
            verification_method: 'email_otp'
          }
        });
      
      return new Response(
        JSON.stringify({ 
          message: 'Signature request sent successfully',
          signingUrl 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    throw new Error('Invalid action');
    
  } catch (error) {
    console.error('Error processing signature request:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

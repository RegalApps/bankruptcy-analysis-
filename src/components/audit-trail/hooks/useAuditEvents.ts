
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import logger from "@/utils/logger";

interface AuditEventParams {
  action: string;
  documentId: string;
  metadata?: Record<string, any>;
}

export const useAuditEvents = () => {
  const recordAuditEvent = async ({ action, documentId, metadata = {} }: AuditEventParams) => {
    try {
      // First try to get the current user
      const { data: { user } } = await supabase.auth.getUser();
      const userId = user?.id;
      
      logger.info(`Recording audit event: ${action} for document ${documentId}`, { userId });
      
      // Call the Edge Function to process the audit event
      const { data, error } = await supabase.functions.invoke('process-audit-event', {
        body: {
          action,
          documentId,
          userId,
          metadata
        }
      });

      if (error) {
        throw error;
      }

      logger.info('Audit event recorded successfully', data);
      return data;
    } catch (error) {
      logger.error('Failed to record audit event:', error);
      // Don't show toast for audit failures to avoid disrupting user experience
      // but log it for debugging
      return { success: false, error };
    }
  };

  return {
    recordAuditEvent
  };
};

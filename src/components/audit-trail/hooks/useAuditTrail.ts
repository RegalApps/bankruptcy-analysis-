
import { useState, useEffect } from "react";
import { AuditEntry } from "../types";
import { mockAuditData } from "../mockData";
import { supabase } from "@/lib/supabase";

export const useAuditTrail = () => {
  const [auditEntries, setAuditEntries] = useState<AuditEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchAuditTrail = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // In a production app, we would fetch from Supabase
        const { data: logData, error: logError } = await supabase
          .from('audit_logs')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (logError) {
          console.error("Error fetching audit logs:", logError);
          // Use mock data if there's an error
          setAuditEntries(mockAuditData);
        } else if (logData && logData.length > 0) {
          // Map the database data to our AuditEntry type
          // This would need to be customized based on your actual DB schema
          const mappedEntries = logData.map(log => {
            const metadata = log.metadata || {};
            return {
              id: log.id,
              timestamp: log.created_at,
              user: {
                id: log.user_id || 'unknown',
                name: metadata.user_name || 'Unknown User',
                role: metadata.user_role || 'User',
                ipAddress: metadata.ip_address || '127.0.0.1',
                location: metadata.location || 'Unknown Location'
              },
              action: log.action as any,
              document: {
                id: log.document_id || 'unknown',
                name: metadata.document_name || 'Unknown Document',
                type: metadata.document_type || 'Unknown Type',
                version: metadata.version || '1.0'
              },
              changes: metadata.changes,
              critical: metadata.critical || false,
              hash: metadata.hash || 'sha256:0000000000000000',
              regulatoryFramework: metadata.regulatory_framework
            };
          });
          
          setAuditEntries(mappedEntries);
        } else {
          // Use mock data if no real data exists yet
          setAuditEntries(mockAuditData);
        }
      } catch (err) {
        console.error("Failed to fetch audit trail:", err);
        setError(err as Error);
        // Fall back to mock data
        setAuditEntries(mockAuditData);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAuditTrail();
  }, []);

  return {
    auditEntries,
    isLoading,
    error
  };
};


import { useState, useEffect } from "react";
import { Document } from "@/components/DocumentList/types";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const useClientsData = (documents: Document[] | undefined) => {
  const [clients, setClients] = useState<{id: string, name: string}[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (documents) {
      const extractedClients = documents.reduce<{id: string, name: string}[]>((acc, doc) => {
        const metadata = doc.metadata as Record<string, any> || {};
        
        if (metadata?.client_id && metadata?.client_name) {
          const existingClient = acc.find(c => c.id === metadata.client_id);
          if (!existingClient) {
            acc.push({
              id: metadata.client_id,
              name: metadata.client_name
            });
          }
        }
        
        if (metadata?.clientName) {
          const clientName = metadata.clientName;
          const clientId = metadata.client_id || clientName.toLowerCase().replace(/\s+/g, '-');
          
          const existingClient = acc.find(c => c.id === clientId);
          if (!existingClient) {
            acc.push({
              id: clientId,
              name: clientName
            });
          }
        }
        
        if (doc.is_folder && doc.folder_type === 'client') {
          const existingClient = acc.find(c => c.id === doc.id);
          if (!existingClient) {
            acc.push({
              id: doc.id,
              name: doc.title
            });
          }
        }
        
        return acc;
      }, []);
      
      console.log("Extracted clients:", extractedClients);
      setClients(extractedClients);
    }
  }, [documents]);

  const handleClientSelect = (clientId: string) => {
    console.log(`Selecting client with ID: ${clientId}`);
    try {
      Promise.resolve(
        supabase
          .from('document_access_history')
          .insert({
            document_id: clientId,
            accessed_at: new Date().toISOString(),
            access_source: 'client_viewer'
          })
      )
      .then(() => {
        console.log('Access logged successfully');
        navigate('/', { state: { selectedClient: clientId } });
      })
      .catch((error) => {
        console.error('Error logging access:', error);
        navigate('/', { state: { selectedClient: clientId } });
      });
    } catch (error) {
      console.error('Error accessing client information:', error);
      toast.error("Could not access client information");
      
      navigate('/', { state: { selectedClient: clientId } });
    }
  };

  return {
    clients,
    handleClientSelect
  };
};

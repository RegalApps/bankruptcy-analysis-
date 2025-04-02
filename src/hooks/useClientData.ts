
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Client, Task } from "@/components/client/types";

interface ClientDocument {
  id: string;
  title: string;
  type: string;
  status: 'complete' | 'pending-review' | 'needs-signature' | 'draft';
  category: string;
  dateModified: string;
  fileType: string;
  fileSize: string;
}

interface UseClientDataResult {
  client: Client | null;
  documents: ClientDocument[];
  tasks: Task[];
  recentActivities: { id: string; action: string; user: string; timestamp: string; }[];
  isLoading: boolean;
  selectedDocumentId: string | null;
  setSelectedDocumentId: (id: string | null) => void;
  setClient: (client: Client | null) => void;
}

export const useClientData = (clientId: string | undefined): UseClientDataResult => {
  const [isLoading, setIsLoading] = useState(true);
  const [client, setClient] = useState<Client | null>(null);
  const [documents, setDocuments] = useState<ClientDocument[]>([]);
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);
  const [recentActivities, setRecentActivities] = useState<{ id: string; action: string; user: string; timestamp: string; }[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  
  useEffect(() => {
    setIsLoading(true);
    
    console.log("useClientData: Loading client with ID:", clientId);
    
    setTimeout(() => {
      const normalizedClientId = clientId?.toLowerCase().replace(/\s+/g, '-') || '';
      
      if (normalizedClientId === "josh-hart") {
        setClient({
          id: "josh-hart",
          name: "Josh Hart",
          status: "active",
          location: "Ontario",
          email: "josh.hart@example.com",
          phone: "(555) 123-4567",
          address: "123 Maple Street",
          city: "Toronto",
          province: "Ontario",
          postalCode: "M5V 2L7",
          company: "ABC Corporation",
          occupation: "Software Developer",
          mobilePhone: "(555) 987-6543",
          notes: "Josh is a priority client who needs regular updates on his case.",
          metrics: {
            openTasks: 3,
            pendingDocuments: 2,
            urgentDeadlines: 1
          },
          last_interaction: new Date().toISOString(),
          engagement_score: 92
        });

        setDocuments([
          {
            id: "form47-file",
            title: "Form 47 - Consumer Proposal",
            type: "Legal",
            status: "pending-review",
            category: "Forms",
            dateModified: new Date().toISOString(),
            fileType: "PDF",
            fileSize: "2.4 MB"
          },
          {
            id: "budget-file",
            title: "Budget 2025",
            type: "Financial",
            status: "draft",
            category: "Financial",
            dateModified: new Date(Date.now() - 86400000 * 2).toISOString(),
            fileType: "XLSX",
            fileSize: "1.8 MB"
          },
          {
            id: "id-scan",
            title: "ID Scan",
            type: "Personal",
            status: "complete",
            category: "Identification",
            dateModified: new Date(Date.now() - 86400000 * 5).toISOString(),
            fileType: "JPG",
            fileSize: "3.1 MB"
          }
        ]);

        setRecentActivities([
          {
            id: "activity-1",
            action: "Form 47 uploaded",
            user: "Jane Smith",
            timestamp: new Date().toISOString(),
          },
          {
            id: "activity-2",
            action: "Client information updated",
            user: "John Doe",
            timestamp: new Date(Date.now() - 86400000).toISOString(),
          },
          {
            id: "activity-3",
            action: "New task assigned",
            user: "Alice Johnson",
            timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
          }
        ]);
        
        setTasks([
          {
            id: "task-1",
            title: "Review Form 47 submission",
            dueDate: new Date().toISOString(),
            status: 'pending',
            priority: 'high'
          },
          {
            id: "task-2",
            title: "Collect additional financial documents",
            dueDate: new Date(Date.now() + 86400000 * 3).toISOString(),
            status: 'pending',
            priority: 'medium'
          },
          {
            id: "task-3",
            title: "Schedule follow-up meeting",
            dueDate: new Date(Date.now() + 86400000 * 5).toISOString(),
            status: 'pending',
            priority: 'low'
          }
        ]);
        
        setSelectedDocumentId("form47-file");
        
        toast.success("Client data loaded");
      } else {
        console.error("Client not found:", normalizedClientId);
        setClient(null);
        toast.error("Client not found");
      }
      
      setIsLoading(false);
    }, 500);
  }, [clientId]);

  return {
    client,
    documents,
    tasks,
    recentActivities,
    isLoading,
    selectedDocumentId,
    setSelectedDocumentId,
    setClient
  };
};

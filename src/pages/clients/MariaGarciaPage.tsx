
import { useEffect } from "react";
import { ClientViewTemplate } from "@/components/client/templates/ClientViewTemplate";
import { getClientData, getClientTasks, getClientDocuments } from "@/components/client/data/clientTemplates";
import { toast } from "sonner";

const MariaGarciaPage = () => {
  const clientId = "maria-garcia";
  
  useEffect(() => {
    toast.warning("Maria Garcia's account flagged for urgent action", {
      description: "Missing signature on Form 43 document"
    });
  }, []);
  
  // Get Maria Garcia's client data
  const client = getClientData(clientId);
  const tasks = getClientTasks(clientId);
  
  // Convert documents to the format expected by ClientDocumentsPanel
  const clientDocs = getClientDocuments(clientId).map(doc => ({
    id: doc.id,
    title: doc.title,
    type: doc.type,
    status: doc.id.includes('form-43') ? 'needs-signature' : 'pending-review',
    category: doc.folder_type || (doc.type === 'financial' ? 'Financial' : 'Forms'),
    dateModified: doc.updated_at,
    fileType: doc.title.split('.').pop()?.toUpperCase() || 'PDF',
    fileSize: doc.metadata?.fileSize || '1.8 MB',
  }));
  
  // Create recent activities based on documents
  const recentActivities = [
    {
      id: "activity-1",
      action: "URGENT: Form 43 requires signature",
      user: "System",
      timestamp: new Date().toISOString(),
    },
    {
      id: "activity-2",
      action: "Creditor List updated with additional entries",
      user: "Maria Garcia",
      timestamp: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: "activity-3",
      action: "Income Statement analysis in progress",
      user: "Jennifer Lee",
      timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      id: "activity-4",
      action: "Debt consolidation documents delivered",
      user: "System",
      timestamp: new Date(Date.now() - 86400000 * 4).toISOString(),
    }
  ];
  
  return <ClientViewTemplate 
    client={client}
    documents={clientDocs}
    tasks={tasks}
    recentActivities={recentActivities}
  />;
};

export default MariaGarciaPage;

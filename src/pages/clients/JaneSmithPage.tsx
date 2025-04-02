
import { useEffect } from "react";
import { ClientViewTemplate } from "@/components/client/templates/ClientViewTemplate";
import { getClientData, getClientTasks, getClientDocuments } from "@/components/client/data/clientTemplates";
import { toast } from "sonner";
import { formatDate } from "@/utils/formatDate";

const JaneSmithPage = () => {
  const clientId = "jane-smith";
  
  useEffect(() => {
    toast.success("Jane Smith's client information loaded", {
      description: "Showing client documents and tasks"
    });
  }, []);
  
  // Get Jane Smith's client data
  const client = getClientData(clientId);
  const tasks = getClientTasks(clientId);
  
  // Convert documents to the format expected by ClientDocumentsPanel
  const clientDocs = getClientDocuments(clientId).map(doc => ({
    id: doc.id,
    title: doc.title,
    type: doc.type,
    status: doc.metadata?.status || 'complete',
    category: doc.metadata?.category || (doc.type === 'financial' ? 'Financial' : 'Forms'),
    dateModified: doc.updated_at,
    fileType: doc.metadata?.fileType || 'PDF',
    fileSize: doc.metadata?.fileSize || '1.2 MB',
  }));
  
  // Create recent activities based on documents
  const recentActivities = [
    {
      id: "activity-1",
      action: "Tax Return 2023 uploaded",
      user: "Jane Smith",
      timestamp: new Date().toISOString(),
    },
    {
      id: "activity-2",
      action: "Employment Verification Letter reviewed",
      user: "Sarah Wilson",
      timestamp: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: "activity-3",
      action: "Financial statement updated",
      user: "Michael Brown",
      timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
    }
  ];
  
  return <ClientViewTemplate 
    client={client}
    documents={clientDocs}
    tasks={tasks}
    recentActivities={recentActivities}
  />;
};

export default JaneSmithPage;


import { useEffect } from "react";
import { ClientViewTemplate } from "@/components/client/templates/ClientViewTemplate";
import { getClientData, getClientTasks, getClientDocuments } from "@/components/client/data/clientTemplates";
import { toast } from "sonner";

const RobertJohnsonPage = () => {
  const clientId = "robert-johnson";
  
  useEffect(() => {
    toast.success("Robert Johnson's client information loaded", {
      description: "Construction contractor with multiple pending documents"
    });
  }, []);
  
  // Get Robert Johnson's client data
  const client = getClientData(clientId);
  const tasks = getClientTasks(clientId);
  
  // Convert documents to the format expected by ClientDocumentsPanel
  const clientDocs = getClientDocuments(clientId).map(doc => ({
    id: doc.id,
    title: doc.title,
    type: doc.type,
    status: doc.id.includes('form-32') ? 'pending-review' : 'complete',
    category: doc.folder_type || (doc.type === 'financial' ? 'Financial' : 'Forms'),
    dateModified: doc.updated_at,
    fileType: doc.title.split('.').pop()?.toUpperCase() || 'PDF',
    fileSize: doc.metadata?.fileSize || '2.5 MB',
  }));
  
  // Create recent activities based on documents
  const recentActivities = [
    {
      id: "activity-1",
      action: "Form 32 document flagged for review",
      user: "System",
      timestamp: new Date().toISOString(),
    },
    {
      id: "activity-2",
      action: "Bank statements uploaded",
      user: "Robert Johnson",
      timestamp: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: "activity-3",
      action: "Credit report analysis completed",
      user: "David Clark",
      timestamp: new Date(Date.now() - 86400000 * 3).toISOString(),
    },
    {
      id: "activity-4",
      action: "Monthly report tasks assigned",
      user: "Sarah Wilson",
      timestamp: new Date(Date.now() - 86400000 * 5).toISOString(),
    }
  ];
  
  return <ClientViewTemplate 
    client={client}
    documents={clientDocs}
    tasks={tasks}
    recentActivities={recentActivities}
  />;
};

export default RobertJohnsonPage;

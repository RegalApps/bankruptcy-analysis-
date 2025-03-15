
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClientIntakeForm } from "./ClientIntakeForm";
import { FileUploadSection } from "./FileUploadSection";
import { FormRecommendationPanel } from "./FormRecommendationPanel";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { createClientFolder } from "@/utils/documents/folder-utils";
import { organizeDocumentIntoFolders } from "@/utils/documents/folder-utils/organizeDocuments";

interface NewClientIntakeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClientCreated?: (clientId: string) => void;
  setIsCreatingClient: (isCreating: boolean) => void;
}

export const NewClientIntakeDialog = ({ 
  open, 
  onOpenChange,
  onClientCreated,
  setIsCreatingClient
}: NewClientIntakeDialogProps) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("basic");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressStatus, setProgressStatus] = useState("");
  const [uploadedDocumentIds, setUploadedDocumentIds] = useState<string[]>([]);
  const [clientData, setClientData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    financialStatus: "",
    employment: "",
    maritalStatus: "",
    dependents: 0,
    hasExistingDebt: false,
    previousBankruptcy: false,
    estimatedDebtAmount: ""
  });
  const [recommendedForms, setRecommendedForms] = useState<Array<{
    formNumber: string;
    formName: string;
    required: boolean;
    description: string;
  }>>([]);
  
  const analyzeClientData = async () => {
    setIsProcessing(true);
    setProgressStatus("Analyzing financial information...");
    
    // Simulate AI analysis based on client data
    setTimeout(() => {
      const recommendations = [];
      
      // Basic forms all clients need
      recommendations.push({
        formNumber: "1",
        formName: "Statement of Affairs",
        required: true,
        description: "Required for all insolvency filings"
      });
      
      recommendations.push({
        formNumber: "2",
        formName: "Statement of Income & Expenses",
        required: true,
        description: "Details the client's monthly budget"
      });
      
      // Add specific forms based on financial situation
      if (clientData.hasExistingDebt && parseInt(clientData.estimatedDebtAmount) > 100000) {
        if (clientData.previousBankruptcy) {
          // Bankruptcy forms
          recommendations.push({
            formNumber: "33",
            formName: "Application for Bankruptcy Order",
            required: true,
            description: "Required for bankruptcy filing"
          });
          recommendations.push({
            formNumber: "34",
            formName: "Bankruptcy Order",
            required: true,
            description: "Court issued bankruptcy declaration"
          });
          recommendations.push({
            formNumber: "35",
            formName: "Certificate of Appointment",
            required: true,
            description: "Official trustee appointment document"
          });
        } else {
          // Consumer proposal forms
          recommendations.push({
            formNumber: "47",
            formName: "Consumer Proposal",
            required: true,
            description: "Main filing for Consumer Proposal"
          });
        }
      }
      
      // Add corporate forms if applicable
      if (clientData.financialStatus === "business_owner") {
        recommendations.push({
          formNumber: "82",
          formName: "Business Financial Statement",
          required: true,
          description: "Required for business owners"
        });
        recommendations.push({
          formNumber: "85",
          formName: "Business Proof of Claim",
          required: false,
          description: "For business creditors to file claims"
        });
      }
      
      setRecommendedForms(recommendations);
      setProgressStatus("Analysis complete. Creating client...");
      setIsProcessing(false);
      setActiveTab("forms");
    }, 2000);
  };
  
  const handleCreateClient = async () => {
    try {
      setIsProcessing(true);
      setIsCreatingClient(true);
      setProgressStatus("Creating client record...");
      
      // Create client in database
      const { data: newClient, error } = await supabase
        .from("clients")
        .insert({
          name: clientData.name,
          email: clientData.email,
          phone: clientData.phone,
          metadata: {
            address: clientData.address,
            financialStatus: clientData.financialStatus,
            employment: clientData.employment,
            maritalStatus: clientData.maritalStatus,
            dependents: clientData.dependents,
            previousBankruptcy: clientData.previousBankruptcy,
            estimatedDebtAmount: clientData.estimatedDebtAmount,
            recommendedForms: recommendedForms.map(form => form.formNumber)
          }
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Create client folder structure
      setProgressStatus("Creating document folders...");
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error("User not authenticated");
      
      // Create the client folder
      const { folderId: clientFolderId } = await createClientFolder(clientData.name, user.id);
      
      if (!clientFolderId) throw new Error("Failed to create client folder");
      
      // Organize uploaded documents
      setProgressStatus("Organizing uploaded documents...");
      for (const docId of uploadedDocumentIds) {
        // Determine form type based on AI analysis
        const formType = recommendedForms[0]?.formNumber || "Form-1";
        await organizeDocumentIntoFolders(docId, user.id, clientData.name, formType);
      }
      
      // Success notification
      toast.success(`${clientData.name} added successfully!`, {
        description: `Added ${recommendedForms.length} recommended forms and set up all folders.`,
        action: {
          label: "View Client",
          onClick: () => navigate(`/client/${newClient.id}`)
        }
      });
      
      // Call the onClientCreated callback if provided
      if (onClientCreated) {
        onClientCreated(newClient.id);
      }
      
      onOpenChange(false);
    } catch (error) {
      console.error("Error creating client:", error);
      toast.error("Failed to create client");
    } finally {
      setIsProcessing(false);
      setIsCreatingClient(false);
    }
  };
  
  const handleDocumentUpload = (documentId: string) => {
    setUploadedDocumentIds(prev => [...prev, documentId]);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle>AI-Powered Client Intake</DialogTitle>
          <DialogDescription>
            Complete the intake process to automatically create client folders and determine required forms.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 overflow-hidden flex flex-col">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="basic">Basic Information</TabsTrigger>
            <TabsTrigger value="documents" disabled={!clientData.name}>Document Upload</TabsTrigger>
            <TabsTrigger value="forms" disabled={recommendedForms.length === 0}>Form Recommendations</TabsTrigger>
          </TabsList>
          
          <div className="flex-1 overflow-auto">
            <TabsContent value="basic" className="mt-4 h-full">
              <ClientIntakeForm 
                clientData={clientData}
                setClientData={setClientData}
                onAnalyze={analyzeClientData}
                isProcessing={isProcessing}
                progressStatus={progressStatus}
              />
            </TabsContent>
            
            <TabsContent value="documents" className="mt-4 h-full">
              <FileUploadSection 
                clientName={clientData.name}
                onDocumentUpload={handleDocumentUpload}
              />
            </TabsContent>
            
            <TabsContent value="forms" className="mt-4 h-full">
              <FormRecommendationPanel 
                recommendedForms={recommendedForms}
                clientName={clientData.name}
              />
            </TabsContent>
          </div>
        </Tabs>
        
        <DialogFooter className="flex justify-between border-t pt-4 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          
          {activeTab === "forms" && (
            <Button onClick={handleCreateClient} disabled={isProcessing}>
              {isProcessing ? (
                <div className="flex items-center">
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                  {progressStatus || "Processing..."}
                </div>
              ) : (
                "Create Client & Setup Folders"
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

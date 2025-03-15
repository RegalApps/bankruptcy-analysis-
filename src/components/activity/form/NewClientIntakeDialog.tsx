
import { useState, useEffect } from "react";
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
import { EnhancedClientIntakeForm } from "./EnhancedClientIntakeForm";
import { FileUploadSection } from "./FileUploadSection";
import { FormRecommendationPanel } from "./FormRecommendationPanel";
import { RiskCompliancePanel } from "./RiskCompliancePanel";
import { SmartSchedulingPanel } from "./SmartSchedulingPanel";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { createClientFolder } from "@/utils/documents/folder-utils";
import { organizeDocumentIntoFolders } from "@/utils/documents/folder-utils/organizeDocuments";
import { 
  AiOutlineScan, 
  AiOutlineCheckCircle, 
  AiOutlineWarning 
} from "react-icons/ai";

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
  const [ocrProcessing, setOcrProcessing] = useState(false);
  const [ocrResults, setOcrResults] = useState<any>(null);
  const [riskLevel, setRiskLevel] = useState<'low' | 'medium' | 'high' | null>(null);
  const [aiAnalysisComplete, setAiAnalysisComplete] = useState(false);
  
  // Expanded client data model to match requirements
  const [clientData, setClientData] = useState({
    // Personal Information
    name: "",
    dateOfBirth: "",
    sin: "",
    maritalStatus: "",
    email: "",
    phone: {
      home: "",
      mobile: "",
      work: ""
    },
    address: {
      street: "",
      city: "",
      province: "",
      postalCode: ""
    },
    
    // Employment & Income
    employment: {
      status: "", // full-time, part-time, self-employed, unemployed, retired
      employer: "",
      occupation: "",
      industry: ""
    },
    income: {
      monthly: "",
      frequency: "", // bi-weekly, monthly, etc.
      secondary: [],
      governmentBenefits: []
    },
    
    // Business Information (for self-employed)
    business: {
      name: "",
      registrationNumber: "",
      type: "", // sole proprietorship, partnership, corporation
      annualRevenue: "",
      annualExpenses: "",
      debts: [],
      outstandingTaxes: ""
    },
    
    // Debts & Financial Obligations
    debt: {
      unsecured: "",
      secured: "",
      taxDebt: "",
      courtJudgments: "",
      pendingLawsuits: ""
    },
    
    // Assets
    assets: {
      realEstate: [],
      bankAccounts: [],
      investments: [],
      vehicles: [],
      personalAssets: []
    },
    
    // Monthly Expenses
    expenses: {
      housing: "",
      utilities: "",
      transportation: "",
      food: "",
      childcare: "",
      health: "",
      entertainment: "",
      debtRepayments: ""
    },
    
    // Spouse details (if married)
    spouse: {
      name: "",
      sin: "",
      income: "",
      occupation: "",
      assets: []
    },
    
    // Risk factors and compliance flags
    hasExistingDebt: false,
    previousBankruptcy: false,
    estimatedDebtAmount: "",
    
    // Analysis results
    aiAnalysis: {
      debtToIncomeRatio: null,
      disposableIncome: null,
      suggestedSolution: null,
      complianceIssues: [],
      riskFactors: []
    }
  });
  
  const [recommendedForms, setRecommendedForms] = useState<Array<{
    formNumber: string;
    formName: string;
    required: boolean;
    description: string;
    dueDate?: string;
    completed?: boolean;
  }>>([]);
  
  // Simulate OCR processing when documents are uploaded
  useEffect(() => {
    if (uploadedDocumentIds.length > 0 && !ocrResults) {
      setOcrProcessing(true);
      
      // Simulate OCR processing delay
      setTimeout(() => {
        // Fake OCR results - in real implementation, this would come from the OCR service
        const sampleOcrResults = {
          personalInfo: {
            name: clientData.name || "John Smith",
            address: "123 Main Street, Toronto, ON M5V 2K7",
            sin: "123-456-789"
          },
          financialInfo: {
            income: "4500.00",
            taxDebt: "12500.00",
            creditCardDebt: "15000.00",
            mortgageBalance: "320000.00"
          },
          previousFilings: {
            hasPreviousBankruptcy: false,
            dateOfLastFiling: ""
          }
        };
        
        setOcrResults(sampleOcrResults);
        setOcrProcessing(false);
        
        // Auto-fill form with OCR results
        setClientData(prevData => ({
          ...prevData,
          name: prevData.name || sampleOcrResults.personalInfo.name,
          sin: sampleOcrResults.personalInfo.sin,
          address: {
            ...prevData.address,
            street: sampleOcrResults.personalInfo.address.split(',')[0].trim(),
            city: sampleOcrResults.personalInfo.address.split(',')[1].trim(),
            province: sampleOcrResults.personalInfo.address.split(',')[2].trim().split(' ')[0],
            postalCode: sampleOcrResults.personalInfo.address.split(',')[2].trim().split(' ')[1]
          },
          income: {
            ...prevData.income,
            monthly: sampleOcrResults.financialInfo.income
          },
          debt: {
            ...prevData.debt,
            unsecured: sampleOcrResults.financialInfo.creditCardDebt,
            secured: sampleOcrResults.financialInfo.mortgageBalance,
            taxDebt: sampleOcrResults.financialInfo.taxDebt
          }
        }));
        
        toast.success("Documents processed with AI OCR", {
          description: "Form has been pre-filled with extracted information"
        });
      }, 3000);
    }
  }, [uploadedDocumentIds, ocrResults, clientData.name]);

  // Function to analyze client data and determine insolvency options
  const analyzeClientData = async () => {
    setIsProcessing(true);
    setProgressStatus("Analyzing financial information...");
    
    // Simulate AI analysis
    setTimeout(() => {
      // Calculate debt-to-income ratio
      const totalDebt = 
        parseFloat(clientData.debt.secured || "0") + 
        parseFloat(clientData.debt.unsecured || "0") + 
        parseFloat(clientData.debt.taxDebt || "0");
      
      const monthlyIncome = parseFloat(clientData.income.monthly || "0");
      const debtToIncomeRatio = monthlyIncome > 0 ? (totalDebt / (monthlyIncome * 12)) : 0;
      
      // Calculate disposable income (simplified)
      const totalMonthlyExpenses = 
        parseFloat(clientData.expenses.housing || "0") +
        parseFloat(clientData.expenses.utilities || "0") +
        parseFloat(clientData.expenses.transportation || "0") +
        parseFloat(clientData.expenses.food || "0") +
        parseFloat(clientData.expenses.childcare || "0") +
        parseFloat(clientData.expenses.health || "0") +
        parseFloat(clientData.expenses.entertainment || "0") +
        parseFloat(clientData.expenses.debtRepayments || "0");
      
      const disposableIncome = monthlyIncome - totalMonthlyExpenses;
      
      // Determine recommended solution
      let suggestedSolution = "";
      let riskLevel: 'low' | 'medium' | 'high' = 'medium';
      
      if (totalDebt > 250000 && clientData.previousBankruptcy) {
        suggestedSolution = "Bankruptcy";
        riskLevel = 'high';
      } else if (totalDebt > 100000 && disposableIncome > 200) {
        suggestedSolution = "Consumer Proposal";
        riskLevel = 'medium';
      } else if (totalDebt > 50000 && debtToIncomeRatio > 0.8) {
        suggestedSolution = "Bankruptcy";
        riskLevel = 'high';
      } else if (totalDebt < 50000 && disposableIncome > 500) {
        suggestedSolution = "Debt Management Plan";
        riskLevel = 'low';
      } else {
        suggestedSolution = "Further Assessment Required";
        riskLevel = 'medium';
      }
      
      // Identify compliance issues
      const complianceIssues = [];
      
      if (!clientData.name) complianceIssues.push("Missing client name");
      if (!clientData.sin) complianceIssues.push("Missing SIN (required for insolvency filing)");
      if (clientData.maritalStatus === "married" && !clientData.spouse.name) 
        complianceIssues.push("Missing spouse information (required for married clients)");
      if (!clientData.income.monthly) 
        complianceIssues.push("Missing income information");
      
      // Set risk level
      setRiskLevel(riskLevel);
      
      // Update client data with analysis
      setClientData(prevData => ({
        ...prevData,
        aiAnalysis: {
          debtToIncomeRatio,
          disposableIncome,
          suggestedSolution,
          complianceIssues,
          riskFactors: debtToIncomeRatio > 0.8 ? ["High debt-to-income ratio"] : []
        }
      }));
      
      // Determine recommended forms based on analysis
      const baseRecommendations = [
        {
          formNumber: "1",
          formName: "Statement of Affairs",
          required: true,
          description: "Required for all insolvency filings",
          dueDate: getRandomFutureDate(7),
          completed: false
        },
        {
          formNumber: "2",
          formName: "Statement of Income & Expenses",
          required: true,
          description: "Details the client's monthly budget",
          dueDate: getRandomFutureDate(7),
          completed: false
        }
      ];
      
      // Additional forms based on suggested solution
      if (suggestedSolution === "Bankruptcy") {
        if (clientData.previousBankruptcy) {
          baseRecommendations.push(
            {
              formNumber: "33",
              formName: "Application for Bankruptcy Order",
              required: true,
              description: "Required for bankruptcy filing",
              dueDate: getRandomFutureDate(10),
              completed: false
            },
            {
              formNumber: "34",
              formName: "Bankruptcy Order",
              required: true,
              description: "Court issued bankruptcy declaration",
              dueDate: getRandomFutureDate(14),
              completed: false
            },
            {
              formNumber: "35",
              formName: "Certificate of Appointment",
              required: true,
              description: "Official trustee appointment document",
              dueDate: getRandomFutureDate(21),
              completed: false
            }
          );
        } else {
          baseRecommendations.push(
            {
              formNumber: "5",
              formName: "Assignment for the General Benefit of Creditors",
              required: true,
              description: "Required for first-time bankruptcy",
              dueDate: getRandomFutureDate(10),
              completed: false
            },
            {
              formNumber: "6",
              formName: "Bankruptcy Order",
              required: true,
              description: "Court bankruptcy declaration",
              dueDate: getRandomFutureDate(14),
              completed: false
            }
          );
        }
      } else if (suggestedSolution === "Consumer Proposal") {
        baseRecommendations.push(
          {
            formNumber: "47",
            formName: "Consumer Proposal",
            required: true,
            description: "Main filing for Consumer Proposal",
            dueDate: getRandomFutureDate(10),
            completed: false
          },
          {
            formNumber: "3",
            formName: "Proof of Claim",
            required: true,
            description: "Required for creditors to file claims",
            dueDate: getRandomFutureDate(30),
            completed: false
          }
        );
      }
      
      // Add corporate forms if applicable
      if (clientData.employment.status === "self-employed") {
        baseRecommendations.push(
          {
            formNumber: "82",
            formName: "Business Financial Statement",
            required: true,
            description: "Required for business owners",
            dueDate: getRandomFutureDate(14),
            completed: false
          },
          {
            formNumber: "85",
            formName: "Business Proof of Claim",
            required: false,
            description: "For business creditors to file claims",
            dueDate: getRandomFutureDate(30),
            completed: false
          }
        );
      }
      
      setRecommendedForms(baseRecommendations);
      setProgressStatus("Analysis complete");
      setIsProcessing(false);
      setAiAnalysisComplete(true);
      setActiveTab("analysis");
    }, 2500);
  };
  
  // Helper function to generate random future dates for form deadlines
  const getRandomFutureDate = (daysAhead: number): string => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + daysAhead);
    return futureDate.toISOString().split('T')[0];
  };
  
  const handleCreateClient = async () => {
    try {
      setIsProcessing(true);
      setIsCreatingClient(true);
      setProgressStatus("Creating client record...");
      
      // Create client in database with enhanced metadata
      const { data: newClient, error } = await supabase
        .from("clients")
        .insert({
          name: clientData.name,
          email: clientData.email,
          phone: clientData.phone.mobile || clientData.phone.home,
          metadata: {
            personal: {
              name: clientData.name,
              dateOfBirth: clientData.dateOfBirth,
              sin: clientData.sin,
              maritalStatus: clientData.maritalStatus,
              address: clientData.address,
              phoneDetails: clientData.phone
            },
            employment: clientData.employment,
            income: clientData.income,
            business: clientData.business,
            debt: clientData.debt,
            assets: clientData.assets,
            expenses: clientData.expenses,
            spouse: clientData.spouse,
            analysis: clientData.aiAnalysis,
            riskLevel: riskLevel,
            recommendedForms: recommendedForms.map(form => form.formNumber)
          },
          status: 'active'
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
      
      // Create subfolders based on case type
      await createSubfolders(clientFolderId, clientData.aiAnalysis.suggestedSolution || "General", user.id);
      
      // Organize uploaded documents
      setProgressStatus("Organizing uploaded documents...");
      for (const docId of uploadedDocumentIds) {
        // Determine form type based on AI analysis
        const formType = recommendedForms[0]?.formNumber || "Form-1";
        await organizeDocumentIntoFolders(docId, user.id, clientData.name, formType);
      }
      
      // Create reminders/tasks for required forms
      await createTasksForForms(newClient.id, recommendedForms, user.id);
      
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
  
  // Create subfolders for client documents
  const createSubfolders = async (parentFolderId: string, caseType: string, userId: string) => {
    const baseFolders = [
      { name: "Forms & Legal Filings", folder_type: "forms" },
      { name: "Financial Documents", folder_type: "financial" },
      { name: "Client Communications", folder_type: "communications" },
      { name: "Signed Documents", folder_type: "signed" },
      { name: "Risk & Compliance Reports", folder_type: "risk" }
    ];
    
    // Create each subfolder
    for (const folder of baseFolders) {
      try {
        await supabase.from("documents").insert({
          title: folder.name,
          is_folder: true,
          folder_type: folder.folder_type,
          parent_folder_id: parentFolderId,
          user_id: userId,
          metadata: {
            case_type: caseType,
            client_name: clientData.name
          }
        });
      } catch (error) {
        console.error(`Error creating ${folder.name} folder:`, error);
      }
    }
  };
  
  // Create tasks for required forms
  const createTasksForForms = async (clientId: string, forms: any[], userId: string) => {
    const requiredForms = forms.filter(form => form.required);
    
    for (const form of requiredForms) {
      try {
        await supabase.from("client_tasks").insert({
          title: `Complete ${form.formName} (Form ${form.formNumber})`,
          description: form.description,
          due_date: form.dueDate ? new Date(form.dueDate) : null,
          priority: form.required ? "high" : "medium",
          status: "pending",
          client_id: clientId,
          created_by: userId,
          assigned_to: userId
        });
      } catch (error) {
        console.error(`Error creating task for ${form.formName}:`, error);
      }
    }
  };
  
  const handleDocumentUpload = (documentId: string) => {
    setUploadedDocumentIds(prev => [...prev, documentId]);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] flex flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle>AI-Powered Client Intake</DialogTitle>
          <DialogDescription>
            Complete the intake process to automatically create client folders and determine required forms.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 overflow-hidden flex flex-col">
          <TabsList className="grid grid-cols-5">
            <TabsTrigger value="basic">Basic Information</TabsTrigger>
            <TabsTrigger value="financial" disabled={!clientData.name}>Financial Details</TabsTrigger>
            <TabsTrigger value="documents" disabled={!clientData.name}>Document Upload</TabsTrigger>
            <TabsTrigger value="analysis" disabled={!aiAnalysisComplete}>AI Analysis</TabsTrigger>
            <TabsTrigger value="forms" disabled={recommendedForms.length === 0}>Required Forms</TabsTrigger>
          </TabsList>
          
          <div className="flex-1 overflow-auto">
            <TabsContent value="basic" className="mt-4 h-full">
              <EnhancedClientIntakeForm 
                clientData={clientData}
                setClientData={setClientData}
                ocrProcessing={ocrProcessing}
                ocrResults={ocrResults}
                section="personal"
              />
            </TabsContent>
            
            <TabsContent value="financial" className="mt-4 h-full">
              <EnhancedClientIntakeForm 
                clientData={clientData}
                setClientData={setClientData}
                ocrProcessing={ocrProcessing}
                ocrResults={ocrResults}
                section="financial"
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
            
            <TabsContent value="analysis" className="mt-4 h-full">
              <RiskCompliancePanel 
                clientData={clientData}
                riskLevel={riskLevel}
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
          {activeTab !== "basic" && (
            <Button variant="outline" onClick={() => {
              const tabs = ["basic", "financial", "documents", "analysis", "forms"];
              const currentIndex = tabs.indexOf(activeTab);
              if (currentIndex > 0) {
                setActiveTab(tabs[currentIndex - 1]);
              }
            }}>
              Previous
            </Button>
          )}
          
          {activeTab !== "forms" ? (
            <Button onClick={() => {
              const tabs = ["basic", "financial", "documents", "analysis", "forms"];
              const currentIndex = tabs.indexOf(activeTab);
              
              if (activeTab === "financial") {
                // Trigger analysis before proceeding
                if (!aiAnalysisComplete) {
                  analyzeClientData();
                  return;
                }
              }
              
              if (currentIndex < tabs.length - 1) {
                const nextTab = tabs[currentIndex + 1];
                
                // Skip analysis tab if not completed yet
                if (nextTab === "analysis" && !aiAnalysisComplete) {
                  setActiveTab("documents");
                  return;
                }
                
                // Skip forms tab if not available yet
                if (nextTab === "forms" && recommendedForms.length === 0) {
                  return;
                }
                
                setActiveTab(nextTab);
              }
            }}>
              Next
            </Button>
          ) : (
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


import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Calendar, Clock, Users } from "lucide-react";
import { ClientIntakeSection } from "@/components/crm/ClientIntakeSection";
import { ClientDashboard } from "@/components/crm/ClientDashboard";
import { IntelligentScheduling } from "@/components/crm/IntelligentScheduling";
import { DocumentVault } from "@/components/crm/DocumentVault";
import { AIWorkflow } from "@/components/crm/AIWorkflow";
import { MainHeader } from "@/components/header/MainHeader";
import { MainSidebar } from "@/components/layout/MainSidebar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { FormSteps } from "@/components/crm/FormSteps";
import { Progress } from "@/components/ui/progress";
import { FormData } from "@/components/crm/types";
import { toast } from "sonner";

export const CRMPage = () => {
  const [isClientDialogOpen, setIsClientDialogOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formProgress, setFormProgress] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    companyName: "",
    businessType: "",
    notes: "",
    address: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Calculate progress based on filled fields
    calculateProgress();
  };
  
  const handleSelectChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    calculateProgress();
  };
  
  const handleEmploymentTypeChange = (value: string) => {
    setFormData(prev => ({ ...prev, employmentType: value }));
    calculateProgress();
  };
  
  const calculateProgress = () => {
    // Step 1: Personal Info (8 fields)
    const step1Fields = ['fullName', 'dateOfBirth', 'sin', 'maritalStatus', 'address', 'city', 'province', 'postalCode', 'email', 'mobilePhone'];
    const step1FilledFields = step1Fields.filter(field => formData[field as keyof FormData]);
    const step1Progress = Math.min(100, (step1FilledFields.length / 6) * 100); // At least 6 fields for 100%
    
    // Step 2: Employment & Income (5 fields)
    const step2Fields = ['employmentType', 'employer', 'occupation', 'monthlyIncome', 'incomeFrequency'];
    const step2FilledFields = step2Fields.filter(field => formData[field as keyof FormData]);
    const step2Progress = Math.min(100, (step2FilledFields.length / 3) * 100); // At least 3 fields for 100%
    
    // Step 3: Financial Details (6 fields)
    const step3Fields = ['unsecuredDebt', 'securedDebt', 'taxDebt', 'realEstate', 'vehicles', 'bankAccounts'];
    const step3FilledFields = step3Fields.filter(field => formData[field as keyof FormData]);
    const step3Progress = Math.min(100, (step3FilledFields.length / 3) * 100); // At least 3 fields for 100%
    
    // Calculate total progress based on current step
    let totalProgress;
    if (currentStep === 1) {
      totalProgress = step1Progress * 0.25;
    } else if (currentStep === 2) {
      totalProgress = 25 + (step2Progress * 0.25);
    } else if (currentStep === 3) {
      totalProgress = 50 + (step3Progress * 0.25);
    } else if (currentStep === 4) {
      totalProgress = 75 + (25 * 0.25); // Document upload step
    } else {
      totalProgress = 100; // Final step
    }
    
    setFormProgress(Math.round(totalProgress));
  };

  const openClientDialog = () => {
    setCurrentStep(1);
    setFormProgress(0);
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      companyName: "",
      businessType: "",
      notes: "",
      address: ""
    });
    setIsClientDialogOpen(true);
  };
  
  const handleSubmitForm = () => {
    // Handle final form submission
    toast.success("Client added successfully", {
      description: "New client has been created with all provided information.",
    });
    setIsClientDialogOpen(false);
  };

  return (
    <div className="min-h-screen flex">
      <MainSidebar />
      <div className="flex-1 flex flex-col ml-64">
        <MainHeader />
        <div className="container mx-auto p-6 space-y-8">
          {/* Header Section */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Client Management</h1>
              <p className="text-muted-foreground mt-1">
                Manage your clients and automate workflows
              </p>
            </div>
            <div className="flex gap-4">
              <Button variant="outline" className="gap-2">
                <Bell className="h-4 w-4" />
                Notifications
              </Button>
              <Button className="gap-2" onClick={openClientDialog}>
                <Users className="h-4 w-4" />
                Add New Client
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">245</div>
                <p className="text-xs text-muted-foreground">+4% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Scheduled Meetings</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">This week</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground">3 high priority</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="dashboard" className="space-y-4">
            <TabsList>
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="intake">Client Intake</TabsTrigger>
              <TabsTrigger value="scheduling">Scheduling</TabsTrigger>
              <TabsTrigger value="documents">Document Vault</TabsTrigger>
              <TabsTrigger value="workflow">AI Workflow</TabsTrigger>
            </TabsList>
            <TabsContent value="dashboard" className="space-y-4">
              <ClientDashboard />
            </TabsContent>
            <TabsContent value="intake" className="space-y-4">
              <ClientIntakeSection />
            </TabsContent>
            <TabsContent value="scheduling" className="space-y-4">
              <IntelligentScheduling />
            </TabsContent>
            <TabsContent value="documents" className="space-y-4">
              <DocumentVault />
            </TabsContent>
            <TabsContent value="workflow" className="space-y-4">
              <AIWorkflow />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Enhanced AI-Powered Client Intake Dialog */}
      <Dialog open={isClientDialogOpen} onOpenChange={setIsClientDialogOpen}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>AI-Powered Client Intake</DialogTitle>
            <DialogDescription>
              Complete the comprehensive intake process to collect all required information for insolvency assessment.
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-4 space-y-6">
            {/* Progress Indicator */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Completion Progress</span>
                <span>{formProgress}%</span>
              </div>
              <Progress value={formProgress} className="h-2" />
            </div>
            
            <Tabs value={`step-${currentStep}`} className="mt-4">
              <TabsList className="grid grid-cols-5 w-full">
                <TabsTrigger value="step-1" onClick={() => setCurrentStep(1)}>Personal Info</TabsTrigger>
                <TabsTrigger value="step-2" onClick={() => setCurrentStep(2)}>Employment</TabsTrigger>
                <TabsTrigger value="step-3" onClick={() => setCurrentStep(3)}>Finances</TabsTrigger>
                <TabsTrigger value="step-4" onClick={() => setCurrentStep(4)}>Documents</TabsTrigger>
                <TabsTrigger value="step-5" onClick={() => setCurrentStep(5)}>Schedule</TabsTrigger>
              </TabsList>
              
              <form onSubmit={(e) => {
                e.preventDefault();
                if (currentStep < 5) {
                  setCurrentStep(prev => prev + 1);
                  calculateProgress();
                } else {
                  handleSubmitForm();
                }
              }}>
                <FormSteps 
                  currentStep={currentStep} 
                  formData={formData}
                  handleInputChange={handleInputChange}
                  handleSelectChange={handleSelectChange}
                  handleEmploymentTypeChange={handleEmploymentTypeChange}
                />
                
                <div className="flex justify-between mt-6">
                  {currentStep > 1 && (
                    <Button type="button" variant="outline" onClick={() => setCurrentStep(prev => prev - 1)}>
                      Previous
                    </Button>
                  )}
                  <div className="ml-auto">
                    {currentStep < 5 ? (
                      <Button type="submit">Continue</Button>
                    ) : (
                      <Button type="submit">Complete Intake</Button>
                    )}
                  </div>
                </div>
              </form>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CRMPage;

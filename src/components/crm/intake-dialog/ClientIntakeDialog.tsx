
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { FormSteps } from "@/components/crm/FormSteps";
import { FormData } from "@/components/crm/types";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { BrainCog } from "lucide-react";

interface ClientIntakeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: () => void;
  formData: FormData;
  formProgress: number;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (field: string, value: string) => void;
  handleEmploymentTypeChange: (value: string) => void;
}

export const ClientIntakeDialog = ({
  open,
  onOpenChange,
  onSubmit,
  formData,
  formProgress,
  currentStep,
  setCurrentStep,
  handleInputChange,
  handleSelectChange,
  handleEmploymentTypeChange
}: ClientIntakeDialogProps) => {
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiProgress, setAiProgress] = useState(0);

  // Simulate AI progress when form is submitted
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    
    if (isGeneratingAI && aiProgress < 100) {
      intervalId = setInterval(() => {
        setAiProgress(prev => {
          const newValue = prev + Math.floor(Math.random() * 15) + 5;
          if (newValue >= 100) {
            clearInterval(intervalId);
            // Simulate AI analysis complete
            setTimeout(() => {
              setIsGeneratingAI(false);
              onSubmit();
              toast.success("Client profile created successfully", {
                description: "AI has generated risk assessment and insights"
              });
            }, 500);
            return 100;
          }
          return newValue;
        });
      }, 600);
    }
    
    return () => clearInterval(intervalId);
  }, [isGeneratingAI, aiProgress, onSubmit]);

  const handleSubmitWithAI = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else {
      // Start AI analysis simulation
      setIsGeneratingAI(true);
      setAiProgress(0);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
          
          {isGeneratingAI ? (
            <div className="space-y-4 py-6">
              <div className="flex items-center gap-3 mb-4">
                <BrainCog className="h-6 w-6 text-primary animate-pulse" />
                <h3 className="text-lg font-medium">AI Processing Client Data</h3>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Generating risk assessment and insights</span>
                  <span>{aiProgress}%</span>
                </div>
                <Progress value={aiProgress} className="h-2" />
              </div>
              
              <div className="rounded-md bg-muted p-4 text-sm">
                <p className="mb-2 font-medium">AI is currently:</p>
                <ul className="space-y-1 list-disc pl-5">
                  {aiProgress > 20 && <li>Analyzing client financial information</li>}
                  {aiProgress > 40 && <li>Identifying potential risk factors</li>}
                  {aiProgress > 60 && <li>Generating revenue forecasts</li>}
                  {aiProgress > 80 && <li>Creating personalized client engagement strategy</li>}
                  {aiProgress > 95 && <li>Finalizing client profile</li>}
                </ul>
              </div>
            </div>
          ) : (
            <Tabs value={`step-${currentStep}`} className="mt-4">
              <TabsList className="grid grid-cols-5 w-full">
                <TabsTrigger value="step-1" onClick={() => setCurrentStep(1)}>Personal Info</TabsTrigger>
                <TabsTrigger value="step-2" onClick={() => setCurrentStep(2)}>Employment</TabsTrigger>
                <TabsTrigger value="step-3" onClick={() => setCurrentStep(3)}>Finances</TabsTrigger>
                <TabsTrigger value="step-4" onClick={() => setCurrentStep(4)}>Documents</TabsTrigger>
                <TabsTrigger value="step-5" onClick={() => setCurrentStep(5)}>Schedule</TabsTrigger>
              </TabsList>
              
              <form onSubmit={handleSubmitWithAI}>
                <FormSteps 
                  currentStep={currentStep} 
                  formData={formData}
                  handleInputChange={handleInputChange}
                  handleSelectChange={handleSelectChange}
                  handleEmploymentTypeChange={handleEmploymentTypeChange}
                />
                
                <div className="flex justify-between mt-6">
                  {currentStep > 1 && (
                    <Button type="button" variant="outline" onClick={() => setCurrentStep(currentStep - 1)}>
                      Previous
                    </Button>
                  )}
                  <div className="ml-auto">
                    {currentStep < 5 ? (
                      <Button type="submit">Continue</Button>
                    ) : (
                      <Button type="submit" className="gap-2">
                        <BrainCog className="h-4 w-4" />
                        Complete with AI Analysis
                      </Button>
                    )}
                  </div>
                </div>
              </form>
            </Tabs>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

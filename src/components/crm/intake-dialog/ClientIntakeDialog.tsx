
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { FormSteps } from "@/components/crm/FormSteps";
import { FormData } from "@/components/crm/types";
import { useState } from "react";

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
                setCurrentStep(currentStep + 1);
              } else {
                onSubmit();
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
                  <Button type="button" variant="outline" onClick={() => setCurrentStep(currentStep - 1)}>
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
  );
};

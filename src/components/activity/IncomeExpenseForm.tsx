
import { Button } from "@/components/ui/button";
import { ClientProfileSection } from "./form/ClientProfileSection";
import { EnhancedIncomeSection } from "./form/EnhancedIncomeSection";
import { EssentialExpensesSection } from "./form/EssentialExpensesSection";
import { DiscretionaryExpensesSection } from "./form/DiscretionaryExpensesSection";
import { SavingsInsuranceSection } from "./form/SavingsInsuranceSection";
import { HistoricalComparison } from "./components/HistoricalComparison";
import { DocumentUploadSection } from "./components/DocumentUploadSection";
import { useIncomeExpenseForm } from "./hooks/useIncomeExpenseForm";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Client } from "./types";
import { AlertCircle, User2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface IncomeExpenseFormProps {
  selectedClient: Client | null;
}

export const IncomeExpenseForm = ({ selectedClient }: IncomeExpenseFormProps) => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  
  const {
    formData,
    isSubmitting,
    currentRecordId,
    historicalData,
    previousMonthData,
    selectedPeriod,
    isDataLoading,
    handleChange,
    handleFrequencyChange,
    handleSubmit,
    handlePeriodChange,
    handleFieldSelectChange,
  } = useIncomeExpenseForm(selectedClient);

  // Display toast notification to encourage user to select a client if none selected
  useEffect(() => {
    if (!selectedClient) {
      const timer = setTimeout(() => {
        toast.info("Select a client to begin", {
          description: "Choose a client above to see their financial data",
          duration: 5000,
        });
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [selectedClient]);

  // Custom submit handler to dispatch custom event
  const onSubmitForm = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    await handleSubmit(e);
    setFormSubmitted(true);
    
    // Dispatch custom event to notify other components
    if (selectedClient) {
      console.log("Form submitted - Dispatching update event");
      const updateEvent = new CustomEvent('financial-data-updated', { 
        detail: { clientId: selectedClient.id } 
      });
      window.dispatchEvent(updateEvent);
    }
    
    // Reset the submitted state after a delay
    setTimeout(() => setFormSubmitted(false), 3000);
  };

  if (!selectedClient) {
    return (
      <Card className="py-12">
        <CardContent className="flex flex-col items-center justify-center text-center space-y-4">
          <User2 className="h-12 w-12 text-muted-foreground" />
          <h3 className="text-lg font-medium">No Client Selected</h3>
          <p className="text-muted-foreground max-w-md">
            Please select a client above to begin entering financial data.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={onSubmitForm} className="space-y-6">
      {/* Real-time update notice */}
      <Alert className="bg-blue-50 border-blue-200">
        <AlertCircle className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          Financial data is synced in real-time. After submitting, the dashboard and predictive analysis will update automatically.
        </AlertDescription>
      </Alert>
      
      {formSubmitted && (
        <Alert className="bg-green-50 border-green-200">
          <AlertCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Data submitted successfully! Other tabs will update automatically.
          </AlertDescription>
        </Alert>
      )}
      
      {isDataLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-[200px] w-full rounded-lg" />
          <Skeleton className="h-[400px] w-full rounded-lg" />
          <Skeleton className="h-[400px] w-full rounded-lg" />
        </div>
      ) : (
        <>
          <HistoricalComparison
            currentPeriod={historicalData.currentPeriod}
            previousPeriod={historicalData.previousPeriod}
          />

          <Card>
            <CardHeader>
              <CardTitle>Select Period</CardTitle>
              <CardDescription>Choose which month you want to record data for</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup 
                defaultValue="current" 
                value={selectedPeriod}
                onValueChange={(value) => handlePeriodChange(value as 'current' | 'previous')}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="current" id="current" />
                  <Label htmlFor="current">Current Month</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="previous" id="previous" />
                  <Label htmlFor="previous">Previous Month</Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
          
          {/* Client Profile Section */}
          <ClientProfileSection 
            formData={formData} 
            onChange={handleChange}
            onMaritalStatusChange={(value) => handleFieldSelectChange('marital_status', value)}
          />
          
          {/* Enhanced Income Section */}
          <EnhancedIncomeSection 
            formData={formData} 
            previousMonthData={previousMonthData}
            onChange={handleChange}
            onFrequencyChange={handleFrequencyChange('income')}
          />
          
          {/* Essential Expenses Section */}
          <EssentialExpensesSection 
            formData={formData} 
            previousMonthData={previousMonthData}
            onChange={handleChange}
          />
          
          {/* Discretionary Expenses Section */}
          <DiscretionaryExpensesSection 
            formData={formData} 
            previousMonthData={previousMonthData}
            onChange={handleChange}
          />
          
          {/* Savings & Insurance Section */}
          <SavingsInsuranceSection 
            formData={formData} 
            previousMonthData={previousMonthData}
            onChange={handleChange}
          />
          
          <DocumentUploadSection financialRecordId={currentRecordId} />
          
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Submitting..." : "Submit Financial Data"}
          </Button>
        </>
      )}
    </form>
  );
};

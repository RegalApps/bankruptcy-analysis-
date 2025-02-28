
import { Button } from "@/components/ui/button";
import { IncomeSection } from "./form/IncomeSection";
import { ExpensesSection } from "./form/ExpensesSection";
import { ClientSelector } from "./form/ClientSelector";
import { HistoricalComparison } from "./components/HistoricalComparison";
import { DocumentUploadSection } from "./components/DocumentUploadSection";
import { useIncomeExpenseForm } from "./hooks/useIncomeExpenseForm";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const IncomeExpenseForm = () => {
  const {
    formData,
    isSubmitting,
    selectedClient,
    currentRecordId,
    historicalData,
    previousMonthData,
    selectedPeriod,
    isDataLoading,
    handleChange,
    handleFrequencyChange,
    handleClientSelect,
    handleSubmit,
    handlePeriodChange,
  } = useIncomeExpenseForm();

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <ClientSelector 
        selectedClient={selectedClient}
        onClientSelect={handleClientSelect}
      />
      
      {isDataLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-[200px] w-full rounded-lg" />
          <Skeleton className="h-[400px] w-full rounded-lg" />
          <Skeleton className="h-[400px] w-full rounded-lg" />
        </div>
      ) : (
        <>
          {selectedClient && (
            <HistoricalComparison
              currentPeriod={historicalData.currentPeriod}
              previousPeriod={historicalData.previousPeriod}
            />
          )}

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
          
          <IncomeSection 
            formData={formData} 
            onChange={handleChange}
            onFrequencyChange={handleFrequencyChange('income')}
          />
          
          <ExpensesSection 
            formData={formData} 
            onChange={handleChange}
            onFrequencyChange={handleFrequencyChange('expense')}
            previousMonthData={previousMonthData}
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

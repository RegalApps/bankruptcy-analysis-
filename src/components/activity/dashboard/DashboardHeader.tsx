
import React from "react";
import { PrintButton } from "../form/PrintButton";
import { SmartCreateDocumentButton } from "../form/SmartCreateDocumentButton";
import { Client, IncomeExpenseData } from "../types";

interface DashboardHeaderProps {
  selectedClient: Client;
  formData: IncomeExpenseData;
  isSubmitting: boolean;
  handleSubmit: (e: React.SyntheticEvent<HTMLFormElement>) => void;
}

export const DashboardHeader = ({ 
  selectedClient, 
  formData, 
  isSubmitting, 
  handleSubmit 
}: DashboardHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold">Financial Dashboard: {selectedClient.name}</h2>
      <div className="flex gap-2">
        <PrintButton formData={formData} />
        <SmartCreateDocumentButton 
          formData={formData}
          selectedClient={selectedClient}
          isSubmitting={isSubmitting}
          onSubmit={() => handleSubmit(new Event('submit') as unknown as React.SyntheticEvent<HTMLFormElement>)}
        />
      </div>
    </div>
  );
};

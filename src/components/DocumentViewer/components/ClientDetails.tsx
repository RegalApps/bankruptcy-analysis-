
import React from "react";

interface ClientDetailsProps {
  extractedInfo: {
    clientName?: string;
    clientAddress?: string;
    clientPhone?: string;
    clientEmail?: string;
    trusteeName?: string;
    trusteeAddress?: string;
    trusteePhone?: string;
    trusteeEmail?: string;
    administratorName?: string;
    formNumber?: string;
    dateSigned?: string;
    estateNumber?: string;
    [key: string]: any;
  };
}

export const ClientDetails: React.FC<ClientDetailsProps> = ({ extractedInfo }) => {
  // Helper to render a detail field only if it has a value
  const renderField = (label: string, value?: string) => {
    if (!value) return null;
    
    return (
      <div className="mb-2">
        <span className="text-sm font-medium text-muted-foreground">{label}:</span>
        <p className="text-sm">{value}</p>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold">Client Information</h3>
      </div>
      
      <div className="rounded-lg border bg-card p-4 shadow-sm">
        {renderField("Client Name", extractedInfo.clientName)}
        {renderField("Client Address", extractedInfo.clientAddress)}
        {renderField("Client Phone", extractedInfo.clientPhone)}
        {renderField("Client Email", extractedInfo.clientEmail)}
        
        <div className="border-t my-3" />
        
        {renderField("Trustee Name", extractedInfo.trusteeName || extractedInfo.administratorName)}
        {renderField("Trustee Address", extractedInfo.trusteeAddress)}
        {renderField("Trustee Contact", extractedInfo.trusteePhone)}
        {renderField("Trustee Email", extractedInfo.trusteeEmail)}
        
        <div className="border-t my-3" />
        
        {renderField("Form Number", extractedInfo.formNumber)}
        {renderField("Date Signed", extractedInfo.dateSigned)}
        {renderField("Estate Number", extractedInfo.estateNumber)}
        {renderField("Filing Date", extractedInfo.filingDate)}
        {renderField("Submission Deadline", extractedInfo.submissionDeadline)}
      </div>
    </div>
  );
};

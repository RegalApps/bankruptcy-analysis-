
import React from 'react';

interface ClientInfo {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  language: string;
  filing_date: string;
  status: string;
}

interface ClientAgreementTemplateProps {
  clientInfo: ClientInfo;
}

export const ClientAgreementTemplate: React.FC<ClientAgreementTemplateProps> = ({ clientInfo }) => {
  const today = new Date().toLocaleDateString();
  const trustee = "John Smith, LIT";
  
  return (
    <div className="space-y-4 p-6 bg-white dark:bg-zinc-900 border rounded-md font-serif">
      <div className="text-right mb-8">
        <p>{today}</p>
      </div>
      
      <div className="mb-8">
        <p>{clientInfo.name}</p>
        <p>{clientInfo.address || "No address provided"}</p>
      </div>
      
      <p className="font-semibold">RE: Engagement Letter for Insolvency Services</p>
      
      <p>Dear {clientInfo.name},</p>
      
      <div className="space-y-4 my-8">
        <p>
          This letter confirms our engagement for insolvency services. I, {trustee}, will provide 
          professional services related to your financial situation.
        </p>
        
        <p>
          Based on our initial assessment, I will guide you through the process, prepare and file all 
          required documentation, and represent your interests with creditors.
        </p>
        
        <p>
          Our fees are regulated by the Bankruptcy and Insolvency Act and will be discussed 
          in detail during our consultation.
        </p>
        
        <p>
          If you have any questions or concerns, please don't hesitate to contact me at 
          john.smith@example.com or (555) 123-4567.
        </p>
      </div>
      
      <p>Sincerely,</p>
      
      <div className="mt-8">
        <p className="font-semibold">{trustee}</p>
        <p>Licensed Insolvency Trustee</p>
      </div>
    </div>
  );
};

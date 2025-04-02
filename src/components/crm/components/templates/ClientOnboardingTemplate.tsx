
import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';

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

interface ClientOnboardingTemplateProps {
  clientInfo: ClientInfo;
}

export const ClientOnboardingTemplate: React.FC<ClientOnboardingTemplateProps> = ({ clientInfo }) => {
  const today = new Date().toLocaleDateString();
  const followupDate = new Date();
  followupDate.setDate(followupDate.getDate() + 7);
  
  // Mock checklist items
  const documents = [
    { name: "Government-issued ID", complete: true },
    { name: "Income verification (pay stubs for last 3 months)", complete: false },
    { name: "Tax returns for the last 2 years", complete: true },
    { name: "Credit card statements (last 3 months)", complete: false },
    { name: "Bank statements (last 3 months)", complete: false },
    { name: "List of assets and approximate values", complete: true },
    { name: "List of creditors and amounts owed", complete: true },
  ];
  
  const tasks = [
    { name: "Initial consultation completed", complete: true },
    { name: "Credit counseling session booked", complete: false },
    { name: "Financial assessment completed", complete: true },
    { name: "Client agreement signed", complete: false },
    { name: "File opened with Office of the Superintendent of Bankruptcy", complete: false },
  ];
  
  const followups = [
    { name: `Schedule follow-up meeting on ${followupDate.toLocaleDateString()}`, complete: false },
    { name: "Send reminder for missing documents", complete: false },
    { name: "Set up payment schedule", complete: false },
  ];
  
  const CheckItem = ({ item }: { item: { name: string; complete: boolean } }) => (
    <div className="flex items-start space-x-2">
      {item.complete ? 
        <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" /> : 
        <Circle className="h-5 w-5 text-gray-300 dark:text-gray-600 mt-0.5 flex-shrink-0" />
      }
      <span className={item.complete ? "line-through text-gray-500" : ""}>{item.name}</span>
    </div>
  );
  
  return (
    <div className="space-y-6 p-6 bg-white dark:bg-zinc-900 border rounded-md">
      <div className="border-b pb-4">
        <h2 className="text-xl font-bold">Client Onboarding Checklist</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">for {clientInfo.name}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">Date: {today}</p>
      </div>
      
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Required Documents:</h3>
        <div className="space-y-2 ml-2">
          {documents.map((doc, i) => (
            <CheckItem key={i} item={doc} />
          ))}
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Required Tasks:</h3>
        <div className="space-y-2 ml-2">
          {tasks.map((task, i) => (
            <CheckItem key={i} item={task} />
          ))}
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Follow-up Actions:</h3>
        <div className="space-y-2 ml-2">
          {followups.map((followup, i) => (
            <CheckItem key={i} item={followup} />
          ))}
        </div>
      </div>
      
      <div className="pt-4 border-t">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          <span className="font-medium">Assigned to:</span> Robert Johnson
        </p>
      </div>
    </div>
  );
};

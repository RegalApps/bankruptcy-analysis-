
import React from 'react';
import { AlertTriangle, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

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

interface RiskAssessmentTemplateProps {
  clientInfo: ClientInfo;
}

export const RiskAssessmentTemplate: React.FC<RiskAssessmentTemplateProps> = ({ clientInfo }) => {
  const today = new Date().toLocaleDateString();
  const fileNumber = "BK-2024-" + Math.floor(1000 + Math.random() * 9000);
  
  // Mock risk data
  const riskScore = 68;
  const getRiskLevel = (score: number) => {
    if (score < 30) return { level: "Low", color: "green" };
    if (score < 70) return { level: "Medium", color: "yellow" };
    return { level: "High", color: "red" };
  };
  
  const riskLevel = getRiskLevel(riskScore);
  
  return (
    <div className="space-y-6 p-6 bg-white dark:bg-zinc-900 border rounded-md">
      <div className="border-b pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Risk Assessment</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">for {clientInfo.name}</p>
          </div>
          <div>
            <Badge variant="outline" className="text-xs">
              File #: {fileNumber}
            </Badge>
          </div>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Date: {today}</p>
      </div>
      
      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Compliance Risk Factors
          </h3>
          
          <div className="space-y-4 ml-2">
            <div className="space-y-2">
              <h4 className="font-medium">Missed Deadlines</h4>
              <div className="ml-4 space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Form 65 submission</span>
                  <Badge variant="outline" className="text-red-500 bg-red-50 dark:bg-red-950">Overdue</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Monthly income reporting</span>
                  <Badge variant="outline" className="text-green-500 bg-green-50 dark:bg-green-950">On schedule</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Counseling sessions</span>
                  <Badge variant="outline" className="text-amber-500 bg-amber-50 dark:bg-amber-950">Due soon</Badge>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">Missing Documentation</h4>
              <div className="ml-4 space-y-1 text-sm">
                <div className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-red-500" />
                  <span>Income verification</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Tax returns</span>
                </div>
                <div className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-red-500" />
                  <span>Asset documentation</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">Financial Inconsistencies</h4>
              <div className="ml-4 space-y-1 text-sm">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                  <span>Housing expenses vs. income ratio (32%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>No undisclosed assets found</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                  <span>Recent large transactions ($5,000+)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
          <h3 className="font-semibold text-lg mb-4">Overall Risk Assessment</h3>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1">
              <p className="text-sm font-medium mb-1">Risk Score</p>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div 
                  className={`h-2.5 rounded-full bg-${riskLevel.color}-500`}
                  style={{ width: `${riskScore}%` }}
                ></div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold">{riskScore}/100</p>
              <Badge className={`bg-${riskLevel.color}-500/10 text-${riskLevel.color}-500`}>
                {riskLevel.level} Risk
              </Badge>
            </div>
          </div>
          
          <div className="space-y-2 mt-4">
            <h4 className="font-medium">Recommendations</h4>
            <ul className="list-disc ml-5 space-y-1 text-sm">
              <li>Request missing income documentation within 7 days</li>
              <li>Schedule compliance review for Form 65 submission</li>
              <li>Verify source of large transactions</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t pt-4 text-sm text-gray-500 dark:text-gray-400">
          <p>Assessed by: Jennifer Williams, Compliance Officer</p>
        </div>
      </div>
    </div>
  );
};

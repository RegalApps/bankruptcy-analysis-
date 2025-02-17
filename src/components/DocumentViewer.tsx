
import { useState } from 'react';
import { File, Calendar, AlertTriangle, MessageSquare, History, Lock, Share2 } from 'lucide-react';

interface DocumentDetails {
  clientName: string;
  trusteeName: string;
  dateSigned: string;
  formNumber: string;
  formType: string;
}

interface RiskAssessment {
  level: 'low' | 'medium' | 'high';
  issues: string[];
}

export const DocumentViewer = () => {
  const [activeTab, setActiveTab] = useState<'details' | 'comments' | 'history'>('details');

  // Mock data - replace with actual data later
  const documentDetails: DocumentDetails = {
    clientName: "John Smith",
    trusteeName: "Jane Doe",
    dateSigned: "2024-02-20",
    formNumber: "Form 65",
    formType: "Proof of Claim"
  };

  const riskAssessment: RiskAssessment = {
    level: 'medium',
    issues: [
      "Missing creditor signature",
      "Deadline approaching (5 days remaining)"
    ]
  };

  return (
    <div className="h-[calc(100vh-8rem)] grid grid-cols-[1fr,1.5fr] gap-6 animate-fade-in">
      {/* Left Panel */}
      <div className="bg-card rounded-lg border p-6 space-y-6 overflow-y-auto">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Document Details</h2>
            <p className="text-sm text-muted-foreground">Form review and analysis</p>
          </div>
          <div className="flex gap-2">
            <button className="p-2 hover:bg-secondary rounded-md">
              <Share2 className="h-5 w-5" />
            </button>
            <button className="p-2 hover:bg-secondary rounded-md">
              <Lock className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {/* Client & Form Details */}
          <div className="space-y-4">
            <h3 className="font-medium">Client & Form Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Client Name</p>
                <p className="text-sm font-medium">{documentDetails.clientName}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Trustee Name</p>
                <p className="text-sm font-medium">{documentDetails.trusteeName}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Date Signed</p>
                <p className="text-sm font-medium">{documentDetails.dateSigned}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Form Number</p>
                <p className="text-sm font-medium">{documentDetails.formNumber}</p>
              </div>
            </div>
          </div>

          {/* Risk Assessment */}
          <div className="space-y-4">
            <h3 className="font-medium">Risk Assessment</h3>
            <div className={`p-4 rounded-lg border ${
              riskAssessment.level === 'high' ? 'bg-red-50 border-red-200' :
              riskAssessment.level === 'medium' ? 'bg-yellow-50 border-yellow-200' :
              'bg-green-50 border-green-200'
            }`}>
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className={`h-5 w-5 ${
                  riskAssessment.level === 'high' ? 'text-red-500' :
                  riskAssessment.level === 'medium' ? 'text-yellow-500' :
                  'text-green-500'
                }`} />
                <span className="font-medium capitalize">{riskAssessment.level} Risk</span>
              </div>
              <ul className="space-y-2">
                {riskAssessment.issues.map((issue, index) => (
                  <li key={index} className="text-sm flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                    {issue}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Deadline System */}
          <div className="space-y-4">
            <h3 className="font-medium">Deadlines & Reminders</h3>
            <button className="w-full flex items-center justify-center gap-2 p-3 border rounded-lg hover:bg-secondary transition-colors">
              <Calendar className="h-5 w-5" />
              <span>Set Deadline</span>
            </button>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="bg-card rounded-lg border">
        <div className="border-b">
          <div className="flex items-center">
            <button
              onClick={() => setActiveTab('details')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'details' ? 'border-primary text-primary' : 'border-transparent hover:text-primary'
              }`}
            >
              Document
            </button>
            <button
              onClick={() => setActiveTab('comments')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'comments' ? 'border-primary text-primary' : 'border-transparent hover:text-primary'
              }`}
            >
              Comments
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'history' ? 'border-primary text-primary' : 'border-transparent hover:text-primary'
              }`}
            >
              History
            </button>
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'details' && (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              <File className="h-16 w-16" />
            </div>
          )}
          {activeTab === 'comments' && (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              <MessageSquare className="h-16 w-16" />
            </div>
          )}
          {activeTab === 'history' && (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              <History className="h-16 w-16" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

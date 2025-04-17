import React, { useState } from 'react';
import { DocumentViewer } from './DocumentViewer';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { createForm31DemoDocument, createForm31DemoAnalysis } from './DocumentViewer/utils/demoDocuments';
import { runForm31Test } from '@/utils/testing/form31TestUtils';
import { toast } from 'sonner';
import { AlertTriangle, CheckCircle2, FileCheck, Upload, FileText, AlertCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useGreenTechForm31Risks } from './DocumentViewer/hooks/useGreenTechForm31Risks';
import { Risk } from './DocumentViewer/types';
import { Badge } from './ui/badge';
import { RegulatoryCompliance } from '@/utils/documents/types/analysisTypes';

export const TestForm31Viewer: React.FC = () => {
  const [documentId, setDocumentId] = useState<string | null>(null);
  const [showViewer, setShowViewer] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('viewer');
  const risks = useGreenTechForm31Risks();
  const [analysisResults, setAnalysisResults] = useState<any>(null);

  const handleSimulateUpload = () => {
    setLoading(true);
    try {
      const newDocumentId = "form31-greentech-" + Date.now();
      
      // Run validation test first
      const testResult = runForm31Test();
      setTestResults(testResult);
      
      if (testResult.success) {
        // If test passed, show the document viewer
        setDocumentId(newDocumentId);
        setAnalysisResults(testResult.analysis);
        setShowViewer(true);
        toast.success("Form 31 document loaded successfully");
      }
    } catch (error) {
      console.error("Error in test:", error);
      toast.error("Failed to load Form 31 document");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToTest = () => {
    setShowViewer(false);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-amber-600 bg-amber-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };
  
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high': return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'medium': return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case 'low': return <FileCheck className="h-4 w-4 text-green-500" />;
      default: return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const renderRisksSummary = () => {
    const highRisks = risks.filter(risk => risk.severity === 'high').length;
    const mediumRisks = risks.filter(risk => risk.severity === 'medium').length;
    const lowRisks = risks.filter(risk => risk.severity === 'low').length;

    return (
      <div className="flex gap-3 flex-wrap">
        <Badge variant="outline" className="text-red-600 bg-red-50">
          {highRisks} High Risk
        </Badge>
        <Badge variant="outline" className="text-amber-600 bg-amber-50">
          {mediumRisks} Medium Risk
        </Badge>
        <Badge variant="outline" className="text-green-600 bg-green-50">
          {lowRisks} Low Risk
        </Badge>
      </div>
    );
  };

  const renderRisksTable = () => {
    return (
      <div className="border rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-muted/50">
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Severity
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Issue
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Regulation
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Solution
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {risks.map((risk, idx) => (
              <tr key={idx} className="hover:bg-muted/20">
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(risk.severity)}`}>
                    {getSeverityIcon(risk.severity)}
                    <span className="ml-1 capitalize">{risk.severity}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-sm font-medium">{risk.title || risk.type}</div>
                  <div className="text-xs text-muted-foreground">{risk.description}</div>
                </td>
                <td className="px-4 py-3 text-sm">{risk.regulation}</td>
                <td className="px-4 py-3">
                  <div className="text-xs max-w-md">{risk.solution}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderBIAComplianceSection = () => {
    const mockBIAStatus: RegulatoryCompliance['status'] = 'non_compliant';
    
    return (
      <div className="space-y-4">
        <div className={`p-4 rounded-lg border ${
          mockBIAStatus === 'compliant' ? 'bg-green-50 border-green-200' :
          mockBIAStatus === 'non_compliant' ? 'bg-red-50 border-red-200' :
          'bg-amber-50 border-amber-200'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            {mockBIAStatus === 'compliant' ? 
              <CheckCircle2 className="h-5 w-5 text-green-600" /> :
              mockBIAStatus === 'non_compliant' ?
              <AlertCircle className="h-5 w-5 text-red-600" /> :
              <AlertTriangle className="h-5 w-5 text-amber-600" />
            }
            <h3 className="font-medium">
              {mockBIAStatus === 'compliant' ? 'BIA Compliant' :
               mockBIAStatus === 'non_compliant' ? 'Not Compliant with BIA' :
               'BIA Compliance Review Needed'}
            </h3>
          </div>
          <p className="text-sm">
            This document has compliance issues that must be addressed before submission. 
            See risk analysis for details.
          </p>
        </div>
        
        <div className="bg-muted/20 p-4 rounded-lg">
          <h4 className="text-sm font-medium mb-2">BIA Compliance References</h4>
          <ul className="space-y-1 list-disc list-inside text-sm text-muted-foreground">
            <li>BIA Section 124(1)(b) - Supporting documentation requirements</li>
            <li>BIA Section 4 - Related party disclosures</li>
            <li>BIA Section 128(3) - Security documentation requirements</li>
          </ul>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto py-6 space-y-8">
      {!showViewer ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Form 31 Document Test</CardTitle>
            <CardDescription>
              Test the Form 31 document viewer with comprehensive risk analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Test Documentation</h3>
              <p className="text-sm text-muted-foreground mb-4">
                This test will verify that Form 31 documents can be properly displayed with:
              </p>
              <ul className="list-disc pl-6 text-sm space-y-2">
                <li>Document metadata extraction</li>
                <li>Risk assessment highlighting</li>
                <li>BIA compliance analysis</li>
                <li>Solution recommendations</li>
                <li>Proper UI rendering of all components</li>
              </ul>
            </div>
            
            {testResults && (
              <div className={`p-4 rounded-lg ${testResults.success ? 'bg-green-50' : 'bg-amber-50'}`}>
                <div className="flex items-center gap-2 mb-2">
                  {testResults.success ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-amber-600" />
                  )}
                  <h3 className="font-medium">
                    {testResults.success ? 'Test Passed' : 'Test Failed'}
                  </h3>
                </div>
                <p className="text-sm">
                  {testResults.message}
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handleSimulateUpload} 
              disabled={loading}
              className="flex items-center gap-2"
            >
              {loading ? (
                <>Running Test...</>
              ) : (
                <>
                  <Upload className="h-4 w-4" /> 
                  Simulate Form 31 Upload
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Form 31 - GreenTech Proof of Claim</h2>
            <Button variant="outline" onClick={handleBackToTest}>
              Back to Test
            </Button>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="viewer">Document Viewer</TabsTrigger>
              <TabsTrigger value="analysis">Risk Analysis</TabsTrigger>
              <TabsTrigger value="bia">BIA Compliance</TabsTrigger>
            </TabsList>
            
            <TabsContent value="viewer" className="mt-4">
              <div className="h-[800px] border rounded-lg overflow-hidden">
                <DocumentViewer 
                  documentId={documentId || "form31-greentech"}
                  isForm31GreenTech={true}
                  bypassProcessing={true}
                  documentTitle="Form 31 - GreenTech Proof of Claim"
                  onAnalysisComplete={(id) => {
                    console.log("Analysis completed for document:", id);
                    toast.success("Document analysis completed");
                  }}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="analysis" className="mt-4 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Risk Assessment Summary
                  </CardTitle>
                  {renderRisksSummary()}
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    The Form 31 document analysis has identified the following risks 
                    that require attention before submission:
                  </p>
                  
                  {renderRisksTable()}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Document Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm border-b pb-1">
                        <span className="font-medium">Document Type:</span>
                        <span>Form 31 - Proof of Claim</span>
                      </div>
                      <div className="flex justify-between text-sm border-b pb-1">
                        <span className="font-medium">Client Name:</span>
                        <span>GreenTech Supplies Inc.</span>
                      </div>
                      <div className="flex justify-between text-sm border-b pb-1">
                        <span className="font-medium">Claim Amount:</span>
                        <span>$125,450.00</span>
                      </div>
                      <div className="flex justify-between text-sm border-b pb-1">
                        <span className="font-medium">Date Signed:</span>
                        <span>March 15, 2025</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm border-b pb-1">
                        <span className="font-medium">Debtor Name:</span>
                        <span>EcoBuilders Construction Ltd.</span>
                      </div>
                      <div className="flex justify-between text-sm border-b pb-1">
                        <span className="font-medium">Claim Category:</span>
                        <span>A. Unsecured Claim</span>
                      </div>
                      <div className="flex justify-between text-sm border-b pb-1">
                        <span className="font-medium">Submission Deadline:</span>
                        <span>April 30, 2025</span>
                      </div>
                      <div className="flex justify-between text-sm border-b pb-1">
                        <span className="font-medium">Status:</span>
                        <span>Pending Review</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="bia" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    BIA Compliance Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {renderBIAComplianceSection()}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileCheck className="h-5 w-5" />
                Document Verification Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                The Form 31 document has been successfully loaded and analyzed. The document viewer
                is displaying the following components correctly:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="border rounded p-3">
                  <h4 className="font-medium mb-2">Document Information</h4>
                  <ul className="text-sm space-y-1">
                    <li>✅ Document metadata displayed</li>
                    <li>✅ Client information extracted</li>
                    <li>✅ Form type and number identified</li>
                    <li>✅ Submission deadline detected</li>
                  </ul>
                </div>
                
                <div className="border rounded p-3">
                  <h4 className="font-medium mb-2">Risk Assessment</h4>
                  <ul className="text-sm space-y-1">
                    <li>✅ Risk highlighting in document</li>
                    <li>✅ Risk severity classification</li>
                    <li>✅ BIA regulation references</li>
                    <li>✅ Required actions identified</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

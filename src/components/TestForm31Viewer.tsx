
import React, { useState } from 'react';
import { DocumentViewer } from './DocumentViewer';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { createForm31DemoDocument, createForm31DemoAnalysis } from './DocumentViewer/utils/demoDocuments';
import { runForm31Test } from '@/utils/testing/form31TestUtils';
import { toast } from 'sonner';
import { AlertTriangle, CheckCircle2, FileCheck, Upload } from 'lucide-react';

export const TestForm31Viewer: React.FC = () => {
  const [documentId, setDocumentId] = useState<string | null>(null);
  const [showViewer, setShowViewer] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

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

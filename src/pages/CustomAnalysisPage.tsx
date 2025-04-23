import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { setCustomAnalysis, clearAllCustomAnalysis, CustomAnalysisData } from '@/utils/customAnalysis';
import logger from '@/utils/logger';
import { Info, AlertCircle, CheckCircle, Trash2 } from 'lucide-react';

const CustomAnalysisPage: React.FC = () => {
  const [pdfTitle1, setPdfTitle1] = useState<string>('');
  const [jsonData1, setJsonData1] = useState<string>('');
  const [pdfTitle2, setPdfTitle2] = useState<string>('');
  const [jsonData2, setJsonData2] = useState<string>('');
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [savedAnalyses, setSavedAnalyses] = useState<{title: string, data: CustomAnalysisData}[]>([]);

  // Load saved analyses from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('custom_analysis_data');
      if (stored) {
        const data = JSON.parse(stored);
        const analyses = Object.entries(data).map(([title, data]) => ({
          title,
          data: data as CustomAnalysisData
        }));
        setSavedAnalyses(analyses);
      }
    } catch (error) {
      logger.error('Error loading saved analyses:', error);
    }
  }, []);

  const handleSaveAnalysis1 = () => {
    if (!pdfTitle1.trim()) {
      setMessage({ type: 'error', text: 'Please enter a PDF title' });
      return;
    }

    try {
      const data = JSON.parse(jsonData1);
      setCustomAnalysis(pdfTitle1, data);
      setMessage({ type: 'success', text: `Analysis for "${pdfTitle1}" saved successfully!` });
      
      // Refresh the list of saved analyses
      try {
        const stored = localStorage.getItem('custom_analysis_data');
        if (stored) {
          const allData = JSON.parse(stored);
          setSavedAnalyses(
            Object.entries(allData).map(([title, data]) => ({
              title,
              data: data as CustomAnalysisData
            }))
          );
        }
      } catch (error) {
        // Ignore errors
      }
    } catch (error) {
      setMessage({ type: 'error', text: `Invalid JSON: ${error.message}` });
    }
  };

  const handleSaveAnalysis2 = () => {
    if (!pdfTitle2.trim()) {
      setMessage({ type: 'error', text: 'Please enter a PDF title' });
      return;
    }

    try {
      const data = JSON.parse(jsonData2);
      setCustomAnalysis(pdfTitle2, data);
      setMessage({ type: 'success', text: `Analysis for "${pdfTitle2}" saved successfully!` });
      
      // Refresh the list of saved analyses
      try {
        const stored = localStorage.getItem('custom_analysis_data');
        if (stored) {
          const allData = JSON.parse(stored);
          setSavedAnalyses(
            Object.entries(allData).map(([title, data]) => ({
              title,
              data: data as CustomAnalysisData
            }))
          );
        }
      } catch (error) {
        // Ignore errors
      }
    } catch (error) {
      setMessage({ type: 'error', text: `Invalid JSON: ${error.message}` });
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all custom analyses?')) {
      clearAllCustomAnalysis();
      setMessage({ type: 'info', text: 'All custom analyses cleared' });
      setSavedAnalyses([]);
    }
  };

  const handleUseTemplate = (template: number) => {
    if (template === 1) {
      const sampleData = {
        "extracted_info": {
          "clientName": "Alpha Industries Inc.",
          "formNumber": "B-201",
          "formType": "chapter 11 bankruptcy",
          "documentStatus": "incomplete",
          "summary": "Chapter 11 Bankruptcy Petition with multiple errors and missing schedules."
        },
        "risks": [
          {
            "type": "Critical Omission",
            "description": "Statement of Financial Affairs (SOFA) incomplete - missing payments to creditors section",
            "severity": "high",
            "regulation": "Bankruptcy Code §521(a)(1)(B)(iii)",
            "impact": "Potential dismissal of case or denial of discharge",
            "requiredAction": "Complete SOFA with all required information",
            "solution": "File amended SOFA within 14 days",
            "deadline": "14 days"
          },
          {
            "type": "Inconsistency",
            "description": "Reported income on Schedule I doesn't match bank statements",
            "severity": "high",
            "regulation": "Bankruptcy Code §707(b)(4)(D)",
            "impact": "Potential audit by U.S. Trustee",
            "requiredAction": "Verify income calculations",
            "solution": "Prepare documentation supporting income amounts",
            "deadline": "7 days"
          },
          {
            "type": "Procedural Error",
            "description": "Certificate of Credit Counseling missing",
            "severity": "medium",
            "regulation": "Bankruptcy Code §109(h)",
            "impact": "Automatic dismissal of case if not corrected",
            "requiredAction": "Obtain credit counseling certificate",
            "solution": "Complete approved course and file certificate",
            "deadline": "Immediate"
          }
        ]
      };
      
      setJsonData1(JSON.stringify(sampleData, null, 2));
    } else if (template === 2) {
      const sampleData = {
        "extracted_info": {
          "clientName": "Beta Corporation",
          "formNumber": "CRT-47",
          "formType": "business credit application",
          "documentStatus": "pending",
          "summary": "Commercial credit application with significant business risk indicators."
        },
        "risks": [
          {
            "type": "Inadequate Collateral",
            "description": "Proposed collateral value insufficient for requested credit line",
            "severity": "high",
            "regulation": "Lender Credit Policy Section 5.12",
            "impact": "Loan-to-value ratio exceeds policy maximum of 75%",
            "requiredAction": "Additional collateral required",
            "solution": "Provide additional business assets or personal guarantee",
            "deadline": "Prior to approval"
          },
          {
            "type": "Financial Discrepancy",
            "description": "Cash flow projections inconsistent with historical performance",
            "severity": "medium",
            "regulation": "Financial Industry Regulatory Requirements",
            "impact": "Credibility of repayment ability questioned",
            "requiredAction": "Justify revenue growth assumptions",
            "solution": "Provide detailed business plan with market analysis",
            "deadline": "5 business days"
          },
          {
            "type": "Legal Structure Risk",
            "description": "Recent corporate restructuring not fully documented",
            "severity": "medium",
            "regulation": "Know Your Customer Regulations",
            "impact": "Unclear ownership/liability structure",
            "requiredAction": "Provide corporate ownership documentation",
            "solution": "Submit articles of reorganization and new operating agreement",
            "deadline": "10 business days"
          }
        ]
      };
      
      setJsonData2(JSON.stringify(sampleData, null, 2));
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Custom Document Analysis Setup</h1>
      <p className="mb-6 text-muted-foreground">
        Define custom analysis data for specific PDF titles. This analysis will appear in the left sidebar when viewing the corresponding PDF.
      </p>

      {message && (
        <Alert className={`mb-6 ${message.type === 'success' ? 'bg-green-50' : message.type === 'error' ? 'bg-red-50' : 'bg-blue-50'}`}>
          {message.type === 'success' ? <CheckCircle className="h-4 w-4" /> : 
           message.type === 'error' ? <AlertCircle className="h-4 w-4" /> : 
           <Info className="h-4 w-4" />}
          <AlertTitle>{message.type === 'success' ? 'Success' : message.type === 'error' ? 'Error' : 'Information'}</AlertTitle>
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="pdf1" className="mb-6">
        <TabsList>
          <TabsTrigger value="pdf1">PDF #1</TabsTrigger>
          <TabsTrigger value="pdf2">PDF #2</TabsTrigger>
          <TabsTrigger value="saved">Saved Analyses</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pdf1">
          <Card>
            <CardHeader>
              <CardTitle>PDF #1 Analysis</CardTitle>
              <CardDescription>
                Enter the PDF title and custom analysis data in JSON format.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="pdfTitle1">PDF Title (exact match)</Label>
                  <Input
                    id="pdfTitle1"
                    value={pdfTitle1}
                    onChange={(e) => setPdfTitle1(e.target.value)}
                    placeholder="Enter the exact PDF title, e.g., 'bankruptcy-petition.pdf'"
                  />
                </div>
                <div>
                  <div className="flex justify-between">
                    <Label htmlFor="jsonData1">Analysis Data (JSON)</Label>
                    <Button variant="outline" size="sm" onClick={() => handleUseTemplate(1)}>
                      Use Template
                    </Button>
                  </div>
                  <Textarea
                    id="jsonData1"
                    value={jsonData1}
                    onChange={(e) => setJsonData1(e.target.value)}
                    placeholder='{"extracted_info": {...}, "risks": [...]}'
                    className="font-mono h-[300px]"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveAnalysis1}>Save Analysis</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="pdf2">
          <Card>
            <CardHeader>
              <CardTitle>PDF #2 Analysis</CardTitle>
              <CardDescription>
                Enter the PDF title and custom analysis data in JSON format.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="pdfTitle2">PDF Title (exact match)</Label>
                  <Input
                    id="pdfTitle2"
                    value={pdfTitle2}
                    onChange={(e) => setPdfTitle2(e.target.value)}
                    placeholder="Enter the exact PDF title, e.g., 'credit-report.pdf'"
                  />
                </div>
                <div>
                  <div className="flex justify-between">
                    <Label htmlFor="jsonData2">Analysis Data (JSON)</Label>
                    <Button variant="outline" size="sm" onClick={() => handleUseTemplate(2)}>
                      Use Template
                    </Button>
                  </div>
                  <Textarea
                    id="jsonData2"
                    value={jsonData2}
                    onChange={(e) => setJsonData2(e.target.value)}
                    placeholder='{"extracted_info": {...}, "risks": [...]}'
                    className="font-mono h-[300px]"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveAnalysis2}>Save Analysis</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="saved">
          <Card>
            <CardHeader>
              <CardTitle>Saved Analyses</CardTitle>
              <CardDescription>
                View and manage your saved custom analyses.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {savedAnalyses.length === 0 ? (
                <p className="text-muted-foreground">No saved analyses found.</p>
              ) : (
                <div className="space-y-4">
                  {savedAnalyses.map((analysis, index) => (
                    <div key={index} className="border p-4 rounded-md">
                      <h3 className="font-bold mb-2">{analysis.title}</h3>
                      <p className="text-sm mb-1">
                        <span className="font-medium">Form Type:</span> {analysis.data.extracted_info.formType}
                      </p>
                      <p className="text-sm mb-1">
                        <span className="font-medium">Client:</span> {analysis.data.extracted_info.clientName}
                      </p>
                      <p className="text-sm mb-2">
                        <span className="font-medium">Risks:</span> {analysis.data.risks.length} identified
                      </p>
                      <details className="text-sm">
                        <summary className="cursor-pointer">View JSON Data</summary>
                        <pre className="mt-2 p-2 bg-muted text-xs rounded-md overflow-auto max-h-[200px]">
                          {JSON.stringify(analysis.data, null, 2)}
                        </pre>
                      </details>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="destructive" onClick={handleClearAll} className="flex items-center gap-1">
                <Trash2 className="h-4 w-4" />
                Clear All
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-8 p-4 border rounded-md bg-muted/50">
        <h2 className="text-xl font-bold mb-2">How to Use Custom Analysis</h2>
        <ol className="list-decimal pl-5 space-y-2">
          <li>Enter a PDF title that exactly matches the filename you'll upload</li>
          <li>Provide custom analysis JSON data in the required format</li>
          <li>Click "Save Analysis" to store your custom analysis</li>
          <li>Upload a PDF with the matching title</li>
          <li>The custom analysis will appear in the left sidebar when viewing the document</li>
        </ol>
      </div>
    </div>
  );
};

export default CustomAnalysisPage;

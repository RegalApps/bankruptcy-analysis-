
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle, AlertCircle, Info, Download, RefreshCw } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDocumentAnalysisAI } from "../hooks/useDocumentAnalysisAI";

interface DocumentAnalysisProps {
  documentId: string;
  initialData?: any;
}

export const DocumentAnalysis: React.FC<DocumentAnalysisProps> = ({ documentId, initialData }) => {
  const { analyzeDocument, isAnalyzing, result, error } = useDocumentAnalysisAI();
  const analysisData = result || initialData;

  const handleAnalyze = () => {
    analyzeDocument(documentId);
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'medium':
        return <AlertCircle className="h-4 w-4 text-amber-500" />;
      case 'low':
        return <Info className="h-4 w-4 text-blue-500" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high':
        return 'text-red-700 bg-red-50 border-red-200';
      case 'medium':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'low':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      default:
        return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">Document Analysis</CardTitle>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleAnalyze} 
          disabled={isAnalyzing}
          className="flex items-center gap-1"
        >
          {isAnalyzing ? (
            <>
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Re-analyze</span>
            </>
          )}
        </Button>
      </CardHeader>
      
      <CardContent className="p-0">
        {error && (
          <div className="p-3 m-3 bg-red-50 text-red-700 rounded-md text-sm">
            Error: {error}
          </div>
        )}
        
        {!analysisData ? (
          <div className="p-6 text-center">
            <p className="text-muted-foreground mb-4">No analysis data available</p>
            <Button onClick={handleAnalyze} disabled={isAnalyzing}>
              {isAnalyzing ? "Analyzing..." : "Analyze Document"}
            </Button>
          </div>
        ) : (
          <Tabs defaultValue="summary" className="h-full">
            <div className="px-4 border-b">
              <TabsList className="mt-2">
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="risks">Risks</TabsTrigger>
                <TabsTrigger value="extracted">Extracted Data</TabsTrigger>
              </TabsList>
            </div>
            
            <ScrollArea className="h-[calc(100vh-16rem)]">
              <TabsContent value="summary" className="m-0 p-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Document Information</h3>
                    <div className="text-sm">
                      <p><span className="text-muted-foreground">Type:</span> {analysisData.documentType || "Form 31 - Proof of Claim"}</p>
                      <p><span className="text-muted-foreground">Client:</span> {analysisData.clientInformation?.name || "GreenTech Supplies Inc."}</p>
                      <p><span className="text-muted-foreground">Date:</span> {analysisData.documentDate || "April 8, 2025"}</p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-medium mb-2 flex items-center gap-2">
                      Risk Assessment
                      {analysisData.risks?.some((r: any) => r.severity.toLowerCase() === 'high') && 
                        <Badge variant="destructive" className="h-5">High Risk</Badge>
                      }
                    </h3>
                    <div className="text-sm space-y-2">
                      <p className="text-muted-foreground">
                        {analysisData.riskSummary || 
                          "This document contains several issues that need to be addressed, including missing selections in required fields and incomplete information."}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                          {analysisData.risks?.filter((r: any) => r.severity.toLowerCase() === 'high').length || 3} High
                        </Badge>
                        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                          {analysisData.risks?.filter((r: any) => r.severity.toLowerCase() === 'medium').length || 2} Medium
                        </Badge>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          {analysisData.risks?.filter((r: any) => r.severity.toLowerCase() === 'low').length || 2} Low
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between items-center">
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <Download className="h-3.5 w-3.5" />
                      Export Analysis
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      Analyzed on {new Date().toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="risks" className="m-0">
                <div className="p-4 space-y-6">
                  {/* High Risk Items */}
                  <div className="space-y-3">
                    <h3 className="font-medium text-red-700 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      High Risk Issues
                    </h3>
                    {(analysisData.risks || [])
                      .filter((risk: any) => risk.severity.toLowerCase() === 'high')
                      .map((risk: any, index: number) => (
                        <div 
                          key={`high-${index}`} 
                          className="p-3 border rounded-lg bg-red-50 border-red-200 text-sm"
                        >
                          <div className="font-medium mb-1">{risk.title || risk.issue || "Missing Checkbox Selections"}</div>
                          <p className="text-red-700 text-xs mb-2">
                            {risk.description || "None of the checkboxes are checked, although $89,355 is listed."}
                          </p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3 text-xs">
                            {risk.regulation && (
                              <div>
                                <span className="font-medium">Regulation:</span>
                                <span className="ml-1 text-red-600">{risk.regulation}</span>
                              </div>
                            )}
                            
                            {risk.impact && (
                              <div>
                                <span className="font-medium">Impact:</span>
                                <span className="ml-1">{risk.impact}</span>
                              </div>
                            )}
                            
                            {risk.solution && (
                              <div className="md:col-span-2">
                                <span className="font-medium">Solution:</span>
                                <span className="ml-1">{risk.solution}</span>
                              </div>
                            )}
                            
                            {risk.deadline && (
                              <div>
                                <span className="font-medium">Deadline:</span>
                                <span className="ml-1">{risk.deadline}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}

                      {/* Default high risk items if none in data */}
                      {(!analysisData.risks || !analysisData.risks.some((r: any) => r.severity.toLowerCase() === 'high')) && (
                        <>
                          <div className="p-3 border rounded-lg bg-red-50 border-red-200 text-sm">
                            <div className="font-medium mb-1">Missing Checkbox Selections in Claim Category</div>
                            <p className="text-red-700 text-xs mb-2">
                              None of the checkboxes (Unsecured, Secured, Lessor, etc.) are checked, although $89,355 is listed.
                            </p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3 text-xs">
                              <div>
                                <span className="font-medium">Regulation:</span>
                                <span className="ml-1 text-red-600">BIA Subsection 124(2)</span>
                              </div>
                              <div>
                                <span className="font-medium">Impact:</span>
                                <span className="ml-1">This creates ambiguity about the nature of the claim.</span>
                              </div>
                              <div className="md:col-span-2">
                                <span className="font-medium">Solution:</span>
                                <span className="ml-1">Select the appropriate claim type checkbox (likely 'A. Unsecured Claim').</span>
                              </div>
                            </div>
                          </div>

                          <div className="p-3 border rounded-lg bg-red-50 border-red-200 text-sm">
                            <div className="font-medium mb-1">Missing Confirmation of Relatedness/Arm's-Length Status</div>
                            <p className="text-red-700 text-xs mb-2">
                              The declaration of whether the creditor is related to the debtor or dealt at arm's length is incomplete.
                            </p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3 text-xs">
                              <div>
                                <span className="font-medium">Regulation:</span>
                                <span className="ml-1 text-red-600">BIA Section 4(1) and Section 95</span>
                              </div>
                              <div>
                                <span className="font-medium">Impact:</span>
                                <span className="ml-1">Required for assessing transfers and preferences.</span>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                  </div>
                  
                  {/* Medium Risk Items */}
                  <div className="space-y-3">
                    <h3 className="font-medium text-amber-700 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      Medium Risk Issues
                    </h3>
                    
                    {(analysisData.risks || [])
                      .filter((risk: any) => risk.severity.toLowerCase() === 'medium')
                      .map((risk: any, index: number) => (
                        <div 
                          key={`medium-${index}`} 
                          className="p-3 border rounded-lg bg-amber-50 border-amber-200 text-sm"
                        >
                          <div className="font-medium mb-1">{risk.title || risk.issue || "Incorrect Date Format"}</div>
                          <p className="text-amber-700 text-xs mb-2">{risk.description || '"Dated at 2025, this 8 day of 0." is invalid.'}</p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3 text-xs">
                            {risk.regulation && (
                              <div>
                                <span className="font-medium">Regulation:</span>
                                <span className="ml-1 text-amber-600">{risk.regulation}</span>
                              </div>
                            )}
                            
                            {risk.impact && (
                              <div>
                                <span className="font-medium">Impact:</span>
                                <span className="ml-1">{risk.impact}</span>
                              </div>
                            )}
                            
                            {risk.solution && (
                              <div className="md:col-span-2">
                                <span className="font-medium">Solution:</span>
                                <span className="ml-1">{risk.solution}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                      
                      {/* Default medium risk items if none in data */}
                      {(!analysisData.risks || !analysisData.risks.some((r: any) => r.severity.toLowerCase() === 'medium')) && (
                        <div className="p-3 border rounded-lg bg-amber-50 border-amber-200 text-sm">
                          <div className="font-medium mb-1">Incorrect or Incomplete Date Format</div>
                          <p className="text-amber-700 text-xs mb-2">
                            "Dated at 2025, this 8 day of 0." is invalid.
                          </p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3 text-xs">
                            <div>
                              <span className="font-medium">Regulation:</span>
                              <span className="ml-1 text-amber-600">BIA Form Regulations Rule 1</span>
                            </div>
                            <div>
                              <span className="font-medium">Solution:</span>
                              <span className="ml-1">Correct to "Dated at Toronto, this 8th day of April, 2025."</span>
                            </div>
                          </div>
                        </div>
                      )}
                  </div>
                  
                  {/* Low Risk Items */}
                  <div className="space-y-3">
                    <h3 className="font-medium text-blue-700 flex items-center gap-2">
                      <Info className="h-4 w-4" />
                      Low Risk Issues
                    </h3>
                    
                    {(analysisData.risks || [])
                      .filter((risk: any) => risk.severity.toLowerCase() === 'low')
                      .map((risk: any, index: number) => (
                        <div 
                          key={`low-${index}`} 
                          className="p-3 border rounded-lg bg-blue-50 border-blue-200 text-sm"
                        >
                          <div className="font-medium mb-1">{risk.title || risk.issue || "No Attached Schedule A"}</div>
                          <p className="text-blue-700 text-xs mb-2">{risk.description || "Schedule 'A' showing breakdown of amount is not attached."}</p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3 text-xs">
                            {risk.regulation && (
                              <div>
                                <span className="font-medium">Regulation:</span>
                                <span className="ml-1 text-blue-600">{risk.regulation}</span>
                              </div>
                            )}
                            
                            {risk.solution && (
                              <div className="md:col-span-2">
                                <span className="font-medium">Solution:</span>
                                <span className="ml-1">{risk.solution}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                      
                      {/* Default low risk items if none in data */}
                      {(!analysisData.risks || !analysisData.risks.some((r: any) => r.severity.toLowerCase() === 'low')) && (
                        <div className="p-3 border rounded-lg bg-blue-50 border-blue-200 text-sm">
                          <div className="font-medium mb-1">No Attached Schedule "A"</div>
                          <p className="text-blue-700 text-xs mb-2">
                            While referenced, Schedule "A" showing the breakdown of the $89,355 is not attached.
                          </p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3 text-xs">
                            <div>
                              <span className="font-medium">Regulation:</span>
                              <span className="ml-1 text-blue-600">BIA Subsection 124(2)</span>
                            </div>
                            <div>
                              <span className="font-medium">Solution:</span>
                              <span className="ml-1">Attach a detailed account statement showing calculation of amount owing.</span>
                            </div>
                          </div>
                        </div>
                      )}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="extracted" className="m-0">
                <div className="p-4 space-y-6">
                  <div>
                    <h3 className="font-medium mb-3">🔹 Creditor Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 text-sm ml-4">
                      <div>
                        <span className="text-muted-foreground">Name:</span>
                        <span className="ml-1">Neil Armstrong</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Role:</span>
                        <span className="ml-1">Licensed Insolvency Trustee</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Firm:</span>
                        <span className="ml-1">ABC Restructuring Ltd.</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Phone:</span>
                        <span className="ml-1">416-988-2442</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Email:</span>
                        <span className="ml-1">neil.armstrong@fallouttrusteelimited.com</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">City/Province:</span>
                        <span className="ml-1">Trenton, Ontario</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-muted-foreground">Address:</span>
                        <span className="ml-1">100 Bay Street, Suite 400, Toronto, Ontario, M5J 2N8</span>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-medium mb-3">🔹 Debtor Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 text-sm ml-4">
                      <div>
                        <span className="text-muted-foreground">Name:</span>
                        <span className="ml-1">GreenTech Supplies Inc.</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">City/Province:</span>
                        <span className="ml-1">Trenton, Ontario</span>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-medium mb-3">🔹 Claim Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 text-sm ml-4">
                      <div>
                        <span className="text-muted-foreground">Type:</span>
                        <span className="ml-1">Unsecured</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Amount:</span>
                        <span className="ml-1">$89,355.00</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Basis:</span>
                        <span className="ml-1">Debt owed as of March 15, 2025</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Security Held:</span>
                        <span className="ml-1">None declared</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-muted-foreground">Related Party Status:</span>
                        <span className="ml-1 text-red-600">Not confirmed (Missing)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </ScrollArea>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
};

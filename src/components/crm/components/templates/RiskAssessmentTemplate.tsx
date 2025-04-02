
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ClientInfoPanel } from "@/components/client/components/ClientInfo/ClientInfoPanel";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ShieldAlert, AlertTriangle, FileWarning, Clock, FileClock, FileQuestion, Scale, TrendingDown, MessageSquare } from "lucide-react";

interface ClientInfo {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  language?: string;
  filing_date?: string;
  status?: string;
}

interface RiskAssessmentTemplateProps {
  clientInfo: ClientInfo;
}

export const RiskAssessmentTemplate = ({ clientInfo }: RiskAssessmentTemplateProps) => {
  // Mock risk data
  const riskData = {
    score: 68,
    level: "medium",
    categories: {
      deadlines: [
        { id: 1, title: "Form 65 Submission", deadline: "2023-07-05", status: "at_risk", description: "Monthly income and expense statement is due in 3 days" },
        { id: 2, title: "Creditor Meeting", deadline: "2023-07-12", status: "warning", description: "Mandatory meeting with creditors" }
      ],
      documents: [
        { id: 1, title: "Missing Paystubs", status: "high", description: "Last two pay periods not provided" },
        { id: 2, title: "Incomplete Bank Statements", status: "medium", description: "Several months missing from provided statements" }
      ],
      financialInfo: [
        { id: 1, title: "Income/Rent Ratio", status: "high", description: "Reported rent exceeds 60% of reported income" },
        { id: 2, title: "Undisclosed Bank Account", status: "medium", description: "Evidence of transfers to unreported account" }
      ],
      legalFlags: [
        { id: 1, title: "Previous Bankruptcy", status: "medium", description: "Client has a previous bankruptcy discharged 8 years ago" }
      ],
      rejectionRisk: [
        { id: 1, title: "CRA Creditor Opposition", status: "high", description: "Tax debt comprises 40% of total debt, increasing risk of objection" },
        { id: 2, title: "High Secured Debt Ratio", status: "medium", description: "Secured creditors may oppose the proposal" }
      ]
    }
  };
  
  const getRiskColorClass = (level: string) => {
    switch (level) {
      case "low":
        return "text-green-500";
      case "medium":
        return "text-amber-500";
      case "high":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "high":
      case "at_risk":
        return <Badge variant="destructive">High Risk</Badge>;
      case "medium":
      case "warning":
        return <Badge variant="outline" className="border-amber-500 text-amber-500">Medium Risk</Badge>;
      case "low":
      case "on_track":
        return <Badge variant="outline" className="border-green-500 text-green-500">Low Risk</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  return (
    <div className="space-y-6">
      <ClientInfoPanel clientInfo={clientInfo} readOnly={true} />
      
      <Card>
        <CardContent className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Risk Assessment</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-1">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Risk Score</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-24 rounded-full border-4 border-amber-500 flex items-center justify-center">
                      <span className={`text-2xl font-bold ${getRiskColorClass(riskData.level)}`}>{riskData.score}</span>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm font-medium">Risk Level</div>
                      <Badge 
                        className={`
                          ${riskData.level === "low" ? "bg-green-100 text-green-800" : 
                            riskData.level === "medium" ? "bg-amber-100 text-amber-800" : 
                            "bg-red-100 text-red-800"}
                        `}
                      >
                        {riskData.level === "low" ? "Low" : 
                         riskData.level === "medium" ? "Medium" : "High"}
                      </Badge>
                      <div className="text-xs text-muted-foreground pt-2">Last analyzed: Today</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="md:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Key Risk Indicators</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <Label>Missed Deadlines</Label>
                        <span className={getRiskColorClass("medium")}>Medium Risk</span>
                      </div>
                      <Progress value={65} className="h-2" />
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <Label>Missing Documents</Label>
                        <span className={getRiskColorClass("high")}>High Risk</span>
                      </div>
                      <Progress value={85} className="h-2" />
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <Label>Financial Information Consistency</Label>
                        <span className={getRiskColorClass("high")}>High Risk</span>
                      </div>
                      <Progress value={80} className="h-2" />
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <Label>Legal Red Flags</Label>
                        <span className={getRiskColorClass("medium")}>Medium Risk</span>
                      </div>
                      <Progress value={45} className="h-2" />
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <Label>Proposal Rejection Risk</Label>
                        <span className={getRiskColorClass("high")}>High Risk</span>
                      </div>
                      <Progress value={75} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Separator />
            
            <Tabs defaultValue="deadlines" className="space-y-4">
              <TabsList>
                <TabsTrigger value="deadlines" className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>Deadlines</span>
                </TabsTrigger>
                <TabsTrigger value="documents" className="flex items-center gap-1">
                  <FileWarning className="h-4 w-4" />
                  <span>Documents</span>
                </TabsTrigger>
                <TabsTrigger value="financial" className="flex items-center gap-1">
                  <TrendingDown className="h-4 w-4" />
                  <span>Financial</span>
                </TabsTrigger>
                <TabsTrigger value="legal" className="flex items-center gap-1">
                  <Scale className="h-4 w-4" />
                  <span>Legal</span>
                </TabsTrigger>
                <TabsTrigger value="rejection" className="flex items-center gap-1">
                  <MessageSquare className="h-4 w-4" />
                  <span>Rejection Risk</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="deadlines" className="space-y-4">
                <h4 className="font-medium flex items-center gap-2">
                  <FileClock className="h-4 w-4 text-primary" />
                  Deadline Risks
                </h4>
                
                <div className="space-y-2">
                  {riskData.categories.deadlines.map((item) => (
                    <Card key={item.id} className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="font-medium">{item.title}</h5>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                          <div className="flex items-center gap-1 mt-1 text-sm">
                            <Clock className="h-3 w-3" />
                            <span>Due: {new Date(item.deadline).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div>
                          {getStatusBadge(item.status)}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="documents" className="space-y-4">
                <h4 className="font-medium flex items-center gap-2">
                  <FileQuestion className="h-4 w-4 text-primary" />
                  Document Risks
                </h4>
                
                <div className="space-y-2">
                  {riskData.categories.documents.map((item) => (
                    <Card key={item.id} className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="font-medium">{item.title}</h5>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>
                        <div>
                          {getStatusBadge(item.status)}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="financial" className="space-y-4">
                <h4 className="font-medium flex items-center gap-2">
                  <TrendingDown className="h-4 w-4 text-primary" />
                  Financial Information Risks
                </h4>
                
                <div className="space-y-2">
                  {riskData.categories.financialInfo.map((item) => (
                    <Card key={item.id} className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="font-medium">{item.title}</h5>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>
                        <div>
                          {getStatusBadge(item.status)}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="legal" className="space-y-4">
                <h4 className="font-medium flex items-center gap-2">
                  <Scale className="h-4 w-4 text-primary" />
                  Legal Red Flags
                </h4>
                
                <div className="space-y-2">
                  {riskData.categories.legalFlags.length > 0 ? (
                    riskData.categories.legalFlags.map((item) => (
                      <Card key={item.id} className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h5 className="font-medium">{item.title}</h5>
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                          </div>
                          <div>
                            {getStatusBadge(item.status)}
                          </div>
                        </div>
                      </Card>
                    ))
                  ) : (
                    <div className="p-4 text-center text-muted-foreground">
                      No legal red flags identified
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="rejection" className="space-y-4">
                <h4 className="font-medium flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-primary" />
                  Proposal Rejection Risks
                </h4>
                
                <div className="space-y-2">
                  {riskData.categories.rejectionRisk.map((item) => (
                    <Card key={item.id} className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="font-medium">{item.title}</h5>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>
                        <div>
                          {getStatusBadge(item.status)}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline">
                Export Assessment
              </Button>
              <Button>
                Create Task from Risks
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

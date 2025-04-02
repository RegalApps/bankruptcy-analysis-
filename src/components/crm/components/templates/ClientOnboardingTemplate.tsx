
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ClientInfoPanel } from "@/components/client/components/ClientInfo/ClientInfoPanel";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clipboard, CheckCircle2, Clock, User, AlertTriangle, FileCheck } from "lucide-react";

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

interface ClientOnboardingTemplateProps {
  clientInfo: ClientInfo;
}

export const ClientOnboardingTemplate = ({ clientInfo }: ClientOnboardingTemplateProps) => {
  // Mock checklist data with statuses
  const [checklistItems, setChecklistItems] = useState([
    { id: 1, title: "Government ID Verification", status: "completed", dueDate: null, assigned: "Jane Smith" },
    { id: 2, title: "Form 47 (Assessment Certificate)", status: "completed", dueDate: null, assigned: "Jane Smith" },
    { id: 3, title: "Form 65 (Monthly Income & Expense)", status: "in_progress", dueDate: "2023-07-02", assigned: "Client" },
    { id: 4, title: "Initial Assessment Meeting", status: "completed", dueDate: null, assigned: "Robert Johnson" },
    { id: 5, title: "Credit Counseling Session 1", status: "pending", dueDate: "2023-07-10", assigned: "Maria Garcia" },
    { id: 6, title: "Credit Counseling Session 2", status: "pending", dueDate: "2023-08-15", assigned: "Maria Garcia" },
    { id: 7, title: "Notice of Stay of Proceedings", status: "completed", dueDate: null, assigned: "Jane Smith" },
    { id: 8, title: "Tax Documents (Last 2 Years)", status: "overdue", dueDate: "2023-06-15", assigned: "Client" },
    { id: 9, title: "Bank Statements (Last 6 Months)", status: "in_progress", dueDate: "2023-07-05", assigned: "Client" },
    { id: 10, title: "Creditor Package Distribution", status: "completed", dueDate: null, assigned: "System" },
    { id: 11, title: "Income Verification (Paystubs)", status: "pending", dueDate: "2023-07-08", assigned: "Client" },
    { id: 12, title: "Asset Valuation Documents", status: "pending", dueDate: "2023-07-12", assigned: "Client" },
  ]);
  
  // Calculate progress
  const completedItems = checklistItems.filter(item => item.status === "completed").length;
  const progress = Math.round((completedItems / checklistItems.length) * 100);
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case "in_progress":
        return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>;
      case "pending":
        return <Badge className="bg-gray-100 text-gray-800">Pending</Badge>;
      case "overdue":
        return <Badge className="bg-red-100 text-red-800">Overdue</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };
  
  const toggleItemStatus = (id: number) => {
    setChecklistItems(items => 
      items.map(item => 
        item.id === id 
          ? { ...item, status: item.status === "completed" ? "pending" : "completed" } 
          : item
      )
    );
  };
  
  return (
    <div className="space-y-6">
      <ClientInfoPanel clientInfo={clientInfo} readOnly={true} />
      
      <Card>
        <CardContent className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Clipboard className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Client Onboarding Checklist</h3>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Onboarding Progress</Label>
                <div className="flex items-center gap-2">
                  <Progress value={progress} className="w-[200px]" />
                  <span className="text-sm font-medium">{progress}%</span>
                </div>
              </div>
              
              <div>
                <Button variant="outline" className="gap-2">
                  <FileCheck className="h-4 w-4" />
                  Export Checklist
                </Button>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <h4 className="font-medium">Required Documents & Tasks</h4>
              
              <div className="space-y-1">
                {checklistItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-2 rounded-md hover:bg-accent/40">
                    <div className="flex items-center gap-3">
                      <Checkbox 
                        id={`item-${item.id}`} 
                        checked={item.status === "completed"} 
                        onCheckedChange={() => toggleItemStatus(item.id)}
                      />
                      <div>
                        <Label 
                          htmlFor={`item-${item.id}`} 
                          className={`font-medium cursor-pointer ${item.status === "completed" ? "line-through text-muted-foreground" : ""}`}
                        >
                          {item.title}
                        </Label>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <User className="h-3 w-3" />
                          <span>Assigned to: {item.assigned}</span>
                          
                          {item.dueDate && (
                            <>
                              <Clock className="h-3 w-3 ml-2" />
                              <span className={item.status === "overdue" ? "text-red-500 font-medium" : ""}>
                                Due: {new Date(item.dueDate).toLocaleDateString()}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {getStatusBadge(item.status)}
                      
                      {item.status === "overdue" && (
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-between gap-2 pt-4">
              <Button variant="outline">
                Add Custom Item
              </Button>
              <div>
                <Button variant="outline" className="mr-2">
                  Save Progress
                </Button>
                <Button>
                  Send Reminder
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

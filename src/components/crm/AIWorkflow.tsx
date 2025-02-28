
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, BarChart, Bell, CheckCircle2, Clock, ArrowRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { ClientSelector } from "@/components/activity/form/ClientSelector";
import { Client } from "@/components/activity/types";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export const AIWorkflow = () => {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [progressValue, setProgressValue] = useState(0);

  const handleClientSelect = (clientId: string) => {
    const client = {
      id: clientId,
      name: clientId === "f47ac10b-58cc-4372-a567-0e02b2c3d479" ? "John Doe" : "Reginald Dickerson",
      status: "active",
      last_activity: "2024-03-15",
    };
    setSelectedClient(client);
  };

  const workflowTasks = [
    { id: "doc-gen", name: "Document Generation", icon: <Brain />, description: "Automatically generate relevant documents based on client data and preferences" },
    { id: "client-follow", name: "Client Follow-up", icon: <Bell />, description: "Schedule and personalize follow-up communications with clients based on interaction history" },
    { id: "task-assign", name: "Task Assignment", icon: <Clock />, description: "Intelligently assign tasks to team members based on workload and expertise" }
  ];

  const handleWorkflowClick = (workflowId: string) => {
    setSelectedWorkflow(workflowId);
    setIsDialogOpen(true);
    setProgressValue(0);
  };

  const executeWorkflow = () => {
    setIsExecuting(true);
    
    // Simulate workflow execution with progress updates
    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      setProgressValue(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        setIsExecuting(false);
        
        setTimeout(() => {
          toast.success(`Workflow completed successfully!`);
          setIsDialogOpen(false);
        }, 500);
      }
    }, 700);
  };

  const getWorkflowTitle = () => {
    const workflow = workflowTasks.find(w => w.id === selectedWorkflow);
    return workflow ? workflow.name : "Workflow";
  };

  const getWorkflowDescription = () => {
    const workflow = workflowTasks.find(w => w.id === selectedWorkflow);
    return workflow ? workflow.description : "";
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Select Client</h2>
        <div className="max-w-md">
          <ClientSelector 
            selectedClient={selectedClient}
            onClientSelect={handleClientSelect}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>AI-Powered Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium">Document Analytics</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Client Engagement</span>
                    <span className="text-muted-foreground">85%</span>
                  </div>
                  <Progress value={85} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Response Time</span>
                    <span className="text-muted-foreground">92%</span>
                  </div>
                  <Progress value={92} />
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="font-medium">Automated Workflows</h4>
                <div className="space-y-2">
                  {workflowTasks.map((task) => (
                    <Card 
                      key={task.id} 
                      className="p-3 cursor-pointer hover:bg-accent transition-colors"
                      onClick={() => handleWorkflowClick(task.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="text-primary">{task.icon}</div>
                          <span className="text-sm font-medium">{task.name}</span>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Workflow Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{getWorkflowTitle()}</DialogTitle>
            <DialogDescription>
              {getWorkflowDescription()}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {isExecuting ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Executing workflow</span>
                  <span className="text-sm font-medium">{progressValue}%</span>
                </div>
                <Progress value={progressValue} className="h-2" />
                <div className="space-y-2 mt-4">
                  <div className="flex items-center gap-2 text-sm">
                    {progressValue >= 20 ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className={progressValue >= 20 ? "text-green-500" : "text-muted-foreground"}>
                      Fetching client data
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    {progressValue >= 40 ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className={progressValue >= 40 ? "text-green-500" : "text-muted-foreground"}>
                      Processing information
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    {progressValue >= 60 ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className={progressValue >= 60 ? "text-green-500" : "text-muted-foreground"}>
                      Applying AI insights
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    {progressValue >= 80 ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className={progressValue >= 80 ? "text-green-500" : "text-muted-foreground"}>
                      Finalizing workflow
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    {progressValue >= 100 ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className={progressValue >= 100 ? "text-green-500" : "text-muted-foreground"}>
                      Workflow complete
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm">
                  {selectedWorkflow === "doc-gen" && "This workflow will automatically generate relevant documents based on client data."}
                  {selectedWorkflow === "client-follow" && "This workflow will create a schedule of personalized follow-up communications."}
                  {selectedWorkflow === "task-assign" && "This workflow will assign tasks to team members based on their expertise and workload."}
                </p>
                
                <Card className="bg-muted p-3">
                  <div className="flex items-center gap-3">
                    <BarChart className="h-4 w-4 text-primary" />
                    <div>
                      <h4 className="text-sm font-medium">Expected Outcome</h4>
                      <p className="text-xs text-muted-foreground">
                        {selectedWorkflow === "doc-gen" && "3 documents will be generated and prepared for review"}
                        {selectedWorkflow === "client-follow" && "5 follow-up tasks will be created over the next 30 days"}
                        {selectedWorkflow === "task-assign" && "8 tasks will be assigned to team members"}
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </div>
          
          <div className="flex justify-end">
            {!isExecuting ? (
              <>
                <Button variant="outline" className="mr-2" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={executeWorkflow}
                  disabled={!selectedClient}
                >
                  {!selectedClient ? "Select a client first" : "Execute Workflow"}
                </Button>
              </>
            ) : (
              <Button variant="outline" disabled>
                Running...
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

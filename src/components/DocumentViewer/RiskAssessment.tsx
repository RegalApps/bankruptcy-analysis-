
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertTriangle, ChevronDown, ChevronRight, Shield, ShieldAlert, ShieldCheck, InfoIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Risk } from "./types";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

interface RiskAssessmentProps {
  risks: Risk[];
  documentId: string;
  isLoading?: boolean;
}

export const RiskAssessment = ({ 
  risks = [], 
  documentId,
  isLoading = false 
}: RiskAssessmentProps) => {
  const [expandedRisk, setExpandedRisk] = useState<string | null>(null);
  const [creatingTasks, setCreatingTasks] = useState<Record<string, boolean>>({});
  const { toast } = useToast();
  
  // Handle creating task
  const handleCreateTask = async (risk: Risk) => {
    try {
      setCreatingTasks(prev => ({ ...prev, [risk.description]: true }));
      
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        toast({
          title: "Authentication Error",
          description: "You must be logged in to create tasks",
          variant: "destructive"
        });
        return;
      }
      
      // Create a task in the tasks table
      const { data: task, error } = await supabase
        .from('tasks')
        .insert({
          document_id: documentId,
          title: risk.description,
          description: `${risk.impact}\n\nRequired Action: ${risk.requiredAction}\n\nSuggested Solution: ${risk.solution}`,
          created_by: userData.user.id,
          severity: risk.severity,
          regulation: risk.regulation || '',
          solution: risk.solution || '',
          status: 'pending',
          due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // Default 7 days
        })
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Task Created",
        description: "A new task has been created from this risk",
      });
      
      // Create notification
      await supabase.functions.invoke('handle-notifications', {
        body: {
          action: 'create',
          userId: userData.user.id,
          notification: {
            title: 'New Task Created',
            message: `Task created from risk: ${risk.description}`,
            type: 'task',
            priority: risk.severity === 'high' ? 'urgent' : 'normal',
            action_url: `/tasks/${task.id}`,
            metadata: {
              taskId: task.id,
              riskDescription: risk.description,
              riskSeverity: risk.severity,
              documentId
            }
          }
        }
      }).catch(e => console.error('Error creating notification:', e));
      
    } catch (error) {
      console.error('Error creating task:', error);
      toast({
        title: "Task Creation Failed",
        description: error instanceof Error ? error.message : "Failed to create task",
        variant: "destructive"
      });
    } finally {
      setCreatingTasks(prev => ({ ...prev, [risk.description]: false }));
    }
  };
  
  // If no risks or empty array
  if (!risks || risks.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <ShieldCheck className="h-5 w-5 text-green-500 mr-2" />
            Risk Assessment
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex flex-col space-y-2">
              <div className="h-6 w-full bg-gray-100 animate-pulse rounded"></div>
              <div className="h-6 w-3/4 bg-gray-100 animate-pulse rounded"></div>
            </div>
          ) : (
            <div className="flex items-center justify-center p-6 text-center">
              <div>
                <ShieldCheck className="h-12 w-12 text-green-500 mx-auto mb-2" />
                <h3 className="font-medium">No Risks Detected</h3>
                <p className="text-muted-foreground text-sm mt-1">
                  All document requirements have been met.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }
  
  // Group risks by severity
  const highRisks = risks.filter(risk => risk.severity === 'high');
  const mediumRisks = risks.filter(risk => risk.severity === 'medium');
  const lowRisks = risks.filter(risk => risk.severity === 'low');
  
  // Get risk icon based on severity
  const getRiskIcon = (severity: string) => {
    switch (severity) {
      case 'high':
        return <ShieldAlert className="h-5 w-5 text-red-500" />;
      case 'medium':
        return <Shield className="h-5 w-5 text-amber-500" />;
      case 'low':
        return <ShieldCheck className="h-5 w-5 text-blue-500" />;
      default:
        return <Shield className="h-5 w-5 text-gray-500" />;
    }
  };
  
  // Get risk badge styles based on severity
  const getRiskBadgeStyle = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      case 'medium':
        return 'bg-amber-100 text-amber-800 hover:bg-amber-200';
      case 'low':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
            Risk Assessment
          </div>
          <div className="flex items-center gap-2">
            {highRisks.length > 0 && (
              <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-200">
                {highRisks.length} High
              </Badge>
            )}
            {mediumRisks.length > 0 && (
              <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-200">
                {mediumRisks.length} Medium
              </Badge>
            )}
            {lowRisks.length > 0 && (
              <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                {lowRisks.length} Low
              </Badge>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">Severity</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {risks.map((risk, index) => (
              <Collapsible
                key={`${risk.description}-${index}`}
                open={expandedRisk === `${risk.description}-${index}`}
                onOpenChange={() => setExpandedRisk(expandedRisk === `${risk.description}-${index}` ? null : `${risk.description}-${index}`)}
              >
                <TableRow className="hover:bg-muted/50 cursor-pointer" onClick={() => setExpandedRisk(expandedRisk === `${risk.description}-${index}` ? null : `${risk.description}-${index}`)}>
                  <TableCell className="py-3">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Badge variant="outline" className={cn("py-1", getRiskBadgeStyle(risk.severity))}>
                            {risk.severity === 'high' ? 'High' : risk.severity === 'medium' ? 'Med' : 'Low'}
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{risk.severity.charAt(0).toUpperCase() + risk.severity.slice(1)} Risk</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                  <TableCell className="font-medium">
                    <CollapsibleTrigger asChild>
                      <div className="flex items-center gap-2">
                        {expandedRisk === `${risk.description}-${index}` ? (
                          <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                        )}
                        <span className="mr-4">
                          {risk.description}
                          
                          {risk.regulation && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="inline-block ml-2">
                                    <InfoIcon className="h-3.5 w-3.5 text-muted-foreground" />
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{risk.regulation}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </span>
                      </div>
                    </CollapsibleTrigger>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCreateTask(risk);
                      }}
                      disabled={creatingTasks[risk.description]}
                    >
                      {creatingTasks[risk.description] ? (
                        <>
                          <div className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent mr-1"></div>
                          Creating...
                        </>
                      ) : (
                        "Create Task"
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
                
                <CollapsibleContent>
                  <div className="px-4 py-3 bg-muted/30 rounded-md mb-2">
                    <dl className="grid grid-cols-[80px_1fr] gap-x-4 gap-y-2 text-sm">
                      {risk.impact && (
                        <>
                          <dt className="font-medium text-muted-foreground">Impact:</dt>
                          <dd>{risk.impact}</dd>
                        </>
                      )}
                      
                      {risk.requiredAction && (
                        <>
                          <dt className="font-medium text-muted-foreground">Required:</dt>
                          <dd>{risk.requiredAction}</dd>
                        </>
                      )}
                      
                      {risk.solution && (
                        <>
                          <dt className="font-medium text-muted-foreground">Solution:</dt>
                          <dd>{risk.solution}</dd>
                        </>
                      )}
                      
                      {risk.deadline && (
                        <>
                          <dt className="font-medium text-muted-foreground">Deadline:</dt>
                          <dd>{risk.deadline}</dd>
                        </>
                      )}
                      
                      {risk.type && (
                        <>
                          <dt className="font-medium text-muted-foreground">Type:</dt>
                          <dd>
                            <Badge variant="outline" className="bg-gray-100">
                              {risk.type}
                            </Badge>
                          </dd>
                        </>
                      )}
                    </dl>
                  </div>
                </CollapsibleContent>
                
                <Separator />
              </Collapsible>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

import React, { useState } from 'react';
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
  
  // Handle creating task - now uses local storage instead of Supabase
  const handleCreateTask = async (risk: Risk) => {
    try {
      setCreatingTasks(prev => ({ ...prev, [risk.description]: true }));
      
      // Generate a unique ID for the task
      const taskId = `task-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      
      // Get existing tasks from localStorage
      const tasksJson = localStorage.getItem('local_tasks') || '{}';
      const allTasks = JSON.parse(tasksJson);
      
      // Create a new task
      const newTask = {
        id: taskId,
        document_id: documentId,
        title: risk.description,
        description: `${risk.impact}\n\nRequired Action: ${risk.requiredAction}\n\nSuggested Solution: ${risk.solution}`,
        created_by: localStorage.getItem('current_user_id') || 'anonymous',
        severity: risk.severity,
        regulation: risk.regulation || '',
        solution: risk.solution || '',
        status: 'pending',
        due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // Default 7 days
      };
      
      // Add the task to the document's tasks
      if (!allTasks[documentId]) {
        allTasks[documentId] = [];
      }
      
      allTasks[documentId].push(newTask);
      
      // Save back to localStorage
      localStorage.setItem('local_tasks', JSON.stringify(allTasks));
      
      toast({
        title: "Task Created",
        description: "A new task has been created from this risk",
      });
      
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
              <div className="h-6 w-full bg-muted animate-pulse rounded"></div>
              <div className="h-6 w-3/4 bg-muted animate-pulse rounded"></div>
              <div className="h-6 w-5/6 bg-muted animate-pulse rounded"></div>
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              <ShieldCheck className="h-12 w-12 mx-auto mb-3 text-green-500" />
              <p>No risks detected in this document.</p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }
  
  // Get risk icon based on severity
  const getRiskIcon = (severity: string) => {
    switch (severity) {
      case 'high':
        return <ShieldAlert className="h-4 w-4 text-red-500" />;
      case 'medium':
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case 'low':
        return <Shield className="h-4 w-4 text-green-500" />;
      default:
        return <Shield className="h-4 w-4 text-muted-foreground" />;
    }
  };
  
  // Get risk badge styles based on severity
  const getRiskBadgeStyle = (severity: string) => {
    switch (severity) {
      case 'high':
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      case 'medium':
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300";
      case 'low':
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };
  
  // Count risks by severity
  const highRisks = risks.filter(r => r.severity === 'high').length;
  const mediumRisks = risks.filter(r => r.severity === 'medium').length;
  const lowRisks = risks.filter(r => r.severity === 'low').length;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <ShieldAlert className="h-5 w-5 text-red-500 mr-2" />
          Risk Assessment
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2 flex-wrap">
          {highRisks > 0 && (
            <Badge variant="outline" className={cn("font-normal", getRiskBadgeStyle('high'))}>
              {highRisks} High Risk{highRisks !== 1 && 's'}
            </Badge>
          )}
          {mediumRisks > 0 && (
            <Badge variant="outline" className={cn("font-normal", getRiskBadgeStyle('medium'))}>
              {mediumRisks} Medium Risk{mediumRisks !== 1 && 's'}
            </Badge>
          )}
          {lowRisks > 0 && (
            <Badge variant="outline" className={cn("font-normal", getRiskBadgeStyle('low'))}>
              {lowRisks} Low Risk{lowRisks !== 1 && 's'}
            </Badge>
          )}
        </div>
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Risk</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {risks.map((risk, index) => {
                // Create a stable, unique key for each risk
                const riskKey = `risk-${index}-${risk.severity}-${risk.description ? risk.description.substring(0, 10) : 'unknown'}`;
                
                return (
                  <div key={riskKey} className="risk-item">
                    <TableRow>
                      <TableCell>
                        <Collapsible
                          open={expandedRisk === risk.description}
                          onOpenChange={() => {
                            setExpandedRisk(expandedRisk === risk.description ? null : risk.description);
                          }}
                          className="w-full"
                        >
                          <CollapsibleTrigger className="flex items-center w-full text-left">
                            <div className="flex items-center">
                              {getRiskIcon(risk.severity)}
                              <span className="mx-2">
                                <Badge variant="outline" className={cn("font-normal", getRiskBadgeStyle(risk.severity))}>
                                  {risk.severity}
                                </Badge>
                              </span>
                              {expandedRisk === risk.description ? (
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
                        </Collapsible>
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
                    {expandedRisk === risk.description && (
                      <TableRow>
                        <TableCell colSpan={2} className="p-0">
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
                        </TableCell>
                      </TableRow>
                    )}
                  </div>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

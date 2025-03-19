
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  AlertCircle, CheckCircle, Clock, FileCheck, 
  FileText, ListChecks, Package, PackageCheck 
} from "lucide-react";
import { ClientInsightData } from "../../activity/hooks/predictiveData/types";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface CaseProgressCardProps {
  insights: ClientInsightData;
}

export const CaseProgressCard = ({ insights }: CaseProgressCardProps) => {
  const { caseProgress, pendingTasks, missingDocuments } = insights;
  
  const getProgressStatus = (progress: number) => {
    if (progress < 25) return 'initial';
    if (progress < 50) return 'early';
    if (progress < 75) return 'mid';
    if (progress < 100) return 'late';
    return 'complete';
  };

  const getProgressStatusColor = (progress: number) => {
    if (progress < 25) return 'text-slate-500 bg-slate-100';
    if (progress < 50) return 'text-blue-500 bg-blue-100';
    if (progress < 75) return 'text-amber-500 bg-amber-100';
    if (progress < 100) return 'text-purple-500 bg-purple-100';
    return 'text-green-500 bg-green-100';
  };
  
  const getProgressIcon = (progress: number) => {
    if (progress < 25) return <Clock className="h-4 w-4 mr-1" />;
    if (progress < 50) return <ListChecks className="h-4 w-4 mr-1" />;
    if (progress < 75) return <Package className="h-4 w-4 mr-1" />;
    if (progress < 100) return <AlertCircle className="h-4 w-4 mr-1" />;
    return <PackageCheck className="h-4 w-4 mr-1" />;
  };
  
  const getProgressExplanation = (progress: number) => {
    if (progress < 25) {
      return "Case is in the initial stages. Key documents are being collected and initial assessment is underway. Client has recently engaged with the process.";
    } else if (progress < 50) {
      return "Case is in early development. Basic documentation has been collected, but several key items are still pending. Initial assessments have been completed and a preliminary plan is being formed.";
    } else if (progress < 75) {
      return "Case is in mid-stage processing. Most required documentation has been received and verified. Action plans have been established and implementation is in progress.";
    } else if (progress < 100) {
      return "Case is in late-stage processing. All critical documentation has been received and processed. Final reviews are being conducted before completion.";
    } else {
      return "Case has been completed successfully. All required documentation has been processed, all tasks completed, and all necessary actions taken.";
    }
  };
  
  const getPendingTasksDescription = (tasks: number) => {
    if (tasks === 0) return "All tasks have been completed for this case.";
    if (tasks < 3) return "Only a few final tasks remain to complete this case.";
    if (tasks < 6) return "Several important tasks still need to be addressed to move this case forward.";
    return "A significant number of tasks require attention to progress this case.";
  };
  
  const getMissingDocumentsDescription = (docs: number) => {
    if (docs === 0) return "All required documents have been received and processed.";
    if (docs < 3) return "A few important documents are still needed to complete the file.";
    if (docs < 5) return "Several key documents have not yet been received, which may delay case processing.";
    return "Many critical documents are missing, which is significantly impacting case progression.";
  };

  const progressStatus = getProgressStatus(caseProgress);
  const progressStatusDisplay = {
    'initial': 'Initial Stage',
    'early': 'Early Processing',
    'mid': 'Mid Processing',
    'late': 'Final Review',
    'complete': 'Complete'
  }[progressStatus];
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <FileCheck className="h-5 w-5 text-primary" />
          Case Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Overall Progress</span>
              <div className={`flex items-center px-2 py-0.5 rounded text-xs font-medium ${getProgressStatusColor(caseProgress)}`}>
                {getProgressIcon(caseProgress)}
                {progressStatusDisplay}
              </div>
            </div>
            <span className="text-sm font-bold">{caseProgress}%</span>
          </div>
          <Progress value={caseProgress} className="h-2" />
        </div>
        
        <Collapsible className="w-full space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">Progress Details</h4>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="p-0 h-8 w-8">
                <AlertCircle className="h-4 w-4" />
                <span className="sr-only">Toggle explanation</span>
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent className="space-y-2">
            <div className="rounded-md bg-muted p-3">
              <p className="text-sm">{getProgressExplanation(caseProgress)}</p>
              
              <div className="mt-3 space-y-2">
                <h5 className="text-xs font-semibold">Key milestones:</h5>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className={`h-3 w-3 ${caseProgress >= 25 ? 'text-green-500' : 'text-gray-300'}`} />
                    <span className="text-xs">Initial documentation (25%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className={`h-3 w-3 ${caseProgress >= 50 ? 'text-green-500' : 'text-gray-300'}`} />
                    <span className="text-xs">Assessment completion (50%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className={`h-3 w-3 ${caseProgress >= 75 ? 'text-green-500' : 'text-gray-300'}`} />
                    <span className="text-xs">Plan implementation (75%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className={`h-3 w-3 ${caseProgress >= 100 ? 'text-green-500' : 'text-gray-300'}`} />
                    <span className="text-xs">Case completion (100%)</span>
                  </div>
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
        
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="rounded-md border p-3 space-y-3">
            <div className="flex items-center gap-3">
              <div className="bg-amber-100 p-2 rounded-full">
                <Clock className="h-4 w-4 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-medium">{pendingTasks}</p>
                <p className="text-xs text-muted-foreground">Pending Tasks</p>
              </div>
            </div>
            
            <Collapsible className="w-full">
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="w-full h-6 text-xs justify-start px-0 text-muted-foreground hover:text-foreground">
                  View details
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-2">
                <p className="text-xs text-muted-foreground">
                  {getPendingTasksDescription(pendingTasks)}
                </p>
                {pendingTasks > 0 && (
                  <div className="mt-2 space-y-1">
                    <div className="flex items-start gap-1">
                      <FileText className="h-3 w-3 mt-0.5 text-amber-500" />
                      <span className="text-xs">Priority task{pendingTasks > 1 ? 's' : ''} requiring attention</span>
                    </div>
                    <Badge variant="outline" className="text-xs mt-1">
                      {pendingTasks > 5 ? 'High Priority' : pendingTasks > 2 ? 'Medium Priority' : 'Low Priority'}
                    </Badge>
                  </div>
                )}
              </CollapsibleContent>
            </Collapsible>
          </div>
          
          <div className="rounded-md border p-3 space-y-3">
            <div className="flex items-center gap-3">
              <div className="bg-red-100 p-2 rounded-full">
                <FileText className="h-4 w-4 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium">{missingDocuments}</p>
                <p className="text-xs text-muted-foreground">Missing Documents</p>
              </div>
            </div>
            
            <Collapsible className="w-full">
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="w-full h-6 text-xs justify-start px-0 text-muted-foreground hover:text-foreground">
                  View details
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-2">
                <p className="text-xs text-muted-foreground">
                  {getMissingDocumentsDescription(missingDocuments)}
                </p>
                {missingDocuments > 0 && (
                  <div className="mt-2 space-y-1">
                    <div className="flex items-start gap-1">
                      <FileText className="h-3 w-3 mt-0.5 text-red-500" />
                      <span className="text-xs">Document collection needed to proceed</span>
                    </div>
                    <Badge variant="outline" className="text-xs mt-1">
                      {missingDocuments > 3 ? 'Critical' : 'Important'}
                    </Badge>
                  </div>
                )}
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>
        
        <div className="pt-2 border-t">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">Next Steps</h4>
            <Badge variant="outline" className="text-xs">
              {pendingTasks + missingDocuments === 0 ? 'None Required' : 'Action Needed'}
            </Badge>
          </div>
          {(pendingTasks > 0 || missingDocuments > 0) && (
            <ul className="mt-2 space-y-1">
              {missingDocuments > 0 && (
                <li className="text-xs flex items-start gap-1">
                  <FileText className="h-3 w-3 mt-0.5 text-red-500" />
                  <span>Request missing documentation from client</span>
                </li>
              )}
              {pendingTasks > 0 && (
                <li className="text-xs flex items-start gap-1">
                  <FileText className="h-3 w-3 mt-0.5 text-amber-500" />
                  <span>Schedule task review meeting</span>
                </li>
              )}
              {(pendingTasks > 2 || missingDocuments > 2) && (
                <li className="text-xs flex items-start gap-1">
                  <FileText className="h-3 w-3 mt-0.5 text-blue-500" />
                  <span>Update case timeline with client</span>
                </li>
              )}
            </ul>
          )}
        </div>
      </CardContent>
    </Card>
  );
};


import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { MoreHorizontal, Clock, CalendarClock, ChevronDown, ChevronUp } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface Task {
  taskID: string;
  sourceReference: string;
  taskTitle: string;
  taskDescription: string;
  taskType: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'open' | 'in_progress' | 'complete' | 'overdue';
  dueDate?: string;
  daysRemaining?: number;
  assignedTo?: {
    userRole?: string;
    userId?: string;
    userName?: string;
  };
  documentReferences?: Array<{
    documentID: string;
    documentName: string;
    page?: number;
    fieldID?: string;
  }>;
  actionRequired?: {
    actionType: string;
    actionInstructions: string;
  };
}

interface DocumentTasksProps {
  tasks: Task[];
  onTaskUpdate?: (taskId: string, updates: Partial<Task>) => void;
  onAssignTask?: (taskId: string, userId: string) => void;
}

export function DocumentTasks({ tasks, onTaskUpdate, onAssignTask }: DocumentTasksProps) {
  const [expandedTask, setExpandedTask] = React.useState<string | null>(null);
  
  if (!tasks || tasks.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Document Tasks</CardTitle>
          <CardDescription>Tasks generated from document analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="rounded-full bg-gray-100 p-3 mb-4">
              <Clock className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium mb-1">No Tasks</h3>
            <p className="text-sm text-gray-500 max-w-sm">
              No tasks have been generated for this document. Tasks are created when issues are identified in the document analysis.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Document Tasks</CardTitle>
          <CardDescription>Tasks generated from document analysis</CardDescription>
        </div>
        <Button variant="outline" size="sm">
          Create Task
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {tasks.map((task) => (
            <TaskItem 
              key={task.taskID}
              task={task}
              isExpanded={expandedTask === task.taskID}
              onToggleExpand={() => {
                setExpandedTask(expandedTask === task.taskID ? null : task.taskID);
              }}
              onTaskUpdate={onTaskUpdate}
              onAssignTask={onAssignTask}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

interface TaskItemProps {
  task: Task;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onTaskUpdate?: (taskId: string, updates: Partial<Task>) => void;
  onAssignTask?: (taskId: string, userId: string) => void;
}

function TaskItem({ task, isExpanded, onToggleExpand, onTaskUpdate, onAssignTask }: TaskItemProps) {
  const handleStatusChange = (checked: boolean) => {
    if (onTaskUpdate) {
      onTaskUpdate(task.taskID, {
        status: checked ? 'complete' : 'open'
      });
    }
  };
  
  return (
    <Collapsible
      open={isExpanded}
      onOpenChange={onToggleExpand}
      className="border rounded-md overflow-hidden"
    >
      <div className="flex items-center p-4 gap-3">
        <Checkbox 
          id={`task-${task.taskID}`}
          checked={task.status === 'complete'}
          onCheckedChange={handleStatusChange}
        />
        
        <div className="flex-grow">
          <div className="flex justify-between items-start">
            <div>
              <h4 className={`font-medium ${task.status === 'complete' ? 'line-through text-gray-500' : ''}`}>
                {task.taskTitle}
              </h4>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <Badge variant="outline" className={getSeverityColor(task.severity)}>
                  {task.severity}
                </Badge>
                
                {task.dueDate && (
                  <span className="text-xs text-gray-500 flex items-center">
                    <CalendarClock className="h-3 w-3 mr-1" />
                    {formatDate(task.dueDate)}
                    {task.daysRemaining !== undefined && (
                      <span className={`ml-1 ${task.daysRemaining < 0 ? 'text-red-500' : task.daysRemaining <= 1 ? 'text-orange-500' : ''}`}>
                        ({task.daysRemaining < 0 ? 'Overdue' : `${task.daysRemaining} day${task.daysRemaining !== 1 ? 's' : ''} left`})
                      </span>
                    )}
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex items-center">
              {task.assignedTo?.userRole && (
                <AssigneeAvatar role={task.assignedTo.userRole} name={task.assignedTo.userName} />
              )}
              
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">More</span>
              </Button>
              
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
            </div>
          </div>
        </div>
      </div>
      
      <CollapsibleContent>
        <div className="px-4 pb-4 pt-0 border-t space-y-4 mt-1">
          <div>
            <h5 className="text-sm font-medium text-gray-700">Description</h5>
            <p className="text-sm mt-1">{task.taskDescription}</p>
          </div>
          
          {task.actionRequired && (
            <div>
              <h5 className="text-sm font-medium text-gray-700">Required Action</h5>
              <p className="text-sm mt-1">{task.actionRequired.actionInstructions}</p>
            </div>
          )}
          
          {task.documentReferences && task.documentReferences.length > 0 && (
            <div>
              <h5 className="text-sm font-medium text-gray-700">Related Document</h5>
              <div className="text-sm mt-1">
                {task.documentReferences.map((ref) => (
                  <div key={ref.documentID} className="flex items-center">
                    <span>{ref.documentName}</span>
                    {ref.page && <span className="ml-2 text-gray-500">(Page {ref.page})</span>}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm">Reassign</Button>
            <Button size="sm">Complete Task</Button>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

function AssigneeAvatar({ role, name }: { role: string; name?: string }) {
  const displayName = name || formatRole(role);
  const initials = getInitials(displayName);
  
  return (
    <Avatar className="h-6 w-6">
      <AvatarFallback className="text-xs bg-primary-foreground text-primary">
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}

// Helper functions
function getSeverityColor(severity: string): string {
  switch (severity) {
    case 'critical':
      return 'bg-red-100 text-red-800 hover:bg-red-200 border-red-200';
    case 'high':
      return 'bg-orange-100 text-orange-800 hover:bg-orange-200 border-orange-200';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-200';
    case 'low':
      return 'bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200';
    default:
      return '';
  }
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  });
}

function formatRole(role: string): string {
  return role
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2);
}


import { Client, Document } from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClientTabContent } from "./viewer/ClientTabContent";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { format } from "date-fns";
import { Calendar, CheckCircle, ClipboardList, Clock } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface ClientSummaryPanelProps {
  client: Client;
  documentCount: number;
  lastActivityDate?: string;
  documents: Document[];
}

export const ClientSummaryPanel = ({ 
  client, 
  documentCount, 
  lastActivityDate,
  documents
}: ClientSummaryPanelProps) => {
  const [activeTab, setActiveTab] = useState("info");
  
  return (
    <div className="h-full flex flex-col">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <div className="px-4 pt-4">
          <TabsList className="w-full">
            <TabsTrigger value="info" className="flex-1">
              Client Info
            </TabsTrigger>
            <TabsTrigger value="tasks" className="flex-1">
              Tasks
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="info" className="flex-1 mt-0">
          <ClientTabContent 
            client={client} 
            documents={documents}
            lastActivityDate={lastActivityDate}
          />
        </TabsContent>
        
        <TabsContent value="tasks" className="flex-1 mt-0">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <ClipboardList className="h-5 w-5 mr-2" />
                    Client Tasks
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {[
                    { 
                      id: '1', 
                      title: 'Review financial statements',
                      dueDate: new Date().setDate(new Date().getDate() + 3),
                      status: 'pending'
                    },
                    {
                      id: '2',
                      title: 'Schedule follow-up meeting',
                      dueDate: new Date().setDate(new Date().getDate() + 7),
                      status: 'pending'
                    },
                    {
                      id: '3',
                      title: 'Complete Form 47 processing',
                      dueDate: new Date().setDate(new Date().getDate() - 1),
                      status: 'overdue'
                    },
                    {
                      id: '4',
                      title: 'Update client contact information',
                      dueDate: new Date().setDate(new Date().getDate() - 5),
                      status: 'completed'
                    }
                  ].map(task => (
                    <div 
                      key={task.id} 
                      className="p-3 border rounded-md mb-3 last:mb-0 flex items-start justify-between"
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-full ${
                          task.status === 'completed' ? 'bg-green-100 text-green-700' : 
                          task.status === 'overdue' ? 'bg-red-100 text-red-700' : 
                          'bg-amber-100 text-amber-700'
                        }`}>
                          {task.status === 'completed' ? 
                            <CheckCircle className="h-4 w-4" /> :
                            <Clock className="h-4 w-4" />
                          }
                        </div>
                        <div>
                          <p className={`font-medium ${
                            task.status === 'completed' ? 'line-through text-muted-foreground' : ''
                          }`}>
                            {task.title}
                          </p>
                          <div className="flex items-center text-xs text-muted-foreground mt-1">
                            <Calendar className="h-3 w-3 mr-1" />
                            <span>
                              Due: {format(new Date(task.dueDate), 'MMM d, yyyy')}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Badge variant={
                        task.status === 'completed' ? 'outline' : 
                        task.status === 'overdue' ? 'destructive' : 
                        'default'
                      }>
                        {task.status === 'completed' ? 'Done' : 
                         task.status === 'overdue' ? 'Overdue' : 
                         'Pending'}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};

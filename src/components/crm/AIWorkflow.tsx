import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowUpDown, Brain, MessageSquare, Mic } from "lucide-react";
import { ClientConnect } from "../../pages/SAFA/components/ClientConnect";
import { AICommunication } from "../../pages/SAFA/components/ClientConnect/AICommunication";

export const AIWorkflow = () => {
  const [activeTab, setActiveTab] = useState("communication");
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <MessageSquare className="h-4 w-4 mr-2 text-primary" />
              Active Conversations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">7 require your attention</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Brain className="h-4 w-4 mr-2 text-primary" />
              AI-Generated Content
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">58</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Mic className="h-4 w-4 mr-2 text-primary" />
              Transcribed Calls
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>
      </div>
      
      <Card className="pt-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="px-6">
            <TabsList className="grid grid-cols-2 w-[400px]">
              <TabsTrigger value="communication">AI Communication</TabsTrigger>
              <TabsTrigger value="assistant">Client Assistant</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="communication" className="p-6 pt-8">
            <AICommunication />
          </TabsContent>
          
          <TabsContent value="assistant" className="pt-2">
            <div className="h-[600px]">
              <ClientConnect />
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

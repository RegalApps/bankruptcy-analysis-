
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClientAssistantPanel } from "./ClientAssistantPanel";
import { ClientConversation } from "./ClientConversation";
import { ClientOverview } from "./ClientOverview";

export const ClientConnect = () => {
  const [activeTab, setActiveTab] = useState<"overview" | "conversation" | "history">("overview");
  
  const handleStartConversation = () => {
    setActiveTab("conversation");
  };

  const handleViewHistory = () => {
    setActiveTab("history");
  };
  
  return (
    <div className="h-full flex flex-col">
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="flex-1 flex flex-col">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Clients</TabsTrigger>
          <TabsTrigger value="conversation">AI Assistant</TabsTrigger>
          <TabsTrigger value="history">Message History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-0 flex-1">
          {activeTab === "overview" && (
            <ClientAssistantPanel 
              onStartConversation={handleStartConversation}
              onViewHistory={handleViewHistory}
            />
          )}
        </TabsContent>
        
        <TabsContent value="conversation" className="mt-0 flex-1">
          {activeTab === "conversation" && <ClientConversation 
            messages={[]}
            inputMessage=""
            setInputMessage={() => {}}
            handleSendMessage={() => {}}
            handleKeyPress={() => {}}
            isProcessing={false}
          />}
        </TabsContent>
        
        <TabsContent value="history" className="mt-0 flex-1">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Conversation History</h2>
            <p className="text-muted-foreground">
              View past conversations with clients and AI suggestions.
            </p>
            {/* History will be implemented in the next phase */}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

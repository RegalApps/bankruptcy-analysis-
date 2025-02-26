import { FileUpload } from "@/components/FileUpload";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Scale, BookOpen, Search, Upload, Users, MessageSquare, UploadCloud } from "lucide-react";
import { useState } from "react";
import { useConversations } from "../../SAFA/hooks/useConversations";
import { ClientConversation } from "./ClientConnect/ClientConversation";
import { ModuleCard } from "./ModuleContent/ModuleCard";

interface SidebarProps {
  activeModule: 'document' | 'legal' | 'help' | 'client';
  setActiveModule: (module: 'document' | 'legal' | 'help' | 'client') => void;
  onUploadComplete: (documentId: string) => Promise<void>;
}

export const Sidebar = ({ activeModule, setActiveModule, onUploadComplete }: SidebarProps) => {
  const { categoryMessages, handleSendMessage, isProcessing } = useConversations(activeModule);
  const [showConversation, setShowConversation] = useState(false);
  const [inputMessage, setInputMessage] = useState("");

  const handleStartConsultation = async () => {
    setActiveModule('client');
    setShowConversation(true);
    await handleSendMessage("Hello, I'd like to start a consultation.");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputMessage);
      setInputMessage("");
    }
  };

  const handleMessageSend = () => {
    handleSendMessage(inputMessage);
    setInputMessage("");
  };

  const renderModuleContent = () => {
    switch (activeModule) {
      case 'document':
        return (
          <div className="flex-1">
            <div className="h-full p-6">
              <Card className="h-full">
                <CardHeader className="border-b bg-muted/30">
                  <div className="flex items-center gap-2">
                    <FileText className="h-6 w-6 text-primary" />
                    <CardTitle>Document Analysis</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div className="text-center space-y-2">
                      <h3 className="font-medium">Upload Document for Analysis</h3>
                      <p className="text-sm text-muted-foreground">
                        Support for PDF, DOC, DOCX formats up to 10MB
                      </p>
                    </div>
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 transition-colors hover:border-primary/50">
                      <div className="flex flex-col items-center justify-center gap-4">
                        <div className="rounded-full bg-primary/10 p-4">
                          <UploadCloud className="h-8 w-8 text-primary" />
                        </div>
                        <div className="text-center space-y-2">
                          <FileUpload onUploadComplete={onUploadComplete} />
                          <p className="text-xs text-muted-foreground">
                            Your document will be analyzed for key information and risk factors
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      case 'legal':
        return (
          <div className="flex-1">
            <div className="h-full p-6">
              <div className="flex flex-col h-full bg-background rounded-lg border">
                <div className="flex items-center gap-2 p-4 border-b">
                  <Scale className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-semibold">Legal & Regulatory</h2>
                </div>
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {categoryMessages.legal.map((message) => (
                    <div
                      key={message.id}
                      className={`${
                        message.type === 'assistant' ? 'bg-muted/30' : 'bg-primary/5'
                      } p-4 rounded-lg`}
                    >
                      <p className="text-base">{message.content}</p>
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t">
                  <div className="flex items-center gap-3">
                    <Input
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder="Ask about legal & regulatory matters..."
                      className="flex-1"
                    />
                    <Button 
                      size="icon"
                      onClick={handleMessageSend}
                      disabled={isProcessing}
                    >
                      <MessageSquare className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'help':
        return (
          <div className="flex-1">
            <div className="h-full p-6">
              <div className="flex flex-col h-full bg-background rounded-lg border">
                <div className="flex items-center gap-2 p-4 border-b">
                  <BookOpen className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-semibold">Training & Help</h2>
                </div>
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {categoryMessages.help.map((message) => (
                    <div
                      key={message.id}
                      className={`${
                        message.type === 'assistant' ? 'bg-muted/30' : 'bg-primary/5'
                      } p-4 rounded-lg`}
                    >
                      <p className="text-base">{message.content}</p>
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t">
                  <div className="flex items-center gap-3">
                    <Input
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder="Ask for help or guidance..."
                      className="flex-1"
                    />
                    <Button 
                      size="icon"
                      onClick={handleMessageSend}
                      disabled={isProcessing}
                    >
                      <MessageSquare className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'client':
        return showConversation && (
          <ClientConversation
            messages={categoryMessages.client}
            inputMessage={inputMessage}
            setInputMessage={setInputMessage}
            handleSendMessage={handleMessageSend}
            handleKeyPress={handleKeyPress}
            isProcessing={isProcessing}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-full">
      <aside className="w-64 border-r bg-muted/30 overflow-y-auto h-full">
        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Categories</h2>
            <Tabs value={activeModule} onValueChange={(value: any) => setActiveModule(value)} className="w-full">
              <TabsList className="grid w-full grid-cols-1 h-auto">
                <TabsTrigger value="document" className="w-full justify-start">
                  <FileText className="mr-2 h-4 w-4" />
                  Document Analysis
                </TabsTrigger>
                <TabsTrigger value="legal" className="w-full justify-start">
                  <Scale className="mr-2 h-4 w-4" />
                  Legal & Regulatory
                </TabsTrigger>
                <TabsTrigger value="client" className="w-full justify-start">
                  <Users className="mr-2 h-4 w-4" />
                  Client Connect
                </TabsTrigger>
                <TabsTrigger value="help" className="w-full justify-start">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Training & Help
                </TabsTrigger>
              </TabsList>

              <TabsContent value="document" className="mt-4">
                <ModuleCard
                  icon={FileText}
                  title="Document Analysis Tool"
                  description="Upload documents for comprehensive analysis including client details, risk assessment, and detailed solutions with references to Canadian insolvency regulations."
                  actions={<FileUpload onUploadComplete={onUploadComplete} />}
                />
              </TabsContent>

              <TabsContent value="legal" className="mt-4">
                <ModuleCard
                  icon={Scale}
                  title="Legal Advisory"
                  description="Ask questions about Canadian insolvency laws, BIA regulations, OSB guidelines, and receive expert guidance based on current legal framework."
                  actions={
                    <Button variant="outline" size="sm" className="w-full">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Start Legal Consultation
                    </Button>
                  }
                />
              </TabsContent>

              <TabsContent value="client" className="mt-4">
                <ModuleCard
                  icon={Users}
                  title="AI Client Assistant"
                  description="Enhanced multimodal chatbot with voice, text, and sentiment analysis capabilities. Seamlessly integrates with CRM for real-time client updates and engagement tracking."
                  actions={
                    !showConversation && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={handleStartConsultation}
                        disabled={isProcessing}
                      >
                        <MessageSquare className="mr-2 h-4 w-4" />
                        {isProcessing ? "Starting..." : "Start Consultation"}
                      </Button>
                    )
                  }
                />
              </TabsContent>

              <TabsContent value="help" className="mt-4">
                <ModuleCard
                  icon={BookOpen}
                  title="Training & Support"
                  description="Access application guidance, contribute training data, and help improve the AI's understanding of Canadian insolvency practices."
                  actions={
                    <div className="space-y-2">
                      <Button variant="outline" size="sm" className="w-full">
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Training Data
                      </Button>
                      <Button variant="ghost" size="sm" className="w-full">
                        View Documentation
                      </Button>
                    </div>
                  }
                />
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Recent Conversations</h2>
            <div className="relative">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input className="pl-8" placeholder="Search conversations..." />
            </div>
          </div>
        </div>
      </aside>

      {renderModuleContent()}
    </div>
  );
};

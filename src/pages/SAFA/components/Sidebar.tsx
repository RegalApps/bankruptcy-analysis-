
import { FileUpload } from "@/components/FileUpload";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { FileText, Scale, BookOpen, Search, Upload, Users, Brain, MessageSquare, ScrollText, AlertCircle } from "lucide-react";

interface SidebarProps {
  activeModule: 'document' | 'legal' | 'help' | 'client';
  setActiveModule: (module: 'document' | 'legal' | 'help' | 'client') => void;
  onUploadComplete: (documentId: string) => Promise<void>;
}

export const Sidebar = ({ activeModule, setActiveModule, onUploadComplete }: SidebarProps) => {
  return (
    <aside className="w-64 border-r bg-muted/30 overflow-y-auto">
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
              <Card className="p-4">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <ScrollText className="h-5 w-5 text-primary" />
                    <span className="font-medium">Document Analysis Tool</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Upload documents for comprehensive analysis including client details, risk assessment, and detailed solutions with references to Canadian insolvency regulations.
                  </p>
                  <FileUpload onUploadComplete={onUploadComplete} />
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="legal" className="mt-4">
              <Card className="p-4">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-primary" />
                    <span className="font-medium">Legal Advisory</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Ask questions about Canadian insolvency laws, BIA regulations, OSB guidelines, and receive expert guidance based on current legal framework.
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Start Legal Consultation
                  </Button>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="client" className="mt-4">
              <Card className="p-4">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-primary" />
                    <span className="font-medium">AI Client Assistant</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Enhanced multimodal chatbot with voice, text, and sentiment analysis capabilities. Seamlessly integrates with CRM for real-time client updates and engagement tracking.
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Start Consultation
                  </Button>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="help" className="mt-4">
              <Card className="p-4">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    <span className="font-medium">Training & Support</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Access application guidance, contribute training data, and help improve the AI's understanding of Canadian insolvency practices.
                  </p>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full">
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Training Data
                    </Button>
                    <Button variant="ghost" size="sm" className="w-full">
                      View Documentation
                    </Button>
                  </div>
                </div>
              </Card>
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
  );
};

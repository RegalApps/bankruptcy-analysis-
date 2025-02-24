
import { MainHeader } from "@/components/header/MainHeader";
import { MainSidebar } from "@/components/layout/MainSidebar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  FileText, 
  MessageCircle, 
  Search, 
  Send,
  BookOpen,
  Scale,
  HelpCircle,
  Filter
} from "lucide-react";

export const ConBrandingPage = () => {
  return (
    <div>
      <MainSidebar />
      <div className="pl-16">
        <MainHeader />
        <div className="flex h-[calc(100vh-64px)]">
          {/* Sidebar Navigation */}
          <aside className="w-64 border-r bg-muted/30 p-4 space-y-4">
            <div className="space-y-2">
              <h2 className="text-lg font-semibold">Categories</h2>
              <div className="space-y-1">
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  <FileText className="mr-2 h-4 w-4" />
                  Document Analysis
                </Button>
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  <Scale className="mr-2 h-4 w-4" />
                  Legal & Regulatory
                </Button>
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Training & Help
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-lg font-semibold">Recent Conversations</h2>
              <div className="relative">
                <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input className="pl-8" placeholder="Search conversations..." />
              </div>
            </div>
          </aside>

          {/* Main Chat Area */}
          <main className="flex-1 flex flex-col">
            <div className="flex-1 p-4">
              <ScrollArea className="h-full">
                <div className="space-y-4">
                  <Card className="p-4 bg-muted/30">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <MessageCircle className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Welcome to Secure Files AI Assistant. I can help you with document management,
                          OSB regulations, BIA acts, and more. How can I assist you today?
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>
              </ScrollArea>
            </div>

            {/* Input Area */}
            <div className="border-t p-4">
              <div className="flex gap-2">
                <Input 
                  placeholder="Ask about document management, OSB, BIA acts, and more..." 
                  className="flex-1"
                />
                <Button size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <div className="mt-2 flex gap-2">
                <Button variant="outline" size="sm">
                  <HelpCircle className="mr-2 h-4 w-4" />
                  Help Topics
                </Button>
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  Filters
                </Button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

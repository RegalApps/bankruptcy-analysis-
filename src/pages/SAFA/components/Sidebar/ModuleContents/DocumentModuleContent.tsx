
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FileText, MessageSquare, UploadCloud } from "lucide-react";
import { FileUpload } from "@/components/FileUpload";
import { ChatMessage } from "../../../types";

interface DocumentModuleContentProps {
  messages: ChatMessage[];
  inputMessage: string;
  setInputMessage: (message: string) => void;
  handleKeyPress: (e: React.KeyboardEvent) => void;
  handleMessageSend: () => void;
  isProcessing: boolean;
  onUploadComplete: (documentId: string) => Promise<void>;
}

export const DocumentModuleContent = ({
  messages,
  inputMessage,
  setInputMessage,
  handleKeyPress,
  handleMessageSend,
  isProcessing,
  onUploadComplete
}: DocumentModuleContentProps) => {
  return (
    <div className="flex-1">
      <div className="h-full p-6">
        <Card className="h-full flex flex-col">
          <CardHeader className="border-b bg-muted/30">
            <div className="flex items-center gap-2">
              <FileText className="h-6 w-6 text-primary" />
              <CardTitle>Document Analysis</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6 flex-1 overflow-y-auto">
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
              <div className="space-y-4">
                {messages.map((message) => (
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
            </div>
          </CardContent>
          <CardFooter className="p-4 border-t mt-auto">
            <div className="flex items-center gap-3 w-full">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask about your document..."
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
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};


import { Button } from "@/components/ui/button";
import { Copy, Send } from "lucide-react";
import { toast } from "sonner";
import { AIRecommendation } from "./AIRecommendation";

interface GeneratedLinkDisplayProps {
  generatedLink: string;
  clientName: string;
  clientEmail: string;
  caseType: string;
  isSending: boolean;
  handleCopyLink: () => void;
  handleSendEmail: () => void;
}

export const GeneratedLinkDisplay = ({
  generatedLink,
  clientName,
  clientEmail,
  caseType,
  isSending,
  handleCopyLink,
  handleSendEmail
}: GeneratedLinkDisplayProps) => {
  return (
    <div className="border rounded-md p-4 space-y-4">
      <div>
        <h3 className="text-sm font-medium mb-2">Booking Link Generated</h3>
        <div className="flex items-center space-x-2 bg-muted p-2 rounded-md">
          <span className="text-sm truncate flex-1">{generatedLink}</span>
          <Button variant="outline" size="sm" onClick={handleCopyLink}>
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Next Steps</h3>
        <p className="text-sm text-muted-foreground">
          Send this booking link to the client via email, or use our automated email system below.
        </p>
        
        <AIRecommendation caseType={caseType} />
        
        <Button 
          className="w-full mt-2" 
          onClick={handleSendEmail}
          disabled={isSending}
        >
          {isSending ? (
            <>Processing...</>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              Send Booking Email to Client
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

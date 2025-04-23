import { Card, CardContent } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface DocumentSummaryProps {
  summary: string;
  regulatoryCompliance?: {
    status: 'compliant' | 'non_compliant' | 'needs_review';
    details: string;
    references?: string[];
  };
  comprehensiveAssessment?: string;
}

export const DocumentSummary: React.FC<DocumentSummaryProps> = ({ 
  summary,
  regulatoryCompliance,
  comprehensiveAssessment
}) => {
  const [showAssessment, setShowAssessment] = useState(false);

  return (
    <>
      <Card className="mb-4">
        <CardContent className="pt-4">
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <h4 className="font-medium mb-2">Document Summary</h4>
              {comprehensiveAssessment && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowAssessment(true)}
                  className="ml-auto"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Detailed Assessment
                </Button>
              )}
            </div>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {summary}
            </p>

            {regulatoryCompliance && (
              <div>
                <h4 className="font-medium mb-2">Regulatory Compliance</h4>
                <Alert 
                  variant={regulatoryCompliance.status === 'non_compliant' ? 'destructive' : 'default'}
                  className={cn(
                    regulatoryCompliance.status === 'needs_review' && "border-orange-500 text-orange-500"
                  )}
                >
                  <p className="text-sm">{regulatoryCompliance.details}</p>
                  {regulatoryCompliance.references && (
                    <div className="mt-2">
                      <p className="text-xs font-medium">References:</p>
                      <ul className="text-xs list-disc list-inside">
                        {regulatoryCompliance.references.map((ref, index) => (
                          <li key={index}>{ref}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </Alert>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Comprehensive Assessment Dialog */}
      {comprehensiveAssessment && (
        <Dialog open={showAssessment} onOpenChange={setShowAssessment}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Comprehensive Risk Assessment</DialogTitle>
            </DialogHeader>
            <div className="mt-4">
              <pre className="text-sm whitespace-pre-wrap font-sans">
                {comprehensiveAssessment}
              </pre>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

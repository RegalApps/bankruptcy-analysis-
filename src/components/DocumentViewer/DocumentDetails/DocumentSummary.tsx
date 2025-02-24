
import { Card, CardContent } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";

interface DocumentSummaryProps {
  summary: string;
  regulatoryCompliance?: {
    status: 'compliant' | 'non_compliant' | 'needs_review';
    details: string;
    references?: string[];
  };
}

export const DocumentSummary: React.FC<DocumentSummaryProps> = ({ 
  summary,
  regulatoryCompliance
}) => {
  return (
    <Card className="mb-4">
      <CardContent className="pt-4">
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Document Summary</h4>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {summary}
            </p>
          </div>

          {regulatoryCompliance && (
            <div>
              <h4 className="font-medium mb-2">Regulatory Compliance</h4>
              <Alert 
                variant={
                  regulatoryCompliance.status === 'compliant' 
                    ? 'default'
                    : regulatoryCompliance.status === 'needs_review'
                    ? 'warning'
                    : 'destructive'
                }
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
  );
};

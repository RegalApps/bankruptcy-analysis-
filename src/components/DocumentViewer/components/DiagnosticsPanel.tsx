
import { Card } from "@/components/ui/card";

interface DiagnosticsPanelProps {
  documentId: string;
  document: any;
}

export const DiagnosticsPanel = ({ documentId, document }: DiagnosticsPanelProps) => {
  return (
    <Card className="p-4">
      <h3 className="font-medium mb-2">Document Diagnostics</h3>
      <pre className="text-xs bg-muted p-2 rounded overflow-auto">
        {JSON.stringify({
          documentId,
          hasAnalysis: !!document?.analysis?.length,
          analysisFields: document?.analysis?.[0]?.content 
            ? Object.keys(document.analysis[0].content)
            : [],
        }, null, 2)}
      </pre>
    </Card>
  );
};

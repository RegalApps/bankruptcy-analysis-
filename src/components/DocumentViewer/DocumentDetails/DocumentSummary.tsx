
interface DocumentSummaryProps {
  summary: string;
}

export const DocumentSummary = ({ summary }: DocumentSummaryProps) => {
  if (!summary) return null;
  
  return (
    <div className="mb-4 p-3 bg-background rounded border">
      <h4 className="text-sm font-medium mb-2">Document Summary</h4>
      <p className="text-sm text-muted-foreground">{summary}</p>
    </div>
  );
};

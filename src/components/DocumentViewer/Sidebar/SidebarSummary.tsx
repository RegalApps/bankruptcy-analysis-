
import { Separator } from "@/components/ui/separator";

interface SidebarSummaryProps {
  formType: string | undefined;
  extractedInfo: any;
}

export const SidebarSummary: React.FC<SidebarSummaryProps> = ({ formType, extractedInfo }) => {
  const isForm47 = formType === "form-47";
  const isForm31 = formType === "form-31";
  return (
    <div className="sidebar-section">
      <div className="sidebar-section-header">
        <h3 className="sidebar-section-title">
          {isForm47 ? 'Consumer Proposal Summary' :
            isForm31 ? 'Proof of Claim Summary' : 'Document Summary'}
        </h3>
      </div>
      {extractedInfo?.summary ? (
        <p className="text-sm text-foreground leading-relaxed">{extractedInfo.summary}</p>
      ) : (
        <div className="text-center py-3 bg-background/50 rounded-md">
          <p className="text-xs text-muted-foreground">No summary available</p>
          <p className="text-xs mt-1">Try analyzing the document to generate a summary</p>
        </div>
      )}
      <Separator className="my-3" />
    </div>
  );
};

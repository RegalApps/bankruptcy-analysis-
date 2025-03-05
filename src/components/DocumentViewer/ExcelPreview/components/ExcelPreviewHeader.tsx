
import { CardTitle } from "@/components/ui/card";
import { FileSpreadsheet, RefreshCw, DownloadCloud, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ExcelPreviewHeaderProps {
  title?: string;
}

export const ExcelPreviewHeader: React.FC<ExcelPreviewHeaderProps> & {
  Actions: React.FC<ExcelPreviewHeaderActionsProps>;
} = ({ title }) => {
  return (
    <CardTitle className="flex items-center gap-2">
      <FileSpreadsheet className="h-5 w-5 text-green-600" />
      Excel Preview: {title || 'Financial Data'}
    </CardTitle>
  );
};

interface ExcelPreviewHeaderActionsProps {
  publicUrl: string;
  onRefresh: () => void;
}

const ExcelPreviewHeaderActions: React.FC<ExcelPreviewHeaderActionsProps> = ({ 
  publicUrl, 
  onRefresh 
}) => {
  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" onClick={onRefresh}>
        <RefreshCw className="h-4 w-4 mr-2" />
        Refresh
      </Button>
      <Button variant="outline" size="sm" asChild>
        <a 
          href={publicUrl}
          target="_blank"
          rel="noopener noreferrer"
          download
        >
          <DownloadCloud className="h-4 w-4 mr-2" />
          Download
        </a>
      </Button>
      <Button variant="default" size="sm" asChild>
        <a 
          href={publicUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          Open in Browser
        </a>
      </Button>
    </div>
  );
};

ExcelPreviewHeader.Actions = ExcelPreviewHeaderActions;

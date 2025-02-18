
import { FileText } from "lucide-react";

interface DocumentHeaderProps {
  title: string;
  type: string;
}

export const DocumentHeader: React.FC<DocumentHeaderProps> = ({ title, type }) => {
  return (
    <div className="flex items-center space-x-4 mb-6">
      <div className="p-2 rounded-md bg-primary/10">
        <FileText className="h-6 w-6 text-primary" />
      </div>
      <div>
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-sm text-muted-foreground">{type}</p>
      </div>
    </div>
  );
};

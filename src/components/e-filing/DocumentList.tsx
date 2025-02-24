
import { useEFiling } from "./context/EFilingContext";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Loader2
} from "lucide-react";

export const DocumentList = () => {
  const { documents, selectDocument, selectedDocument } = useEFiling();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ready':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'validating':
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ready':
        return <Badge variant="default" className="bg-green-500">Ready</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      case 'validating':
        return <Badge variant="default" className="bg-blue-500">Validating</Badge>;
      default:
        return <Badge variant="default" className="bg-yellow-500">Pending</Badge>;
    }
  };

  return (
    <ScrollArea className="h-[calc(100vh-400px)]">
      <div className="space-y-2">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className={`p-4 rounded-lg border cursor-pointer transition-colors ${
              selectedDocument?.id === doc.id
                ? "bg-primary/5 border-primary"
                : "hover:bg-muted"
            }`}
            onClick={() => selectDocument(doc)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getStatusIcon(doc.status)}
                <div>
                  <h3 className="font-medium">{doc.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    Last updated: {new Date(doc.lastUpdated).toLocaleDateString()}
                  </p>
                </div>
              </div>
              {getStatusBadge(doc.status)}
            </div>
          </div>
        ))}
        {documents.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No documents available for e-filing
          </div>
        )}
      </div>
    </ScrollArea>
  );
};

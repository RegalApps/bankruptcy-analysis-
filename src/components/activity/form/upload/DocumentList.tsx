
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Check, X, Loader2 } from "lucide-react";
import { FileInfo } from "./types";

interface DocumentListProps {
  files: FileInfo[];
}

export const DocumentList = ({ files }: DocumentListProps) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'uploading':
      case 'analyzing':
        return <Loader2 className="h-4 w-4 animate-spin" />;
      case 'completed':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'error':
        return <X className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'uploading':
        return 'Uploading...';
      case 'analyzing':
        return 'AI Analysis...';
      case 'completed':
        return 'Completed';
      case 'error':
        return 'Failed';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Uploaded Documents</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {files.map((file) => (
            <div key={file.id} className="border rounded-md p-3 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <div>
                  <p className="text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {getStatusIcon(file.status)}
                  <span className="text-xs ml-1">{getStatusText(file.status)}</span>
                </div>
                
                {file.status !== 'completed' && file.status !== 'error' && (
                  <div className="w-20 h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full" 
                      style={{ width: `${file.progress}%` }}
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

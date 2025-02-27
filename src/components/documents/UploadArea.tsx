
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";

interface UploadAreaProps {
  onFileUpload: (file: File) => Promise<void>;
  isUploading: boolean;
  uploadProgress?: number;
  uploadStep?: string;
}

export const UploadArea = ({ onFileUpload, isUploading, uploadProgress = 0, uploadStep = "" }: UploadAreaProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      await onFileUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  return (
    <Card 
      className={`border-2 border-dashed transition-colors ${
        isDragging ? 'border-primary bg-primary/10' : 'hover:border-primary/50'
      }`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <CardContent className="flex flex-col items-center justify-center py-12 text-center cursor-pointer">
        <input
          type="file"
          id="file-upload"
          className="hidden"
          accept=".pdf,.doc,.docx"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              onFileUpload(file);
            }
          }}
        />
        {isUploading ? (
          <div className="w-full space-y-6">
            <Upload className="h-12 w-12 mx-auto text-primary mb-4 animate-pulse" />
            <h3 className="text-lg font-medium mb-2">
              Processing Document...
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {uploadStep}
            </p>
            <div className="space-y-2 max-w-md mx-auto">
              <Progress value={uploadProgress} className="h-2 w-full" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Upload</span>
                <span>Extraction</span>
                <span>Analysis</span>
                <span>Complete</span>
              </div>
            </div>
          </div>
        ) : (
          <div 
            onClick={() => document.getElementById('file-upload')?.click()}
            className="w-full"
          >
            <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">
              Drag and drop your documents here
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              or click to browse your files
            </p>
            <Button variant="outline">
              Browse Files
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

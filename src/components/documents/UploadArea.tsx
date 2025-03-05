
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileType, Check } from "lucide-react";
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

  const getProgressBarSteps = () => {
    // Different steps based on progress
    if (uploadProgress < 25) {
      return (
        <div className="flex justify-between text-xs text-muted-foreground">
          <span className="font-medium text-primary">Validation</span>
          <span>Upload</span>
          <span>Processing</span>
          <span>Complete</span>
        </div>
      );
    } else if (uploadProgress < 50) {
      return (
        <div className="flex justify-between text-xs text-muted-foreground">
          <span className="text-primary">✓ Validation</span>
          <span className="font-medium text-primary">Upload</span>
          <span>Processing</span>
          <span>Complete</span>
        </div>
      );
    } else if (uploadProgress < 95) {
      return (
        <div className="flex justify-between text-xs text-muted-foreground">
          <span className="text-primary">✓ Validation</span>
          <span className="text-primary">✓ Upload</span>
          <span className="font-medium text-primary">Processing</span>
          <span>Complete</span>
        </div>
      );
    } else {
      return (
        <div className="flex justify-between text-xs text-muted-foreground">
          <span className="text-primary">✓ Validation</span>
          <span className="text-primary">✓ Upload</span>
          <span className="text-primary">✓ Processing</span>
          <span className="font-medium text-primary">Complete</span>
        </div>
      );
    }
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
          accept=".pdf,.doc,.docx,.xls,.xlsx"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              onFileUpload(file);
            }
          }}
        />
        {isUploading ? (
          <div className="w-full space-y-6">
            {uploadProgress === 100 ? (
              <Check className="h-12 w-12 mx-auto text-green-500 mb-4" />
            ) : (
              <Upload className="h-12 w-12 mx-auto text-primary mb-4 animate-pulse" />
            )}
            
            <h3 className="text-lg font-medium mb-2">
              {uploadProgress === 100 ? "Upload Complete!" : "Processing Document..."}
            </h3>
            
            <p className="text-sm text-muted-foreground mb-4">
              {uploadStep}
            </p>
            
            <div className="space-y-2 max-w-md mx-auto">
              <Progress 
                value={uploadProgress} 
                className={`h-2 w-full ${uploadProgress === 100 ? 'bg-green-200' : ''}`} 
              />
              
              {getProgressBarSteps()}
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
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              <div className="flex items-center space-x-1 text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                <FileType size={12} />
                <span>PDF</span>
              </div>
              <div className="flex items-center space-x-1 text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                <FileType size={12} />
                <span>Word</span>
              </div>
              <div className="flex items-center space-x-1 text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                <FileType size={12} />
                <span>Excel</span>
              </div>
            </div>
            <Button variant="outline">
              Browse Files
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

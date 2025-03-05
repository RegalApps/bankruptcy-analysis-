
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileType, Check, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useState, useEffect } from "react";

interface UploadAreaProps {
  onFileUpload: (file: File) => Promise<void>;
  isUploading: boolean;
  uploadProgress?: number;
  uploadStep?: string;
}

export const UploadArea = ({ onFileUpload, isUploading, uploadProgress = 0, uploadStep = "" }: UploadAreaProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [estimatedTimeRemaining, setEstimatedTimeRemaining] = useState<number | null>(null);

  // Track elapsed time for better user feedback during upload
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isUploading) {
      timer = setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
      }, 1000);
    } else {
      setElapsedSeconds(0);
      setEstimatedTimeRemaining(null);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isUploading]);
  
  // Calculate estimated time remaining based on progress
  useEffect(() => {
    if (isUploading && uploadProgress > 5 && uploadProgress < 95) {
      const totalEstimatedSeconds = (elapsedSeconds / uploadProgress) * 100;
      const remaining = Math.max(Math.round(totalEstimatedSeconds - elapsedSeconds), 1);
      setEstimatedTimeRemaining(remaining);
    } else if (uploadProgress >= 95) {
      setEstimatedTimeRemaining(null);
    }
  }, [uploadProgress, elapsedSeconds, isUploading]);

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

  // Format the time remaining
  const formatTimeRemaining = (seconds: number): string => {
    if (seconds < 60) return `${seconds} sec`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds} min`;
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
              <div className="relative mx-auto h-12 w-12 mb-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <span className="absolute inset-0 flex items-center justify-center text-xs font-medium">
                  {uploadProgress}%
                </span>
              </div>
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
              
              {estimatedTimeRemaining && (
                <div className="flex items-center justify-center text-xs text-muted-foreground mt-2">
                  <span>Estimated time remaining: ~{formatTimeRemaining(estimatedTimeRemaining)}</span>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-4 gap-2 w-full max-w-md mt-4">
              {['Validation', 'Upload', 'Processing', 'Completion'].map((stage, index) => (
                <div 
                  key={stage}
                  className={`text-center p-1 rounded-sm text-xs ${
                    (index === 0 && uploadProgress > 0) || 
                    (index === 1 && uploadProgress >= 25) || 
                    (index === 2 && uploadProgress >= 50) || 
                    (index === 3 && uploadProgress >= 95)
                      ? 'bg-primary/10 text-primary-foreground'
                      : 'bg-muted/50 text-muted-foreground'
                  }`}
                >
                  {stage}
                </div>
              ))}
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

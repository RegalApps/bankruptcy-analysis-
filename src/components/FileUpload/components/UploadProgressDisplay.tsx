
import React from 'react';
import { Progress } from "@/components/ui/progress";
import { Upload } from "lucide-react";

interface UploadProgressDisplayProps {
  uploadProgress: number;
  uploadStep: string;
}

export const UploadProgressDisplay: React.FC<UploadProgressDisplayProps> = ({ 
  uploadProgress, 
  uploadStep 
}) => {
  return (
    <div className="w-full space-y-6 p-6 border-2 border-dashed border-gray-300 rounded-lg">
      <Upload className={`h-8 w-8 mx-auto ${uploadProgress === 100 ? 'text-green-500' : 'text-primary animate-pulse'}`} />
      <p className="text-center font-medium">{uploadStep}</p>
      <Progress value={uploadProgress} className="w-full" />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span className={uploadProgress >= 10 ? "text-primary" : ""}>Validation</span>
        <span className={uploadProgress >= 40 ? "text-primary" : ""}>Upload</span>
        <span className={uploadProgress >= 70 ? "text-primary" : ""}>Processing</span>
        <span className={uploadProgress >= 100 ? "text-primary" : ""}>Complete</span>
      </div>
    </div>
  );
};

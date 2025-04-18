
import React, { useEffect, useState } from 'react';
import { addUploadProgressCallback, getAllActiveUploads } from '@/utils/documents/uploadTracker';
import { Progress } from '@/components/ui/progress';
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export const UploadProgressTracker = () => {
  const [activeUploads, setActiveUploads] = useState<any[]>([]);
  
  useEffect(() => {
    // Initialize with current uploads
    setActiveUploads(getAllActiveUploads());
    
    // Listen for upload progress events
    const unsubscribe = addUploadProgressCallback((id, progress, stage) => {
      setActiveUploads(prevUploads => {
        // Check if this upload already exists in our state
        const existingIndex = prevUploads.findIndex(upload => upload.id === id);
        
        // Determine the upload status
        let status = 'uploading';
        const stageStr = String(stage);
        if (stageStr.includes('error')) {
          status = 'error';
        } else if (stageStr.includes('complete')) {
          status = 'complete';
        } else if (progress >= 80) {
          status = 'processing';
        }
        
        const updatedUpload = {
          documentId: id,
          progress,
          message: stage,
          status
        };
        
        if (existingIndex >= 0) {
          // Update existing upload
          const newUploads = [...prevUploads];
          newUploads[existingIndex] = updatedUpload;
          return newUploads;
        } else {
          // Add new upload
          return [...prevUploads, updatedUpload];
        }
      });
    });
    
    return unsubscribe;
  }, []);
  
  // Remove completed uploads after 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveUploads(prevUploads => 
        prevUploads.filter(upload => 
          upload.status !== 'complete' || 
          Date.now() - upload.completedAt < 5000
        )
      );
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  if (activeUploads.length === 0) {
    return null;
  }
  
  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 max-w-[calc(100vw-2rem)] bg-background border rounded-lg shadow-lg">
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">Document Uploads</h3>
          <Badge variant="outline" className="text-xs">
            {activeUploads.length} {activeUploads.length === 1 ? 'upload' : 'uploads'}
          </Badge>
        </div>
        
        <div className="space-y-3 max-h-60 overflow-y-auto">
          {activeUploads.map((upload) => (
            <div key={upload.documentId} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  {upload.status === 'uploading' && (
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  )}
                  {upload.status === 'processing' && (
                    <Loader2 className="h-4 w-4 animate-spin text-amber-500" />
                  )}
                  {upload.status === 'complete' && (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  )}
                  {upload.status === 'error' && (
                    <AlertCircle className="h-4 w-4 text-destructive" />
                  )}
                  <span className="font-medium truncate max-w-[12rem]">
                    {upload.message}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {upload.progress}%
                </span>
              </div>
              <Progress 
                value={upload.progress} 
                className={cn("h-1.5", 
                  upload.status === 'error' 
                    ? 'bg-destructive/20' 
                    : upload.status === 'complete' 
                      ? 'bg-green-500/20' 
                      : 'bg-muted'
                )}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

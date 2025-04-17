
import React, { useEffect, useState } from 'react';
import { useUploadProgress } from '@/utils/documents/uploadTracker';
import { Progress } from '@/components/ui/progress';
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const UploadProgressTracker = () => {
  const [activeUploads, setActiveUploads] = useState<any[]>([]);
  const { getActiveUploads, listenToUploadEvents } = useUploadProgress();
  
  useEffect(() => {
    // Initialize with current uploads
    setActiveUploads(getActiveUploads());
    
    // Listen for upload progress events
    const unsubscribe = listenToUploadEvents((uploads) => {
      setActiveUploads([...uploads]);
    });
    
    return unsubscribe;
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
                className={`h-1.5 ${
                  upload.status === 'error' 
                    ? 'bg-destructive/20' 
                    : upload.status === 'complete' 
                      ? 'bg-green-500/20' 
                      : 'bg-muted'
                }`}
                indicatorClassName={
                  upload.status === 'error' 
                    ? 'bg-destructive' 
                    : upload.status === 'complete' 
                      ? 'bg-green-500'
                      : undefined
                }
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

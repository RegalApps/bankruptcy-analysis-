import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { Upload, File, CheckCircle, AlertCircle } from 'lucide-react';
import { uploadDocument } from '@/utils/documentOperations';

interface FileUploadProps {
  onUploadComplete?: (documentId: string) => void;
  maxFiles?: number;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onUploadComplete,
  maxFiles = 1
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;
    
    // Reset states
    setUploadSuccess(false);
    setUploadError(null);
    setUploadProgress(0);
    
    // Get the first file
    const selectedFile = selectedFiles[0];
    
    // Check if it's a PDF
    if (selectedFile.type !== 'application/pdf' && !selectedFile.name.toLowerCase().endsWith('.pdf')) {
      toast.error('Only PDF files are supported');
      return;
    }
    
    setFile(selectedFile);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    const droppedFiles = e.dataTransfer.files;
    if (!droppedFiles || droppedFiles.length === 0) return;
    
    // Reset states
    setUploadSuccess(false);
    setUploadError(null);
    setUploadProgress(0);
    
    // Get the first file
    const droppedFile = droppedFiles[0];
    
    // Check if it's a PDF
    if (droppedFile.type !== 'application/pdf' && !droppedFile.name.toLowerCase().endsWith('.pdf')) {
      toast.error('Only PDF files are supported');
      return;
    }
    
    setFile(droppedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file to upload');
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setUploadSuccess(false);
    setUploadError(null);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev + 5;
          return newProgress > 90 ? 90 : newProgress;
        });
      }, 200);

      // Upload the file
      const documentData = await uploadDocument(file);
      
      // Complete progress
      clearInterval(progressInterval);
      setUploadProgress(100);
      setUploadSuccess(true);
      
      // Call the callback if provided
      if (onUploadComplete && documentData) {
        onUploadComplete(documentData.id);
      }
      
      toast.success('Document uploaded successfully');
      
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError(error instanceof Error ? error.message : 'Failed to upload document');
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const clearFile = () => {
    setFile(null);
    setUploadProgress(0);
    setUploadSuccess(false);
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="space-y-4">
      <Card 
        className={`p-6 border-dashed cursor-pointer transition-colors ${
          uploadSuccess ? 'bg-green-50 border-green-200' : 
          uploadError ? 'bg-red-50 border-red-200' : ''
        }`}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleBrowseClick}
      >
        <input 
          type="file" 
          ref={fileInputRef}
          className="hidden" 
          accept=".pdf,application/pdf" 
          onChange={handleFileChange}
        />
        
        <div className="flex flex-col items-center justify-center text-center p-4">
          {uploadSuccess ? (
            <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
          ) : uploadError ? (
            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
          ) : file ? (
            <File className="h-12 w-12 text-blue-500 mb-4" />
          ) : (
            <Upload className="h-12 w-12 text-muted-foreground mb-4" />
          )}
          
          {!file && (
            <>
              <p className="text-lg font-medium mb-1">
                Drag & drop files here
              </p>
              <p className="text-sm text-muted-foreground mb-2">
                or click to browse
              </p>
              <p className="text-xs text-muted-foreground">
                Supported formats: PDF
              </p>
            </>
          )}
          
          {file && (
            <div className="w-full">
              <p className="text-lg font-medium mb-2">Selected File</p>
              <div className="flex items-center text-left mb-2 p-2 bg-muted/30 rounded">
                <File className="h-5 w-5 mr-2 flex-shrink-0" />
                <div className="overflow-hidden">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {uploadError && (
            <div className="mt-4 text-red-600">
              <p className="font-medium">Upload failed</p>
              <p className="text-sm">{uploadError}</p>
            </div>
          )}
          
          {uploadSuccess && (
            <div className="mt-4 text-green-600">
              <p className="font-medium">Upload successful!</p>
              <p className="text-sm">Your document has been uploaded and processed.</p>
            </div>
          )}
        </div>
      </Card>
      
      {uploading && (
        <div className="space-y-2">
          <Progress value={uploadProgress} className="h-2" />
          <p className="text-xs text-center text-muted-foreground">
            Uploading... {uploadProgress}%
          </p>
        </div>
      )}
      
      <div className="flex gap-2">
        {file && !uploadSuccess && (
          <>
            <Button 
              onClick={handleUpload} 
              disabled={uploading}
              className="flex-1"
            >
              {uploading ? 'Uploading...' : 'Upload Document'}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={clearFile}
              disabled={uploading}
            >
              Clear
            </Button>
          </>
        )}
        
        {uploadSuccess && (
          <Button 
            variant="outline" 
            onClick={clearFile}
            className="flex-1"
          >
            Upload Another
          </Button>
        )}
      </div>
    </div>
  );
};

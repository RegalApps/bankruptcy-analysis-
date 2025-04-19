
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { AlertCircle, Upload, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useDocumentUpload } from "@/hooks/useDocumentUpload";
import { cleanupExistingForm31 } from "@/utils/documents/formCleanup";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export const TestForm31Upload: React.FC = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { uploadDocument } = useDocumentUpload({
    clientName: "GreenTech Industries",
    onUploadComplete: (documentId) => {
      toast.success("Form 31 uploaded successfully", {
        description: `Document ID: ${documentId}`
      });
      setIsUploading(false);
    },
    onUploadError: (error) => {
      toast.error("Upload failed", {
        description: error.message
      });
      setIsUploading(false);
    }
  });
  
  const handleCleanupForm31 = async () => {
    setIsDeleting(true);
    try {
      await cleanupExistingForm31();
    } catch (error) {
      toast.error("Error cleaning up documents", {
        description: error instanceof Error ? error.message : "Unknown error occurred"
      });
    } finally {
      setIsDeleting(false);
    }
  };
  
  const handleTestUpload = () => {
    // Create a simple Form 31 PDF-like file for testing
    const testData = new Blob([
      "Form 31 - Proof of Claim\nGreenTech Industries\nAmount: $125,450\nDate: 2023-04-15"
    ], { type: 'application/pdf' });
    
    const testFile = new File([testData], "Form 31 Proof of Claim - GreenTech.pdf", { 
      type: 'application/pdf',
      lastModified: new Date().getTime()
    });
    
    setIsUploading(true);
    uploadDocument(testFile);
  };

  return (
    <Card className="shadow-sm mb-6">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Form 31 Test Tools</CardTitle>
        <CardDescription>
          Tools to help test Form 31 upload and processing
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-sm mb-4">
          <div className="flex items-center gap-2 text-amber-600 mb-2">
            <AlertCircle className="h-4 w-4" />
            <p>If upload fails, try removing existing Form 31 documents first.</p>
          </div>
          <p className="text-muted-foreground">
            These tools help test the Form 31 upload process by cleaning up existing
            documents and uploading a test Form 31 document.
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 justify-end">
        <Button
          variant="destructive"
          size="sm"
          onClick={handleCleanupForm31}
          disabled={isDeleting || isUploading}
        >
          {isDeleting ? (
            <>
              <LoadingSpinner size="sm" className="mr-2" />
              Removing...
            </>
          ) : (
            <>
              <Trash2 className="h-4 w-4 mr-2" />
              Remove Existing Form 31s
            </>
          )}
        </Button>
        
        <Button
          variant="default"
          size="sm"
          onClick={handleTestUpload}
          disabled={isUploading || isDeleting}
        >
          {isUploading ? (
            <>
              <LoadingSpinner size="sm" className="mr-2" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Test Form 31 Upload
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

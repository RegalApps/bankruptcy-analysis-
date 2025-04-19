
import { useState } from "react";
import { StorageDiagnostic } from "@/components/docs/StorageDiagnostic";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BadgeCheck, DownloadCloud, FileCode, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatFileSize } from "@/utils/storage/bucketManager";
import { RobustFileUploader } from "@/components/documents/RobustFileUploader";
import { toast } from "sonner";

export const UploadDiagnosticPage = () => {
  const [activeTab, setActiveTab] = useState('diagnostics');
  
  const handleTestUploadComplete = (documentId: string) => {
    toast.success("Test upload successful", {
      description: `Document ID: ${documentId}`,
      duration: 5000
    });
  };

  return (
    <div className="container max-w-4xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Upload System Diagnostics</h1>
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="diagnostics">System Checks</TabsTrigger>
          <TabsTrigger value="test">Test Upload</TabsTrigger>
          <TabsTrigger value="troubleshooting">Troubleshooting</TabsTrigger>
        </TabsList>
        
        <div className="mt-6">
          <TabsContent value="diagnostics" className="space-y-6">
            <p className="text-muted-foreground mb-6">
              This tool runs diagnostics on your file storage system to identify configuration issues
              that may be affecting uploads.
            </p>
            
            <StorageDiagnostic />
          </TabsContent>
          
          <TabsContent value="test" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Test File Upload</CardTitle>
                <CardDescription>
                  Try uploading a small test file to verify your storage system is working correctly
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col gap-4">
                  <Alert>
                    <DownloadCloud className="h-4 w-4" />
                    <AlertDescription>
                      For best results, try uploading a small PDF or image file (under 1MB).
                    </AlertDescription>
                  </Alert>
                  
                  <div className="border p-6 rounded-md">
                    <RobustFileUploader 
                      onUploadComplete={handleTestUploadComplete}
                      maxSizeMB={5}
                      buttonText="Upload Test Document"
                    />
                  </div>
                  
                  <div className="mt-4">
                    <h3 className="font-medium mb-2">Recommended Test Files</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      <li>Small PDF document ({formatFileSize(500 * 1024)})</li>
                      <li>Small JPEG image ({formatFileSize(200 * 1024)})</li>
                      <li>Plain text document ({formatFileSize(10 * 1024)})</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="troubleshooting" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Common Issues & Solutions</CardTitle>
                <CardDescription>
                  Troubleshooting advice for file upload problems
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-medium flex items-center gap-2">
                    <BadgeCheck className="h-5 w-5 text-primary" /> Authentication Problems
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    If uploads fail with 401 errors, you need to be logged in. Supabase storage uses Row Level Security 
                    policies to protect files, which requires authentication. Try logging out and back in if you encounter
                    persistent permission errors.
                  </p>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium flex items-center gap-2">
                    <BadgeCheck className="h-5 w-5 text-primary" /> Large File Uploads
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Files over 5MB may fail to upload due to timeout or payload size limitations. Try using 
                    smaller files or enable chunked uploading for large files. The maximum file size is limited
                    to 30MB in this application.
                  </p>
                  
                  <Button variant="outline" className="gap-2 text-sm">
                    <FileCode className="h-4 w-4" />
                    View Upload Documentation
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium flex items-center gap-2">
                    <BadgeCheck className="h-5 w-5 text-primary" /> Network & CORS Issues
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Uploads may fail due to network connectivity issues or CORS configuration problems. Ensure 
                    you have a stable internet connection and that your browser allows cross-origin requests to 
                    the Supabase API.
                  </p>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium flex items-center gap-2">
                    <HelpCircle className="h-5 w-5 text-primary" /> Still Having Problems?
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    If you continue experiencing upload issues after trying these solutions, open your browser's 
                    developer tools (F12) and check the Console and Network tabs for specific error messages
                    that can help diagnose the problem.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default UploadDiagnosticPage;

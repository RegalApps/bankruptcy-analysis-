
import { useState, useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle, Upload, RefreshCw } from "lucide-react";
import { diagnoseUploadIssues } from "@/utils/storage/bucketManager";
import { ensureStorageBuckets } from "@/utils/storage/bucketManager";
import { supabase } from "@/lib/supabase";
import logger from "@/utils/logger";
import { useToast } from "@/hooks/use-toast";

export const UploadDiagnosticsPage = () => {
  const [diagnostics, setDiagnostics] = useState<any>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isFixing, setIsFixing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();
  
  const runDiagnostics = async () => {
    try {
      setIsRunning(true);
      const results = await diagnoseUploadIssues(selectedFile || undefined);
      setDiagnostics(results);
      logger.info("Upload diagnostics results:", results);
    } catch (error) {
      logger.error("Error running diagnostics:", error);
      toast({
        variant: "destructive",
        title: "Diagnostics Error",
        description: error instanceof Error ? error.message : "An unknown error occurred"
      });
    } finally {
      setIsRunning(false);
    }
  };
  
  const fixStorageIssues = async () => {
    try {
      setIsFixing(true);
      
      // Ensure user is authenticated
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        toast({
          variant: "destructive",
          title: "Authentication Required",
          description: "Please log in to fix storage issues"
        });
        return;
      }
      
      // Create storage bucket if needed
      const success = await ensureStorageBuckets();
      
      if (success) {
        toast({
          title: "Storage Initialized",
          description: "Document storage system is now ready to use"
        });
        
        // Run diagnostics again to verify fix
        await runDiagnostics();
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to initialize storage system"
        });
      }
    } catch (error) {
      logger.error("Error fixing storage issues:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fix storage issues"
      });
    } finally {
      setIsFixing(false);
    }
  };
  
  useEffect(() => {
    // Run diagnostics when the component mounts
    runDiagnostics();
  }, []);
  
  // Handle file selection for size validation
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };
  
  return (
    <div className="container max-w-4xl py-6 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Upload System Diagnostics</h1>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={runDiagnostics} 
          disabled={isRunning}
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isRunning ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Current Status</CardTitle>
          </CardHeader>
          <CardContent>
            {isRunning ? (
              <div className="flex items-center justify-center p-4">
                <div className="animate-spin mr-2">
                  <RefreshCw className="h-5 w-5" />
                </div>
                <p>Running diagnostics...</p>
              </div>
            ) : diagnostics ? (
              <div className="space-y-4">
                {/* User Authentication */}
                <div className="flex items-center space-x-2">
                  {diagnostics.isAuthenticated ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  )}
                  <p>
                    <span className="font-medium">User Authentication:</span>
                    {diagnostics.isAuthenticated ? ' Authenticated' : ' Not authenticated'}
                  </p>
                </div>
                
                {/* Storage Bucket */}
                <div className="flex items-center space-x-2">
                  {diagnostics.bucketExists ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  )}
                  <p>
                    <span className="font-medium">Storage Bucket:</span>
                    {diagnostics.bucketExists ? ' Available' : ' Not available'}
                  </p>
                </div>
                
                {/* Storage Permissions */}
                <div className="flex items-center space-x-2">
                  {diagnostics.hasPermission ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  )}
                  <p>
                    <span className="font-medium">Storage Permissions:</span>
                    {diagnostics.hasPermission ? ' Access granted' : ' Access denied'}
                  </p>
                </div>
                
                {/* File Size Check */}
                {selectedFile && (
                  <div className="flex items-center space-x-2">
                    {diagnostics.fileSizeValid ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    )}
                    <p>
                      <span className="font-medium">File Size Check:</span>
                      {diagnostics.fileSizeValid ? ' Valid size' : ' Exceeds limit'}
                    </p>
                  </div>
                )}
                
                {/* Overall Diagnostic */}
                <Alert variant={
                  diagnostics.isAuthenticated && diagnostics.bucketExists && diagnostics.hasPermission
                    ? "default"
                    : "destructive"
                }>
                  <AlertTitle>Diagnostic Result</AlertTitle>
                  <AlertDescription>
                    {diagnostics.diagnostic}
                  </AlertDescription>
                </Alert>
                
                {/* Fix Button (if needed) */}
                {(!diagnostics.bucketExists || !diagnostics.hasPermission) && (
                  <div className="flex justify-end mt-4">
                    <Button 
                      onClick={fixStorageIssues} 
                      disabled={isFixing || !diagnostics.isAuthenticated}
                    >
                      {isFixing ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          Fixing...
                        </>
                      ) : (
                        <>
                          Fix Storage Issues
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <p>No diagnostic information available</p>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Test File Upload</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Upload a test file to check if the file size validation is working correctly.
              </p>
              
              <div className="flex flex-col space-y-2">
                <input 
                  type="file"
                  id="test-file"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <div className="flex items-center space-x-2">
                  <Button asChild variant="outline">
                    <label htmlFor="test-file" className="cursor-pointer">
                      <Upload className="mr-2 h-4 w-4" />
                      Select Test File
                    </label>
                  </Button>
                  {selectedFile && (
                    <span className="text-sm">
                      {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                  )}
                </div>
                {selectedFile && (
                  <Button onClick={() => runDiagnostics()} disabled={isRunning}>
                    {isRunning ? "Checking..." : "Check File Size"}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UploadDiagnosticsPage;

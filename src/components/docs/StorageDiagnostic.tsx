
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, AlertCircle, HelpCircle, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { ensureStorageBuckets, diagnoseUploadIssues } from "@/utils/storage/bucketManager";
import { Badge } from "@/components/ui/badge";

export const StorageDiagnostic = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [authStatus, setAuthStatus] = useState<'checking' | 'authenticated' | 'unauthenticated'>('checking');
  
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getUser();
      setAuthStatus(data.user ? 'authenticated' : 'unauthenticated');
    };
    
    checkAuth();
  }, []);
  
  const runDiagnostics = async () => {
    setIsRunning(true);
    
    try {
      // 1. Check authentication
      const { data: { user } } = await supabase.auth.getUser();
      const authenticated = !!user;
      
      // 2. Check storage buckets
      const bucketsReady = await ensureStorageBuckets();
      
      // 3. Run upload diagnostics
      const uploadDiagnostics = await diagnoseUploadIssues();
      
      // 4. Check bucket configuration
      let bucketConfig = null;
      if (bucketsReady) {
        const { data: buckets } = await supabase.storage.listBuckets();
        const documentsBucket = buckets?.find(bucket => bucket.name === 'documents');
        bucketConfig = documentsBucket;
      }
      
      // 5. Check if we can list files
      let canListFiles = false;
      let filesCount = 0;
      if (bucketsReady && authenticated) {
        const { data: files, error } = await supabase.storage
          .from('documents')
          .list();
          
        canListFiles = !error;
        filesCount = files?.length || 0;
      }
      
      // 6. Check for RLS policies (indirect check)
      let rlsBlocking = authenticated && bucketsReady && !canListFiles;
      
      // Compile results
      setResults({
        timestamp: new Date().toISOString(),
        authenticated,
        bucketsReady,
        bucketConfig,
        uploadDiagnostics,
        canListFiles,
        filesCount,
        rlsBlocking,
        userId: user?.id || null,
        userEmail: user?.email || null
      });
    } catch (error) {
      console.error("Diagnostics error:", error);
      setResults({
        timestamp: new Date().toISOString(),
        error: String(error),
        success: false
      });
    } finally {
      setIsRunning(false);
    }
  };
  
  const testUpload = async () => {
    if (!results?.authenticated) {
      alert("You must be authenticated to test uploads");
      return;
    }
    
    setIsRunning(true);
    
    try {
      // Create a small test file
      const testContent = "This is a test file created for diagnostic purposes.";
      const testBlob = new Blob([testContent], { type: 'text/plain' });
      const testFile = new File([testBlob], 'upload-test.txt', { type: 'text/plain' });
      
      // Test path with timestamp to avoid conflicts
      const testPath = `diagnostic/upload-test-${Date.now()}.txt`;
      
      // Upload the test file
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(testPath, testFile, {
          cacheControl: '3600',
          upsert: false
        });
        
      if (uploadError) {
        throw uploadError;
      }
      
      // Try to download the file to verify it was uploaded correctly
      const { data: downloadData, error: downloadError } = await supabase.storage
        .from('documents')
        .download(testPath);
        
      let downloadSuccessful = false;
      if (!downloadError && downloadData) {
        const downloadedText = await downloadData.text();
        downloadSuccessful = downloadedText === testContent;
      }
      
      // Clean up the test file
      await supabase.storage
        .from('documents')
        .remove([testPath]);
        
      // Update results with test upload info
      setResults({
        ...results,
        testUpload: {
          success: !uploadError,
          downloadSuccess: downloadSuccessful,
          error: uploadError ? uploadError.message : null,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error("Test upload error:", error);
      setResults({
        ...results,
        testUpload: {
          success: false,
          error: String(error),
          timestamp: new Date().toISOString()
        }
      });
    } finally {
      setIsRunning(false);
    }
  };
  
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Storage System Diagnostics</CardTitle>
        <CardDescription>
          Troubleshoot issues with file uploads and storage access
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-medium">Authentication Status</h3>
            <p className="text-sm text-muted-foreground">User authentication is required for uploads</p>
          </div>
          <div>
            {authStatus === 'checking' ? (
              <Badge variant="outline">Checking...</Badge>
            ) : authStatus === 'authenticated' ? (
              <Badge variant="default" className="bg-green-500">Authenticated</Badge>
            ) : (
              <Badge variant="destructive">Not Authenticated</Badge>
            )}
          </div>
        </div>
        
        {results && (
          <div className="space-y-4 mt-4">
            <Alert variant={results.bucketsReady ? "default" : "destructive"}>
              <div className="flex items-center gap-2">
                {results.bucketsReady ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                <AlertTitle>Storage Buckets</AlertTitle>
              </div>
              <AlertDescription>
                {results.bucketsReady 
                  ? "Required storage buckets are properly configured" 
                  : "Storage buckets are not properly configured"}
              </AlertDescription>
            </Alert>
            
            <Alert variant={results.canListFiles ? "default" : "destructive"}>
              <div className="flex items-center gap-2">
                {results.canListFiles ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                <AlertTitle>Storage Access</AlertTitle>
              </div>
              <AlertDescription>
                {results.canListFiles 
                  ? `User can access storage (${results.filesCount} files found)` 
                  : "User cannot access storage - possible RLS policy issue"}
              </AlertDescription>
            </Alert>
            
            {results.testUpload && (
              <Alert variant={results.testUpload.success ? "default" : "destructive"}>
                <div className="flex items-center gap-2">
                  {results.testUpload.success ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4" />
                  )}
                  <AlertTitle>Test Upload</AlertTitle>
                </div>
                <AlertDescription>
                  {results.testUpload.success 
                    ? "Test upload completed successfully" 
                    : `Test upload failed: ${results.testUpload.error}`}
                </AlertDescription>
              </Alert>
            )}
            
            {results.uploadDiagnostics && (
              <div className="space-y-2">
                <h3 className="font-medium">Detailed Diagnostics</h3>
                <pre className="bg-muted p-4 rounded-md text-xs overflow-x-auto">
                  {JSON.stringify(results.uploadDiagnostics, null, 2)}
                </pre>
              </div>
            )}
            
            {results.error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Diagnostic Error</AlertTitle>
                <AlertDescription>{results.error}</AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button 
          onClick={runDiagnostics} 
          disabled={isRunning}
        >
          {isRunning ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <HelpCircle className="h-4 w-4 mr-2" />
          )}
          Run Diagnostics
        </Button>
        
        {results?.authenticated && (
          <Button 
            onClick={testUpload} 
            disabled={isRunning} 
            variant="outline"
          >
            {isRunning ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <HelpCircle className="h-4 w-4 mr-2" />
            )}
            Test Small Upload
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

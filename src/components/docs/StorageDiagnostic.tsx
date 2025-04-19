
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, XCircle, Loader2, RefreshCw } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export const StorageDiagnostic = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [checks, setChecks] = useState({
    userAuthenticated: { status: "pending", message: "Checking authentication" },
    bucketExists: { status: "pending", message: "Checking storage bucket" },
    createPermission: { status: "pending", message: "Checking upload permission" },
    storageAccess: { status: "pending", message: "Checking storage access" },
  });
  
  const runDiagnostics = async () => {
    setIsRunning(true);
    setChecks({
      userAuthenticated: { status: "running", message: "Checking authentication" },
      bucketExists: { status: "pending", message: "Checking storage bucket" },
      createPermission: { status: "pending", message: "Checking upload permission" },
      storageAccess: { status: "pending", message: "Checking storage access" },
    });
    
    // Check 1: Authentication
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        setChecks(prev => ({
          ...prev,
          userAuthenticated: { 
            status: "failed", 
            message: userError?.message || "User is not authenticated"
          }
        }));
        setIsRunning(false);
        return;
      }
      
      setChecks(prev => ({
        ...prev,
        userAuthenticated: { 
          status: "passed", 
          message: `Authenticated as ${user.email}`
        }
      }));
      
      // Check 2: Bucket exists
      setChecks(prev => ({
        ...prev,
        bucketExists: { status: "running", message: "Checking storage bucket" }
      }));
      
      const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
      
      if (bucketsError) {
        setChecks(prev => ({
          ...prev,
          bucketExists: { 
            status: "failed", 
            message: `Error checking buckets: ${bucketsError.message}`
          }
        }));
        setIsRunning(false);
        return;
      }
      
      const documentsExists = buckets?.some(bucket => bucket.name === 'documents');
      
      if (!documentsExists) {
        setChecks(prev => ({
          ...prev,
          bucketExists: { 
            status: "failed", 
            message: "Documents bucket does not exist"
          }
        }));
        
        // Try to create the bucket
        try {
          const { error: createError } = await supabase.storage
            .createBucket('documents', {
              public: false,
              fileSizeLimit: 30 * 1024 * 1024
            });
            
          if (createError) {
            toast.error("Failed to create storage bucket", {
              description: createError.message
            });
          } else {
            toast.success("Created documents bucket", {
              description: "Storage bucket has been created successfully"
            });
            
            setChecks(prev => ({
              ...prev,
              bucketExists: { 
                status: "passed", 
                message: "Documents bucket created successfully"
              }
            }));
          }
        } catch (error) {
          console.error("Error creating bucket:", error);
        }
      } else {
        setChecks(prev => ({
          ...prev,
          bucketExists: { 
            status: "passed", 
            message: "Documents bucket exists"
          }
        }));
      }
      
      // Check 3: Create permission
      setChecks(prev => ({
        ...prev,
        createPermission: { status: "running", message: "Checking upload permission" }
      }));
      
      // Create a small test file
      const testData = new Blob(["test"], { type: 'text/plain' });
      const testFile = new File([testData], 'permission-test.txt', { type: 'text/plain' });
      
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(`test-${Date.now()}.txt`, testFile);
      
      if (uploadError) {
        setChecks(prev => ({
          ...prev,
          createPermission: { 
            status: "failed", 
            message: `Upload permission error: ${uploadError.message}`
          }
        }));
      } else {
        setChecks(prev => ({
          ...prev,
          createPermission: { 
            status: "passed", 
            message: "You have permission to upload files"
          }
        }));
      }
      
      // Check 4: Storage access
      setChecks(prev => ({
        ...prev,
        storageAccess: { status: "running", message: "Checking storage access" }
      }));
      
      const { data: files, error: listError } = await supabase.storage
        .from('documents')
        .list();
      
      if (listError) {
        setChecks(prev => ({
          ...prev,
          storageAccess: { 
            status: "failed", 
            message: `Storage access error: ${listError.message}`
          }
        }));
      } else {
        setChecks(prev => ({
          ...prev,
          storageAccess: { 
            status: "passed", 
            message: `Access confirmed, found ${files?.length || 0} files`
          }
        }));
      }
      
    } catch (error) {
      console.error("Error running diagnostics:", error);
      toast.error("Diagnostic error", {
        description: error instanceof Error ? error.message : "An unknown error occurred"
      });
    } finally {
      setIsRunning(false);
    }
  };
  
  useEffect(() => {
    // Run diagnostics automatically when the component mounts
    runDiagnostics();
  }, []);
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-destructive" />;
      case 'running':
        return <Loader2 className="h-5 w-5 animate-spin text-primary" />;
      default:
        return <div className="h-5 w-5 rounded-full bg-muted"></div>;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Storage System Diagnostics</CardTitle>
        <Button 
          variant="outline"
          size="sm"
          onClick={runDiagnostics}
          disabled={isRunning}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRunning ? 'animate-spin' : ''}`} />
          {isRunning ? 'Running...' : 'Run Diagnostics'}
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {Object.entries(checks).map(([key, check]) => (
          <div key={key} className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              {getStatusIcon(check.status)}
            </div>
            <div className="flex-1">
              <p className="font-medium">{check.message}</p>
            </div>
          </div>
        ))}
        
        {Object.values(checks).some(check => check.status === 'failed') && (
          <Alert variant="destructive">
            <AlertDescription>
              Some storage checks failed. This may prevent file uploads from working properly.
            </AlertDescription>
          </Alert>
        )}
        
        {Object.values(checks).every(check => check.status === 'passed') && (
          <Alert variant="default" className="bg-green-50 border-green-200">
            <AlertDescription className="text-green-800">
              All storage checks passed. Your system is properly configured for file uploads.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

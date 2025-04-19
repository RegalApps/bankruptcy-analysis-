
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Check, X, AlertCircle, RefreshCw, HelpCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { diagnoseUploadIssues } from "@/utils/storage/bucketManager";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export const StorageDiagnostic = () => {
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [results, setResults] = useState<{
    authentication: boolean;
    bucket: boolean;
    permissions: boolean;
    limits: boolean;
    diagnostic: string;
    lastRun: Date | null;
  }>({
    authentication: false,
    bucket: false,
    permissions: false,
    limits: true,
    diagnostic: "",
    lastRun: null
  });

  const runDiagnostics = async () => {
    setIsRunningTests(true);
    
    try {
      // Check authentication
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      const isAuthenticated = !!user && !authError;
      
      // Check if documents bucket exists
      const { data: buckets } = await supabase.storage.listBuckets();
      const bucketExists = buckets?.some(bucket => bucket.name === 'documents') || false;

      // Check if user has permission to access the bucket
      let hasPermission = false;
      if (bucketExists && isAuthenticated) {
        const { error: listError } = await supabase.storage
          .from('documents')
          .list();
        
        hasPermission = !listError;
      }
      
      // Check file limits
      const testFile = new File(['test'], 'test.txt', { type: 'text/plain' });
      const diagnosticResult = await diagnoseUploadIssues(testFile);
      
      setResults({
        authentication: isAuthenticated,
        bucket: bucketExists,
        permissions: hasPermission,
        limits: diagnosticResult.fileSizeValid,
        diagnostic: diagnosticResult.diagnostic,
        lastRun: new Date()
      });
      
    } catch (error) {
      console.error("Error running diagnostics:", error);
    } finally {
      setIsRunningTests(false);
    }
  };

  useEffect(() => {
    // Run diagnostics once when component mounts
    runDiagnostics();
  }, []);

  const ResultBadge = ({ passed }: { passed: boolean }) => (
    passed ? 
      <Badge variant="outline" className="bg-green-50 text-green-600 hover:bg-green-50">
        <Check className="w-3 h-3 mr-1" /> Pass
      </Badge> : 
      <Badge variant="outline" className="bg-red-50 text-red-600 hover:bg-red-50">
        <X className="w-3 h-3 mr-1" /> Fail
      </Badge>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          Storage System Diagnostics
          <Button 
            variant="outline" 
            size="sm" 
            onClick={runDiagnostics} 
            disabled={isRunningTests}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRunningTests ? 'animate-spin' : ''}`} />
            {isRunningTests ? 'Running...' : 'Run Tests'}
          </Button>
        </CardTitle>
        <CardDescription>
          Tests the configuration of your Supabase storage system
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              User Authentication
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="w-80">
                      Checks if the current user is authenticated with Supabase.
                      This is required for file uploads with Row Level Security.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <ResultBadge passed={results.authentication} />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              Storage Bucket
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="w-80">
                      Verifies that the 'documents' storage bucket exists in your Supabase project.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <ResultBadge passed={results.bucket} />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              Access Permissions
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="w-80">
                      Tests if the current user has permission to access and upload to the bucket 
                      based on Row Level Security policies.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <ResultBadge passed={results.permissions} />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              File Size Limits
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="w-80">
                      Verifies that the bucket settings allow files within the expected size limit.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <ResultBadge passed={results.limits} />
          </div>
        </div>
        
        {results.diagnostic && (
          <Alert className={`${!results.authentication || !results.bucket || !results.permissions ? 'border-red-300' : 'border-green-300'}`}>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {results.diagnostic}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        {results.lastRun && (
          <>Last diagnostic run: {results.lastRun.toLocaleTimeString()}</>
        )}
      </CardFooter>
    </Card>
  );
};

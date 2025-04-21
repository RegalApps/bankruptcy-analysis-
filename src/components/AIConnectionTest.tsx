
import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, X, AlertCircle, RefreshCw, Key, User, Shield, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const AIConnectionTest = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [authStatus, setAuthStatus] = useState<'unknown' | 'valid' | 'invalid'>('unknown');
  const { toast } = useToast();

  const checkAuthStatus = async () => {
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !sessionData.session) {
        setAuthStatus('invalid');
        return false;
      } else {
        setAuthStatus('valid');
        return true;
      }
    } catch (err) {
      setAuthStatus('invalid');
      return false;
    }
  };

  const refreshSession = async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error || !data.session) {
        toast({
          variant: "destructive",
          title: "Session Refresh Failed",
          description: error?.message || "Failed to refresh your session."
        });
        return false;
      }
      
      setAuthStatus('valid');
      toast({
        title: "Session Refreshed",
        description: "Your authentication session has been refreshed."
      });
      return true;
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Session Refresh Error",
        description: err.message || "An unknown error occurred"
      });
      return false;
    }
  };

  const testConnection = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      // First ensure we have a valid session
      const isAuthenticated = await checkAuthStatus();
      
      if (!isAuthenticated) {
        const refreshed = await refreshSession();
        if (!refreshed) {
          throw new Error('Authentication required. Please log in to test the connection.');
        }
      }
      
      console.log("Using authenticated session for connection test");
      
      // Test the OpenAI connection
      const { data, error } = await supabase.functions.invoke('process-ai-request', {
        body: { testMode: true, message: "Test connection" }
      });

      if (error) {
        throw new Error(`API test failed: ${error.message || JSON.stringify(error)}`);
      }

      setResult(data);
      
      if (data.success) {
        toast({
          title: "Connection successful!",
          description: "The AI system is configured correctly and ready to use."
        });
      } else {
        toast({
          variant: "destructive",
          title: "Connection test failed",
          description: data.error || "An unknown error occurred."
        });
      }
    } catch (err: any) {
      console.error("Connection test error:", err);
      setError(err.message || "An unknown error occurred");
      toast({
        variant: "destructive",
        title: "Connection test failed",
        description: err.message || "Failed to test connection."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>AI Connection Test</CardTitle>
        <CardDescription>
          Test the connection to the OpenAI API and verify authentication
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-4 rounded-md bg-slate-50 border border-slate-200">
          <div className="flex items-center">
            <User className="h-5 w-5 text-slate-500 mr-2" />
            <div>
              <p className="font-medium text-slate-700">Authentication Status</p>
              <div className="flex items-center mt-1">
                {authStatus === 'unknown' && (
                  <p className="text-sm text-slate-500">Not checked yet</p>
                )}
                {authStatus === 'valid' && (
                  <>
                    <Check className="h-4 w-4 text-green-500 mr-1" />
                    <p className="text-sm text-green-700">Authentication valid</p>
                  </>
                )}
                {authStatus === 'invalid' && (
                  <>
                    <X className="h-4 w-4 text-red-500 mr-1" />
                    <p className="text-sm text-red-700">Authentication invalid or expired</p>
                  </>
                )}
              </div>
              
              <div className="mt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={refreshSession}
                  className="text-xs"
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Refresh Session
                </Button>
              </div>
            </div>
          </div>
        </div>

        {result && (
          <div className={`p-4 rounded-md mb-4 ${result.success ? 'bg-green-50' : 'bg-red-50'}`}>
            <div className="flex items-center">
              {result.success ? (
                <Check className="h-5 w-5 text-green-500 mr-2" />
              ) : (
                <X className="h-5 w-5 text-red-500 mr-2" />
              )}
              <div>
                <p className={`font-medium ${result.success ? 'text-green-800' : 'text-red-800'}`}>
                  {result.success ? 'Connection Successful' : 'Connection Failed'}
                </p>
                <p className={`text-sm ${result.success ? 'text-green-600' : 'text-red-600'}`}>
                  {result.message || result.error || 'No additional information available'}
                </p>
                
                {result.debugInfo && (
                  <div className="mt-2 text-xs">
                    <p className="font-medium">Diagnostic Information:</p>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      <li>
                        <span className="inline-flex items-center">
                          <Key className="h-3 w-3 mr-1" />
                          OpenAI API Key: {result.debugInfo.status?.openAIKeyPresent ? 'Configured ✅' : 'Missing ❌'}
                        </span>
                      </li>
                      <li>
                        <span className="inline-flex items-center">
                          <User className="h-3 w-3 mr-1" />
                          Authentication: {result.debugInfo.status?.authPresent ? 'Valid ✅' : 'Invalid ❌'}
                        </span>
                      </li>
                      <li>
                        <span className="inline-flex items-center">
                          <Shield className="h-3 w-3 mr-1" />
                          Service Role: {result.debugInfo.status?.serviceRoleUsed ? 'Used ✅' : 'Not Used'}
                        </span>
                      </li>
                      <li>
                        <span className="inline-flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          Timestamp: {result.debugInfo.status?.timestamp || 'Not available'}
                        </span>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {error && !result && (
          <div className="bg-red-50 p-4 rounded-md mb-4">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <div>
                <p className="font-medium text-red-800">Authentication Error</p>
                <p className="text-sm text-red-600">{error}</p>
              </div>
            </div>
          </div>
        )}

        <p className="text-sm text-muted-foreground">
          This will test the connection to the OpenAI API and verify that authentication is working properly. 
          The test will check if:
        </p>
        <ul className="list-disc list-inside mt-2 text-sm text-muted-foreground">
          <li>Your user is authenticated with valid JWT</li>
          <li>The OpenAI API key is configured and valid</li>
          <li>The edge function is accessible and properly configured</li>
        </ul>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={testConnection} 
          disabled={loading}
          className="w-full"
        >
          {loading ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Testing Connection...
            </>
          ) : (
            'Test Connection'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

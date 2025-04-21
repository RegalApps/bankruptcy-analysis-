
import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, X, AlertCircle, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const AIConnectionTest = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const testConnection = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      // First ensure we have a valid session
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        throw new Error(`Authentication error: ${sessionError.message}`);
      }
      
      if (!sessionData.session) {
        throw new Error('Not authenticated. Please log in to test the connection.');
      }
      
      console.log("Using authenticated session for connection test");
      
      // Test the OpenAI connection
      const { data, error } = await supabase.functions.invoke('process-ai-request', {
        body: { testMode: true }
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
                        OpenAI API Key: {result.debugInfo.status?.openAIKeyPresent ? 'Configured ✅' : 'Missing ❌'}
                      </li>
                      <li>
                        Authentication: {result.debugInfo.status?.authPresent ? 'Valid ✅' : 'Invalid ❌'}
                      </li>
                      <li>
                        Service Role: {result.debugInfo.status?.serviceRoleUsed ? 'Used ✅' : 'Not Used'}
                      </li>
                      <li>
                        Timestamp: {result.debugInfo.status?.timestamp || 'Not available'}
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

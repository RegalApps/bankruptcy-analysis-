
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

  const testOpenAIConnection = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      // First ensure we have a valid session
      const isAuthenticated = await checkAuthStatus();
      
      if (!isAuthenticated) {
        throw new Error('Authentication required. Please log in to test the connection.');
      }
      
      console.log("Testing OpenAI connection via edge function");
      
      // Test the OpenAI connection by sending a simple prompt
      const { data, error } = await supabase.functions.invoke('process-ai-request', {
        body: { 
          message: "Test OpenAI connection and model availability",
          module: "connection-test",
          testMode: true
        }
      });

      if (error) {
        throw new Error(`API test failed: ${error.message || JSON.stringify(error)}`);
      }

      setResult(data);
      
      if (data?.success) {
        toast({
          title: "OpenAI Connection Successful!",
          description: "The OpenAI API is configured and ready to use.",
          variant: "default"
        });
      } else {
        toast({
          variant: "destructive",
          title: "OpenAI Connection Test Failed",
          description: data.error || "Unable to connect to OpenAI API"
        });
      }
    } catch (err: any) {
      console.error("OpenAI connection test error:", err);
      setError(err.message || "An unexpected error occurred");
      toast({
        variant: "destructive",
        title: "Connection Test Failed",
        description: err.message || "Failed to test OpenAI connection"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>OpenAI Connection Test</CardTitle>
        <CardDescription>
          Verify the connection to the OpenAI API and check authentication
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
                  {result.message || 'No additional information available'}
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
                          <Clock className="h-3 w-3 mr-1" />
                          Timestamp: {result.debugInfo.status?.timestamp || 'Not available'}
                        </span>
                      </li>
                      <li>
                        <span className="inline-flex items-center">
                          <Shield className="h-3 w-3 mr-1" />
                          Model Availability: {result.debugInfo.status?.modelAvailable ? 'Available ✅' : 'Unavailable ❌'}
                        </span>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 p-4 rounded-md mb-4">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <div>
                <p className="font-medium text-red-800">Connection Error</p>
                <p className="text-sm text-red-600">{error}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={testOpenAIConnection} 
          disabled={loading}
          className="w-full"
        >
          {loading ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Testing Connection...
            </>
          ) : (
            'Test OpenAI Connection'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

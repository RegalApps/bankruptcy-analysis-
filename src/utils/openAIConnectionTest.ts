import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

/**
 * Tests OpenAI connectivity and provides detailed diagnostics
 * @returns Diagnostic results including connectivity status and error details
 */
export const testOpenAIConnection = async () => {
  console.log(`Testing OpenAI connectivity`);
  
  const results = {
    success: false,
    message: "",
    timestamp: new Date().toISOString(),
    connectionEstablished: false,
    responseReceived: false,
    details: {} as Record<string, any>,
    errors: [] as string[]
  };
  
  try {
    console.log("Calling the edge function to test OpenAI connectivity");
    
    const { data, error } = await supabase.functions.invoke('process-ai-request', {
      body: {
        message: "Test connection",
        testMode: true
      }
    });
    
    if (error) {
      console.error("Edge function error:", error);
      results.errors.push(`Edge function error: ${error.message}`);
      results.message = `Failed to connect to edge function: ${error.message}`;
      return results;
    }
    
    console.log("Edge function response:", data);
    
    results.connectionEstablished = true;
    results.details.edgeFunctionResponse = data;
    
    if (data?.success) {
      results.responseReceived = true;
      results.success = true;
      results.message = "Successfully connected to OpenAI via edge function";
    } else if (data?.error) {
      results.message = data.error;
      results.errors.push(data.error);
    }
    
    if (data?.debugInfo) {
      results.details.debugInfo = data.debugInfo;
    }
    
    return results;
    
  } catch (e: any) {
    console.error("OpenAI connection test error:", e);
    results.success = false;
    results.message = `Test failed with error: ${e.message}`;
    results.errors.push(e.message);
    return results;
  }
};

/**
 * React hook to test OpenAI connectivity with UI feedback
 */
export const useOpenAITest = () => {
  const { toast } = useToast();
  
  const runOpenAITest = async () => {
    toast({
      title: "Testing OpenAI Connection",
      description: "Please wait while we test the connection...",
    });
    
    try {
      const results = await testOpenAIConnection();
      
      if (results.success) {
        toast({
          title: "OpenAI Connection Successful",
          description: results.message,
          variant: "default",
        });
      } else {
        toast({
          title: "OpenAI Connection Failed",
          description: `${results.message}. Check console for details.`,
          variant: "destructive",
        });
        console.error("OpenAI connection test failed:", results);
      }
      
      return results;
    } catch (error: any) {
      toast({
        title: "Test Failed",
        description: `Error running test: ${error.message}`,
        variant: "destructive",
      });
      console.error("Error in OpenAI test:", error);
      return null;
    }
  };
  
  return { runOpenAITest };
};

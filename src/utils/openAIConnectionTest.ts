
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
    // Test direct API connectivity through the edge function
    console.log("Calling the edge function to test OpenAI connectivity");
    
    const { data, error } = await supabase.functions.invoke('process-ai-request', {
      body: {
        message: "This is a test to verify OpenAI connectivity.",
        testMode: true,
        documentId: null,
        module: "test",
      }
    });
    
    if (error) {
      results.errors.push(`Edge function error: ${error.message}`);
      results.message = `Failed to connect to edge function: ${error.message}`;
      return results;
    }
    
    results.connectionEstablished = true;
    results.details.edgeFunctionResponse = data;
    
    // Check if we got a response from OpenAI
    if (data && (data.response || data.parsedData)) {
      results.responseReceived = true;
      results.success = true;
      results.message = "Successfully connected to OpenAI via edge function";
    } else {
      results.message = "Edge function returned but OpenAI response is missing";
      results.errors.push("No OpenAI response in the edge function data");
    }
    
    // If there are debug info, include them
    if (data?.debugInfo) {
      results.details.debugInfo = data.debugInfo;
      
      // Check if the debug info shows OpenAI key presence
      if (data.debugInfo.status?.openAIKeyPresent === false) {
        results.errors.push("OpenAI API key is missing in the edge function");
      }
      
      // Check for OpenAI request errors
      if (data.debugInfo.errors && data.debugInfo.errors.length > 0) {
        results.errors.push(...data.debugInfo.errors);
      }
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
          variant: "success",
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

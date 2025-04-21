
import { useState } from "react";
import { useOpenAITest } from "@/utils/openAIConnectionTest";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, XCircle, ExternalLink, Globe, Key, Server, ShieldCheck, ArrowRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function AIConnectionTest() {
  const { runOpenAITest } = useOpenAITest();
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  
  const handleTest = async () => {
    setIsLoading(true);
    try {
      const testResults = await runOpenAITest();
      setResults(testResults);
    } finally {
      setIsLoading(false);
    }
  };

  const getTroubleshootingSteps = (results: any) => {
    const steps = [];
    
    if (!results.troubleshooting.networkConnectivity) {
      steps.push({
        title: "Network Connectivity Issue",
        description: "Your app cannot connect to the internet. Check your network connection and any firewall settings.",
        solution: "Verify your internet connection is working properly."
      });
    }
    
    if (!results.troubleshooting.edgeFunctionAccess) {
      steps.push({
        title: "Edge Function Access Issue",
        description: "Your app cannot connect to the Supabase Edge Function. This could be due to CORS issues or function availability.",
        solution: "Check if the process-ai-request function is deployed in your Supabase project. Also verify your Supabase configuration."
      });
    }
    
    if (!results.troubleshooting.apiKeyPresent) {
      steps.push({
        title: "OpenAI API Key Missing",
        description: "The OpenAI API key is not configured in your Supabase Edge Function.",
        solution: "Add your OpenAI API key to Supabase secrets with the name OPENAI_API_KEY."
      });
    }
    
    if (results.troubleshooting.apiKeyPresent && !results.troubleshooting.apiKeyValid) {
      steps.push({
        title: "Invalid OpenAI API Key",
        description: "Your OpenAI API key is present but appears to be invalid or expired.",
        solution: "Generate a new API key from the OpenAI dashboard and update the OPENAI_API_KEY secret in Supabase."
      });
    }
    
    if (steps.length === 0 && !results.success) {
      steps.push({
        title: "Unexpected Error",
        description: "An unexpected error occurred during the connection test.",
        solution: "Check the console logs and error details for more information."
      });
    }
    
    return steps;
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-amber-500" />
          OpenAI Connection Diagnostics
        </CardTitle>
        <CardDescription>
          Test the OpenAI connection to diagnose why document analysis might not be working
        </CardDescription>
      </CardHeader>
      <CardContent>
        {results ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-medium">Status:</span>
              {results.success ? (
                <Badge variant="success" className="bg-green-100 text-green-800 hover:bg-green-200">
                  <CheckCircle className="h-4 w-4 mr-1" /> Connected Successfully
                </Badge>
              ) : (
                <Badge variant="destructive" className="bg-red-100 text-red-800 hover:bg-red-200">
                  <XCircle className="h-4 w-4 mr-1" /> Connection Failed
                </Badge>
              )}
            </div>
            
            <div>
              <span className="font-medium">Message:</span> {results.message}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="font-medium">Edge Function:</span> 
                <Badge variant={results.connectionEstablished ? "outline" : "destructive"}>
                  {results.connectionEstablished ? "Connected" : "Failed"}
                </Badge>
              </div>
              <div>
                <span className="font-medium">OpenAI API:</span> 
                <Badge variant={results.responseReceived ? "outline" : "destructive"}>
                  {results.responseReceived ? "Responded" : "No Response"}
                </Badge>
              </div>
            </div>
            
            {!results.success && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3">Troubleshooting</h3>
                <div className="space-y-4">
                  {getTroubleshootingSteps(results).map((step, index) => (
                    <Alert key={index} className={index === 0 ? "border-red-300 bg-red-50" : "border-amber-200 bg-amber-50"}>
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <AlertTitle className="text-red-800">{step.title}</AlertTitle>
                      <AlertDescription className="mt-2">
                        <p className="text-sm text-gray-700 mb-2">{step.description}</p>
                        <div className="flex items-center text-sm font-medium text-blue-700">
                          <ArrowRight className="h-3 w-3 mr-1" /> {step.solution}
                        </div>
                      </AlertDescription>
                    </Alert>
                  ))}

                  <div className="flex flex-col gap-2 mt-3">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-700">Network Connectivity:</span>
                      <Badge variant={results.troubleshooting?.networkConnectivity ? "outline" : "destructive"} className="ml-auto">
                        {results.troubleshooting?.networkConnectivity ? "OK" : "Failed"}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2">
                      <Server className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-700">Edge Function Access:</span>
                      <Badge variant={results.troubleshooting?.edgeFunctionAccess ? "outline" : "destructive"} className="ml-auto">
                        {results.troubleshooting?.edgeFunctionAccess ? "OK" : "Failed"}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2">
                      <Key className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-700">API Key Present:</span>
                      <Badge variant={results.troubleshooting?.apiKeyPresent ? "outline" : "destructive"} className="ml-auto">
                        {results.troubleshooting?.apiKeyPresent ? "OK" : "Missing"}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-700">API Key Valid:</span>
                      <Badge variant={results.troubleshooting?.apiKeyValid ? "outline" : "destructive"} className="ml-auto">
                        {results.troubleshooting?.apiKeyValid ? "Valid" : "Invalid"}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-medium mb-2">Common Solutions:</h4>
                  <ul className="list-disc pl-5 space-y-2 text-sm">
                    <li>
                      <span className="text-gray-700">
                        Verify OpenAI API key is correctly set as a <code className="bg-gray-100 px-1 py-0.5 rounded">OPENAI_API_KEY</code> secret in your Supabase project
                      </span>
                    </li>
                    <li>
                      <span className="text-gray-700">
                        Check if your OpenAI account has billing configured and sufficient credits
                      </span>
                    </li>
                    <li>
                      <span className="text-gray-700">
                        Ensure the process-ai-request edge function is deployed properly
                      </span>
                    </li>
                    <li>
                      <span className="text-gray-700">
                        Generate a new API key from OpenAI and update the secret
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            )}
            
            {results.errors && results.errors.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium text-red-600 mb-1">Errors Detected:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {results.errors.map((error: string, index: number) => (
                    <li key={index} className="text-sm text-red-600">{error}</li>
                  ))}
                </ul>
              </div>
            )}
            
            <Separator />
            
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger>Advanced Debug Information</AccordionTrigger>
                <AccordionContent>
                  <div className="bg-muted p-3 rounded-md overflow-auto max-h-60">
                    <pre className="text-xs">{JSON.stringify(results.details, null, 2)}</pre>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            Click the button below to test OpenAI connectivity
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col gap-3">
        <Button onClick={handleTest} disabled={isLoading} className="w-full">
          {isLoading ? "Testing Connection..." : "Test OpenAI Connection"}
        </Button>
        
        {results && !results.success && (
          <div className="text-xs text-center text-gray-600 w-full">
            <a 
              href="https://supabase.com/dashboard/project/plxuyxacefgttimodrbp/functions/process-ai-request/logs"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1 text-blue-600 hover:underline"
            >
              <ExternalLink className="h-3 w-3" /> View Edge Function Logs
            </a>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}

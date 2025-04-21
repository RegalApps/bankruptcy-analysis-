
import { useState } from "react";
import { useOpenAITest } from "@/utils/openAIConnectionTest";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";

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
            
            <div>
              <h4 className="font-medium mb-1">Debug Information:</h4>
              <div className="bg-muted p-3 rounded-md overflow-auto max-h-40">
                <pre className="text-xs">{JSON.stringify(results.details, null, 2)}</pre>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            Click the button below to test OpenAI connectivity
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleTest} disabled={isLoading} className="w-full">
          {isLoading ? "Testing Connection..." : "Test OpenAI Connection"}
        </Button>
      </CardFooter>
    </Card>
  );
}

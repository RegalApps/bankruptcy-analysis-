
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  Clock, 
  FileSearch 
} from "lucide-react";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { runDocumentDiagnostics, repairDocumentIssues } from "@/utils/diagnostics/documentDiagnostics";
import { useToast } from "@/hooks/use-toast";

interface DocumentDiagnosticsProps {
  documentId: string;
  onDiagnosticsComplete?: () => void;
}

export const DocumentDiagnostics = ({ documentId, onDiagnosticsComplete }: DocumentDiagnosticsProps) => {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [repairResults, setRepairResults] = useState<any>(null);
  const { toast } = useToast();

  const runDiagnostics = async () => {
    if (!documentId) return;
    
    setIsRunning(true);
    setResults(null);
    setErrors([]);
    setRepairResults(null);
    
    try {
      const diagnosticResults = await runDocumentDiagnostics(documentId);
      setResults(diagnosticResults.results);
      setErrors(diagnosticResults.errors);
      
      if (onDiagnosticsComplete) {
        onDiagnosticsComplete();
      }
      
      toast({
        title: diagnosticResults.success ? "Diagnostics Completed" : "Issues Detected",
        description: diagnosticResults.success 
          ? "Document appears to be in good health" 
          : `Found ${diagnosticResults.errors.length} issue(s)`,
        variant: diagnosticResults.success ? "default" : "destructive"
      });
    } catch (error: any) {
      setErrors([`Diagnostics failed: ${error.message}`]);
      
      toast({
        title: "Diagnostics Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsRunning(false);
    }
  };
  
  const attemptRepair = async () => {
    if (!documentId) return;
    
    setIsRunning(true);
    setRepairResults(null);
    
    try {
      const repair = await repairDocumentIssues(documentId);
      setRepairResults(repair);
      
      toast({
        title: repair.success ? "Repair Completed" : "Repair Issues",
        description: repair.success 
          ? `Completed ${repair.actions.length} repair action(s)` 
          : `Encountered ${repair.errors.length} issue(s) during repair`,
        variant: repair.success ? "default" : "destructive"
      });
      
      if (repair.success && onDiagnosticsComplete) {
        onDiagnosticsComplete();
      }
    } catch (error: any) {
      toast({
        title: "Repair Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-2">
        <Button
          onClick={runDiagnostics}
          disabled={isRunning}
          className="flex items-center gap-2"
        >
          {isRunning ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <FileSearch className="h-4 w-4" />
          )}
          Run Diagnostics
        </Button>
        
        {errors.length > 0 && (
          <Button
            onClick={attemptRepair}
            disabled={isRunning}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Attempt Repair
          </Button>
        )}
      </div>
      
      {errors.length > 0 && (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="font-medium mb-2">
              Found {errors.length} issue(s):
            </div>
            <ul className="list-disc pl-5 space-y-1">
              {errors.map((error, i) => (
                <li key={i} className="text-sm">{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}
      
      {results && (
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="document">
            <AccordionTrigger className="font-medium">
              Document Record
              {results.documentRecord ? (
                <Badge variant="outline" className="ml-2 bg-green-50">
                  <CheckCircle2 className="h-3 w-3 mr-1 text-green-500" />
                  Found
                </Badge>
              ) : (
                <Badge variant="outline" className="ml-2 bg-red-50">
                  <XCircle className="h-3 w-3 mr-1 text-red-500" />
                  Missing
                </Badge>
              )}
            </AccordionTrigger>
            <AccordionContent>
              {results.documentRecord ? (
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium">ID:</span> {results.documentRecord.id}</div>
                  <div><span className="font-medium">Title:</span> {results.documentRecord.title}</div>
                  <div><span className="font-medium">Storage Path:</span> {results.documentRecord.storage_path}</div>
                  <div><span className="font-medium">AI Processing Status:</span> {results.documentRecord.ai_processing_status}</div>
                </div>
              ) : (
                <div className="text-muted-foreground text-sm">
                  Document record not found in database
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
          
          {results.storage && (
            <AccordionItem value="storage">
              <AccordionTrigger className="font-medium">
                Storage Access
                {results.storage.accessible ? (
                  <Badge variant="outline" className="ml-2 bg-green-50">
                    <CheckCircle2 className="h-3 w-3 mr-1 text-green-500" />
                    Accessible
                  </Badge>
                ) : (
                  <Badge variant="outline" className="ml-2 bg-red-50">
                    <XCircle className="h-3 w-3 mr-1 text-red-500" />
                    Inaccessible
                  </Badge>
                )}
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium">Public URL:</span> {results.storage.publicUrl}</div>
                  <div><span className="font-medium">Status Code:</span> {results.storage.statusCode}</div>
                  <div><span className="font-medium">Fetch Time:</span> {results.storage.fetchTime}</div>
                </div>
              </AccordionContent>
            </AccordionItem>
          )}
          
          {results.analysis && (
            <AccordionItem value="analysis">
              <AccordionTrigger className="font-medium">
                Analysis Status
                {results.analysis.minutesSinceLastUpdate > 5 ? (
                  <Badge variant="outline" className="ml-2 bg-amber-50">
                    <Clock className="h-3 w-3 mr-1 text-amber-500" />
                    Potentially Stuck
                  </Badge>
                ) : (
                  <Badge variant="outline" className="ml-2 bg-blue-50">
                    <RefreshCw className="h-3 w-3 mr-1 text-blue-500" />
                    Processing
                  </Badge>
                )}
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium">Status:</span> {results.analysis.status}</div>
                  <div><span className="font-medium">Steps Completed:</span> {results.analysis.stepsCompleted}</div>
                  <div><span className="font-medium">Last Update:</span> {results.analysis.lastUpdateTime}</div>
                  <div><span className="font-medium">Minutes Since Update:</span> {results.analysis.minutesSinceLastUpdate}</div>
                </div>
              </AccordionContent>
            </AccordionItem>
          )}
          
          {repairResults && (
            <AccordionItem value="repair">
              <AccordionTrigger className="font-medium">
                Repair Results
                {repairResults.success ? (
                  <Badge variant="outline" className="ml-2 bg-green-50">
                    <CheckCircle2 className="h-3 w-3 mr-1 text-green-500" />
                    Successful
                  </Badge>
                ) : (
                  <Badge variant="outline" className="ml-2 bg-red-50">
                    <XCircle className="h-3 w-3 mr-1 text-red-500" />
                    Failed
                  </Badge>
                )}
              </AccordionTrigger>
              <AccordionContent>
                {repairResults.actions.length > 0 ? (
                  <div className="space-y-2">
                    <div className="font-medium text-sm">Actions Taken:</div>
                    <ul className="list-disc pl-5 space-y-1">
                      {repairResults.actions.map((action: string, i: number) => (
                        <li key={i} className="text-sm">{action}</li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="text-muted-foreground text-sm">
                    No repair actions were taken
                  </div>
                )}
                
                {repairResults.errors.length > 0 && (
                  <div className="space-y-2 mt-4">
                    <div className="font-medium text-sm">Repair Errors:</div>
                    <ul className="list-disc pl-5 space-y-1">
                      {repairResults.errors.map((error: string, i: number) => (
                        <li key={i} className="text-sm">{error}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          )}
          
          <AccordionItem value="diagnostics">
            <AccordionTrigger className="font-medium">
              Diagnostic Performance
            </AccordionTrigger>
            <AccordionContent>
              <div className="text-sm">
                <div><span className="font-medium">Duration:</span> {results.diagnosticsDuration}</div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
    </div>
  );
};

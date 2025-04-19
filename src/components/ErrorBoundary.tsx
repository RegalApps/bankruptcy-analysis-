
import React, { Component, ErrorInfo, ReactNode } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";
import { ensureStorageBuckets } from "@/utils/storage/bucketManager";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  isRepairAttempted: boolean;
  repairSuccessful: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    isRepairAttempted: false,
    repairSuccessful: false
  };

  public static getDerivedStateFromError(error: Error): Pick<State, "hasError"> {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({
      error,
      errorInfo
    });
    
    // Log error to console
    console.error("Error caught by boundary:", error, errorInfo);
  }
  
  private attemptRepair = async () => {
    this.setState({ isRepairAttempted: true });
    
    try {
      // Check if error is storage related
      const isStorageError = 
        this.state.error?.message.includes("storage") ||
        this.state.error?.message.includes("bucket") ||
        this.state.error?.message.toLowerCase().includes("upload");
        
      // If storage related, try to ensure buckets
      if (isStorageError) {
        const success = await ensureStorageBuckets();
        this.setState({ repairSuccessful: success });
      }
    } catch (repairError) {
      console.error("Repair failed:", repairError);
    }
  };

  private resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      isRepairAttempted: false,
      repairSuccessful: false
    });
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      // Determine if this might be storage related
      const isStorageError = 
        this.state.error?.message.includes("storage") ||
        this.state.error?.message.includes("bucket") ||
        this.state.error?.message.toLowerCase().includes("upload");
        
      return (
        <Card className="w-full max-w-md mx-auto mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              An Error Occurred
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {this.state.error?.message || "An unexpected error occurred in the application."}
              </p>
              
              {isStorageError && !this.state.isRepairAttempted && (
                <div className="text-sm bg-amber-50 border border-amber-200 p-3 rounded-md">
                  This appears to be related to the storage system. Would you like to attempt a repair?
                </div>
              )}
              
              {this.state.isRepairAttempted && (
                <div className={`text-sm p-3 rounded-md ${
                  this.state.repairSuccessful 
                    ? "bg-green-50 border border-green-200" 
                    : "bg-red-50 border border-red-200"
                }`}>
                  {this.state.repairSuccessful 
                    ? "Repair successful! Try again." 
                    : "Repair attempt failed. Please reload the application."}
                </div>
              )}
              
              <details className="text-xs mt-4">
                <summary className="cursor-pointer text-muted-foreground">Technical Details</summary>
                <pre className="bg-muted p-4 mt-2 rounded-md overflow-x-auto">
                  {this.state.error?.stack || "No error stack available"}
                </pre>
              </details>
            </div>
          </CardContent>
          <CardFooter className="flex gap-2 justify-end">
            {isStorageError && !this.state.isRepairAttempted && (
              <Button onClick={this.attemptRepair} variant="outline">
                Attempt Repair
              </Button>
            )}
            <Button onClick={() => window.location.reload()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Reload Application
            </Button>
            <Button onClick={this.resetError} variant="default">
              Try Again
            </Button>
          </CardFooter>
        </Card>
      );
    }

    return this.props.children;
  }
}

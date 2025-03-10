
import { AlertCircle, Users, Search, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle,
  CardDescription 
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface ClientNotFoundProps {
  onBack: () => void;
}

export const ClientNotFound = ({ onBack }: ClientNotFoundProps) => {
  return (
    <Card className="mx-auto max-w-3xl">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2 mb-2">
          <AlertCircle className="h-5 w-5 text-destructive" />
          <CardTitle>Client Not Found</CardTitle>
        </div>
        <CardDescription>
          The client information could not be found or might have been removed.
        </CardDescription>
      </CardHeader>
      
      <Separator />
      
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 space-y-4">
            <div className="rounded-lg bg-muted p-6 text-center flex flex-col items-center">
              <div className="rounded-full bg-background p-3 mb-3">
                <Users className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">Client Viewer</h3>
              <p className="text-sm text-muted-foreground mb-4">
                The client viewer shows important information about your clients and all associated documents in one place.
              </p>
            </div>
            
            <Alert>
              <AlertTitle>Suggested Actions</AlertTitle>
              <AlertDescription className="mt-2 space-y-2">
                <p>• Verify that the client ID is correct</p>
                <p>• Check if the client has been removed from the system</p>
                <p>• Try searching for the client by name instead</p>
              </AlertDescription>
            </Alert>
          </div>
          
          <div className="flex-1 space-y-4">
            <div className="rounded-lg border p-6">
              <h3 className="text-lg font-medium mb-3">Client Viewer Layout</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <div className="h-5 w-5 rounded-full bg-green-500 flex-shrink-0 mt-0.5"></div>
                  <div>
                    <p className="font-medium">Left Panel</p>
                    <p className="text-muted-foreground">Client information and document tree</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <div className="h-5 w-5 rounded-full bg-amber-500 flex-shrink-0 mt-0.5"></div>
                  <div>
                    <p className="font-medium">Middle Panel</p>
                    <p className="text-muted-foreground">Client files hub and management</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <div className="h-5 w-5 rounded-full bg-blue-500 flex-shrink-0 mt-0.5"></div>
                  <div>
                    <p className="font-medium">Right Panel</p>
                    <p className="text-muted-foreground">File preview and collaboration</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="rounded-lg border border-dashed p-6 flex items-center justify-center gap-3">
              <Search className="h-5 w-5 text-muted-foreground" />
              <span className="text-muted-foreground">Try searching for a client in the main dashboard</span>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between border-t pt-6">
        <Button variant="outline" onClick={onBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Go Back
        </Button>
        <Button onClick={() => window.location.href = "/"}>Go to Dashboard</Button>
      </CardFooter>
    </Card>
  );
};

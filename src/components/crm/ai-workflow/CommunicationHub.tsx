
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { MessageSquare, Mail, Phone, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AICommunication } from "@/pages/SAFA/components/ClientConnect/AICommunication";

interface CommunicationHubProps {
  clientId?: string;
}

export const CommunicationHub = ({ clientId }: CommunicationHubProps) => {
  return (
    <div className="space-y-4">
      <Alert className="bg-blue-50 border-blue-100">
        <MessageSquare className="h-4 w-4 text-blue-500" />
        <AlertTitle>AI-Driven Communication Hub</AlertTitle>
        <AlertDescription>
          {clientId 
            ? `Streamline communication with client #${clientId} using AI-generated templates.` 
            : "Select a client to start communication workflows."}
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="col-span-1 md:col-span-3">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Communication Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                <div className="bg-green-100 p-2 rounded-full">
                  <Mail className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Email Engagement</p>
                  <p className="text-2xl font-bold">87%</p>
                  <p className="text-xs text-muted-foreground">Open rate this month</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-lg">
                <div className="bg-amber-100 p-2 rounded-full">
                  <Clock className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Response Time</p>
                  <p className="text-2xl font-bold">4.2 hrs</p>
                  <p className="text-xs text-muted-foreground">Average client response</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Phone className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Call Efficiency</p>
                  <p className="text-2xl font-bold">12 min</p>
                  <p className="text-xs text-muted-foreground">Average call length</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <AICommunication />
    </div>
  );
};

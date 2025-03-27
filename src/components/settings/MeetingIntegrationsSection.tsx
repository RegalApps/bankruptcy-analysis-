
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Video, Link, Slack, Link2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Integration {
  id: string;
  name: string;
  icon: React.ReactNode;
  connected: boolean;
  description: string;
}

export const MeetingIntegrationsSection = () => {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [apiKey, setApiKey] = useState("");
  const [clientId, setClientId] = useState("");
  
  const videoIntegrations: Integration[] = [
    {
      id: "google-meet",
      name: "Google Meet",
      icon: <Video className="h-5 w-5" />,
      connected: false,
      description: "Connect to Google Meet for video conferencing"
    },
    {
      id: "zoom",
      name: "Zoom",
      icon: <Video className="h-5 w-5" />,
      connected: false,
      description: "Connect to Zoom for video conferencing"
    },
    {
      id: "teamviewer",
      name: "TeamViewer",
      icon: <Link2 className="h-5 w-5" />,
      connected: false,
      description: "Connect to TeamViewer for remote support"
    }
  ];
  
  const messageIntegrations: Integration[] = [
    {
      id: "slack",
      name: "Slack",
      icon: <Slack className="h-5 w-5" />,
      connected: false,
      description: "Connect to Slack for messaging"
    }
  ];
  
  const handleConnect = (integration: Integration) => {
    setSelectedIntegration(integration);
    setDialogOpen(true);
  };
  
  const handleSaveIntegration = () => {
    if (apiKey.trim() === "" || clientId.trim() === "") {
      toast({
        title: "Missing Information",
        description: "Please provide both API Key and Client ID",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Integration Connected",
      description: `Successfully connected to ${selectedIntegration?.name}`,
    });
    
    setDialogOpen(false);
    setApiKey("");
    setClientId("");
  };
  
  const renderIntegrationCards = (integrations: Integration[]) => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {integrations.map((integration) => (
          <Card key={integration.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 rounded-md bg-primary/10 text-primary">
                    {integration.icon}
                  </div>
                  <CardTitle className="text-lg">{integration.name}</CardTitle>
                </div>
                <div className={`text-xs px-2 py-1 rounded-full ${integration.connected ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'}`}>
                  {integration.connected ? 'Connected' : 'Not Connected'}
                </div>
              </div>
              <CardDescription className="mt-2">{integration.description}</CardDescription>
            </CardHeader>
            <CardFooter className="pt-2">
              <Button 
                variant={integration.connected ? "outline" : "default"} 
                className="w-full"
                onClick={() => handleConnect(integration)}
              >
                {integration.connected ? 'Manage Connection' : 'Connect'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Meeting Integrations</h2>
      <p className="text-muted-foreground">Configure third-party meeting services for video conferencing and messaging</p>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-4">Video Conferencing</h3>
          {renderIntegrationCards(videoIntegrations)}
        </div>
        
        <div className="mt-8">
          <h3 className="text-lg font-medium mb-4">Messaging</h3>
          {renderIntegrationCards(messageIntegrations)}
        </div>
      </div>
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Connect to {selectedIntegration?.name}</DialogTitle>
            <DialogDescription>
              Enter your API credentials to connect to {selectedIntegration?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="api-key">API Key</Label>
              <Input
                id="api-key"
                type="password"
                placeholder="Enter your API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="client-id">Client ID</Label>
              <Input
                id="client-id"
                placeholder="Enter your client ID"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveIntegration}>Connect</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

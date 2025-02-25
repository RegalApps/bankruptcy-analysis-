
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { APIIntegration, IntegrationProvider } from "./types";
import { supabase } from "@/lib/supabase";
import { Plus, RefreshCw, Check, X } from "lucide-react";

const AVAILABLE_INTEGRATIONS: IntegrationProvider[] = [
  {
    id: "mailchimp",
    name: "Mailchimp",
    description: "Email marketing automation",
    icon: "M",
    category: "marketing",
    requiredFields: [
      {
        name: "api_key",
        label: "API Key",
        type: "password"
      }
    ]
  },
  {
    id: "slack",
    name: "Slack",
    description: "Team communication platform",
    icon: "S",
    category: "communication",
    requiredFields: [
      {
        name: "api_key",
        label: "Bot Token",
        type: "password"
      }
    ]
  },
  {
    id: "docusign",
    name: "DocuSign",
    description: "Digital document signing",
    icon: "D",
    category: "legal",
    requiredFields: [
      {
        name: "api_key",
        label: "Integration Key",
        type: "password"
      }
    ]
  }
];

export const IntegrationsSection = () => {
  const [activeIntegrations, setActiveIntegrations] = useState<APIIntegration[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<IntegrationProvider | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const { toast } = useToast();

  useEffect(() => {
    fetchIntegrations();
  }, []);

  const fetchIntegrations = async () => {
    try {
      const { data, error } = await supabase
        .from('api_integrations')
        .select('*');

      if (error) throw error;
      setActiveIntegrations(data || []);
    } catch (error) {
      console.error('Error fetching integrations:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load integrations.",
      });
    }
  };

  const handleIntegrationSetup = async () => {
    if (!selectedProvider) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('api_integrations')
        .insert({
          provider_name: selectedProvider.id,
          api_key: formData.api_key,
          status: 'pending',
          settings: formData
        })
        .select()
        .single();

      if (error) throw error;

      setActiveIntegrations([...activeIntegrations, data]);
      toast({
        title: "Integration Added",
        description: `${selectedProvider.name} has been successfully integrated.`,
      });

      // Reset form
      setSelectedProvider(null);
      setFormData({});
    } catch (error) {
      console.error('Error setting up integration:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to setup integration.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderIntegrationCard = (integration: APIIntegration) => {
    const provider = AVAILABLE_INTEGRATIONS.find(p => p.id === integration.provider_name);
    if (!provider) return null;

    return (
      <Card key={integration.id} className="mb-4">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">
            {provider.name}
            <Badge 
              variant={integration.status === 'active' ? "default" : "secondary"}
              className="ml-2"
            >
              {integration.status}
            </Badge>
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => fetchIntegrations()}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{provider.description}</p>
          <div className="mt-2 flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              Last synced: {integration.last_sync_at ? new Date(integration.last_sync_at).toLocaleString() : 'Never'}
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">API Integrations</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Integration
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Integration</DialogTitle>
            </DialogHeader>
            <Tabs defaultValue="communication" className="mt-4">
              <TabsList className="grid grid-cols-4 w-full">
                <TabsTrigger value="communication">Communication</TabsTrigger>
                <TabsTrigger value="compliance">Compliance</TabsTrigger>
                <TabsTrigger value="legal">Legal</TabsTrigger>
                <TabsTrigger value="marketing">Marketing</TabsTrigger>
              </TabsList>

              {Object.entries(
                AVAILABLE_INTEGRATIONS.reduce((acc, provider) => {
                  if (!acc[provider.category]) acc[provider.category] = [];
                  acc[provider.category].push(provider);
                  return acc;
                }, {} as Record<string, IntegrationProvider[]>)
              ).map(([category, providers]) => (
                <TabsContent key={category} value={category} className="space-y-4">
                  {providers.map((provider) => (
                    <Card
                      key={provider.id}
                      className={`cursor-pointer transition-all ${
                        selectedProvider?.id === provider.id ? 'ring-2 ring-primary' : ''
                      }`}
                      onClick={() => setSelectedProvider(provider)}
                    >
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">
                          {provider.name}
                        </CardTitle>
                        {selectedProvider?.id === provider.id && (
                          <Check className="h-4 w-4 text-primary" />
                        )}
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          {provider.description}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>
              ))}

              {selectedProvider && (
                <div className="mt-4 space-y-4">
                  {selectedProvider.requiredFields.map((field) => (
                    <div key={field.name} className="space-y-2">
                      <Label htmlFor={field.name}>{field.label}</Label>
                      <Input
                        id={field.name}
                        type={field.type}
                        value={formData[field.name] || ''}
                        onChange={(e) =>
                          setFormData({ ...formData, [field.name]: e.target.value })
                        }
                      />
                    </div>
                  ))}
                  <Button
                    className="w-full"
                    onClick={handleIntegrationSetup}
                    disabled={isLoading}
                  >
                    {isLoading ? "Setting up..." : "Setup Integration"}
                  </Button>
                </div>
              )}
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {activeIntegrations.map(renderIntegrationCard)}
      </div>
    </div>
  );
};

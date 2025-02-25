import { useState } from "react";
import { IntegrationProvider } from "../types";
import { AVAILABLE_INTEGRATIONS } from "../constants";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Check } from "lucide-react";

interface AddIntegrationDialogProps {
  onSetup: (provider: IntegrationProvider, formData: Record<string, string>) => Promise<void>;
  isLoading: boolean;
}

export const AddIntegrationDialog = ({ onSetup, isLoading }: AddIntegrationDialogProps) => {
  const [selectedProvider, setSelectedProvider] = useState<IntegrationProvider | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});

  const handleSetup = async () => {
    if (!selectedProvider) return;
    await onSetup(selectedProvider, formData);
    setSelectedProvider(null);
    setFormData({});
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Integration
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Add New Integration</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="communication" className="mt-4">
          <TabsList className="grid grid-cols-6 w-full">
            <TabsTrigger value="communication">Communication</TabsTrigger>
            <TabsTrigger value="document">Document</TabsTrigger>
            <TabsTrigger value="legal">Legal</TabsTrigger>
            <TabsTrigger value="productivity">Productivity</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="other">Other</TabsTrigger>
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
                    <p className="text-sm text-muted-foreground mb-4">
                      {provider.description}
                    </p>
                    {INTEGRATION_FEATURES[provider.id as keyof typeof INTEGRATION_FEATURES] && (
                      <div className="text-xs text-muted-foreground">
                        <strong>Key Features:</strong>
                        <ul className="list-disc list-inside mt-1">
                          {INTEGRATION_FEATURES[provider.id as keyof typeof INTEGRATION_FEATURES]
                            .slice(0, 2)
                            .map((feature, index) => (
                              <li key={index}>{feature}</li>
                            ))}
                        </ul>
                      </div>
                    )}
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
                onClick={handleSetup}
                disabled={isLoading}
              >
                {isLoading ? "Setting up..." : "Setup Integration"}
              </Button>
            </div>
          )}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

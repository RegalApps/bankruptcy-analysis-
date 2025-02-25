
import { useState } from "react";
import { IntegrationProvider } from "../types";
import { AVAILABLE_INTEGRATIONS, INTEGRATION_FEATURES } from "../constants";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface AddIntegrationDialogProps {
  onSetup: (provider: IntegrationProvider, formData: Record<string, string>) => Promise<void>;
  isLoading: boolean;
}

export const AddIntegrationDialog = ({ onSetup, isLoading }: AddIntegrationDialogProps) => {
  const [selectedProvider, setSelectedProvider] = useState<IntegrationProvider | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [comment, setComment] = useState("");

  const handleSetup = async () => {
    if (!selectedProvider) return;
    await onSetup(selectedProvider, { ...formData, comment });
    setSelectedProvider(null);
    setFormData({});
    setComment("");
  };

  // Group integrations by category
  const groupedIntegrations = AVAILABLE_INTEGRATIONS.reduce((acc, provider) => {
    if (!acc[provider.category]) acc[provider.category] = [];
    acc[provider.category].push(provider);
    return acc;
  }, {} as Record<string, IntegrationProvider[]>);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Integration
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Integration</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="integration-type">Integration Type</Label>
            <Select 
              onValueChange={(value) => {
                const provider = AVAILABLE_INTEGRATIONS.find(p => p.id === value);
                setSelectedProvider(provider || null);
              }}
              value={selectedProvider?.id}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an integration" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(groupedIntegrations).map(([category, providers]) => (
                  <div key={category}>
                    <div className="text-xs text-muted-foreground px-2 py-1.5 uppercase">
                      {category}
                    </div>
                    {providers.map((provider) => (
                      <SelectItem key={provider.id} value={provider.id}>
                        {provider.name}
                      </SelectItem>
                    ))}
                  </div>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedProvider && (
            <>
              <Card className="p-4">
                <h4 className="font-medium mb-2">{selectedProvider.description}</h4>
                {INTEGRATION_FEATURES[selectedProvider.id as keyof typeof INTEGRATION_FEATURES] && (
                  <ul className="list-disc list-inside text-sm text-muted-foreground">
                    {INTEGRATION_FEATURES[selectedProvider.id as keyof typeof INTEGRATION_FEATURES]
                      .map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                  </ul>
                )}
              </Card>

              <div className="space-y-4">
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="comment">Comment (Optional)</Label>
                <Textarea
                  id="comment"
                  placeholder="Add any notes or comments about this integration..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="min-h-[80px]"
                />
              </div>

              <Button
                className="w-full"
                onClick={handleSetup}
                disabled={isLoading}
              >
                {isLoading ? "Setting up..." : "Save Integration"}
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

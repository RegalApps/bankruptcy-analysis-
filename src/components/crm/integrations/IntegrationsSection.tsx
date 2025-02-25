
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { APIIntegration, IntegrationProvider } from "./types";
import { IntegrationCard } from "./components/IntegrationCard";
import { AddIntegrationDialog } from "./components/AddIntegrationDialog";

export const IntegrationsSection = () => {
  const [activeIntegrations, setActiveIntegrations] = useState<APIIntegration[]>([]);
  const [isLoading, setIsLoading] = useState(false);
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

  const handleIntegrationSetup = async (
    provider: IntegrationProvider,
    formData: Record<string, string>
  ) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('api_integrations')
        .insert({
          provider_name: provider.id,
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
        description: `${provider.name} has been successfully integrated.`,
      });
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

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">API Integrations</h2>
        <AddIntegrationDialog onSetup={handleIntegrationSetup} isLoading={isLoading} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {activeIntegrations.map((integration) => (
          <IntegrationCard
            key={integration.id}
            integration={integration}
            onRefresh={fetchIntegrations}
          />
        ))}
      </div>
    </div>
  );
};

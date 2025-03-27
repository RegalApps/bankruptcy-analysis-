
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Smartphone, RefreshCw, Lock } from "lucide-react";
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel
} from "@/components/ui/form";
import { useState } from "react";
import { toast } from "sonner";

// Define the form schema
const securityFormSchema = z.object({
  twoFactorEnabled: z.boolean().default(false),
  sessionTimeout: z.boolean().default(true),
  deviceManagement: z.boolean().default(true),
});

type SecurityFormValues = z.infer<typeof securityFormSchema>;

export const SecuritySettingsSection = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Initialize the form with React Hook Form
  const form = useForm<SecurityFormValues>({
    resolver: zodResolver(securityFormSchema),
    defaultValues: {
      twoFactorEnabled: false,
      sessionTimeout: true,
      deviceManagement: true,
    },
  });

  // Handle form submission
  const onSubmit = async (data: SecurityFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success message
      toast.success("Security settings updated successfully");
      console.log("Security settings saved:", data);
    } catch (error) {
      toast.error("Failed to update security settings");
      console.error("Error saving security settings:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            Security Settings
          </CardTitle>
          <CardDescription>
            Configure additional security measures for your account
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 pt-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="twoFactorEnabled"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between space-y-0">
                  <div className="space-y-0.5">
                    <FormLabel className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4 text-muted-foreground" />
                      Two-Factor Authentication
                    </FormLabel>
                    <FormDescription>
                      Add an extra layer of security to your account
                    </FormDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <FormControl>
                      <Switch 
                        checked={field.value} 
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <Button 
                      variant="outline" 
                      size="sm"
                      type="button"
                      disabled={!field.value}
                      onClick={() => {
                        toast.info("2FA setup wizard would open here");
                      }}
                    >
                      Setup
                    </Button>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sessionTimeout"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between space-y-0">
                  <div className="space-y-0.5">
                    <FormLabel className="flex items-center gap-2">
                      <RefreshCw className="h-4 w-4 text-muted-foreground" />
                      Auto Session Timeout
                    </FormLabel>
                    <FormDescription>
                      Automatically log out after 30 minutes of inactivity
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch 
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-muted-foreground" />
                  Device Management
                </Label>
                <p className="text-sm text-muted-foreground">
                  View and manage devices that have access to your account
                </p>
              </div>
              <Button variant="outline" size="sm" type="button" onClick={() => {
                toast.info("Device management dashboard would open here");
              }}>
                Manage Devices
              </Button>
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Settings"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

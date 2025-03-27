
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel
} from "@/components/ui/form";
import { 
  MapPin, 
  History, 
  ShieldAlert, 
  X, 
  Plus,
  AlertTriangle
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

// Define the login history type
interface LoginHistoryItem {
  id: string;
  timestamp: number;
  device: string;
  browser: string;
  location: string;
  ip: string;
  status: "success" | "failed";
}

// Define the form schema for location restrictions
const locationRestrictionSchema = z.object({
  enableLocationRestriction: z.boolean().default(false),
  allowedLocations: z.array(
    z.object({
      id: z.string(),
      name: z.string().min(1, "Location name is required"),
      ip_range: z.string().optional(),
    })
  ).default([]),
});

type LocationRestrictionValues = z.infer<typeof locationRestrictionSchema>;

export const AdvancedSecuritySection = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loginHistory, setLoginHistory] = useState<LoginHistoryItem[]>([]);
  const [isAddingLocation, setIsAddingLocation] = useState(false);
  const [newLocation, setNewLocation] = useState({ name: "", ip_range: "" });

  // Initialize the form with react-hook-form
  const form = useForm<LocationRestrictionValues>({
    resolver: zodResolver(locationRestrictionSchema),
    defaultValues: {
      enableLocationRestriction: false,
      allowedLocations: [],
    },
  });

  const watchLocationRestriction = form.watch("enableLocationRestriction");
  const allowedLocations = form.watch("allowedLocations");

  // Fetch login history
  useEffect(() => {
    const fetchLoginHistory = async () => {
      setIsLoading(true);
      try {
        // In a real implementation, this would fetch from Supabase
        // For now we'll simulate with mock data
        const mockLoginHistory: LoginHistoryItem[] = [
          {
            id: "1",
            timestamp: Date.now() - 1000 * 60 * 5, // 5 minutes ago
            device: "Desktop",
            browser: "Chrome on Windows",
            location: "New York, USA",
            ip: "192.168.1.1",
            status: "success"
          },
          {
            id: "2",
            timestamp: Date.now() - 1000 * 60 * 60 * 2, // 2 hours ago
            device: "Mobile",
            browser: "Safari on iPhone",
            location: "Toronto, Canada",
            ip: "192.168.1.2",
            status: "success"
          },
          {
            id: "3",
            timestamp: Date.now() - 1000 * 60 * 60 * 24, // 1 day ago
            device: "Tablet",
            browser: "Firefox on iPad",
            location: "Unknown",
            ip: "192.168.1.3",
            status: "failed"
          }
        ];
        
        setLoginHistory(mockLoginHistory);
      } catch (error) {
        console.error("Error fetching login history:", error);
        toast.error("Failed to load login history");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLoginHistory();
  }, []);

  // Format the login timestamp
  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  // Handle form submission
  const onSubmit = async (data: LocationRestrictionValues) => {
    setIsLoading(true);
    
    try {
      // In a real implementation, this would save to Supabase
      console.log("Location restrictions saved:", data);
      
      toast.success("Security settings updated successfully");
    } catch (error) {
      console.error("Error saving location restrictions:", error);
      toast.error("Failed to update security settings");
    } finally {
      setIsLoading(false);
    }
  };

  // Add a new location to the allowed locations list
  const handleAddLocation = () => {
    if (newLocation.name.trim() === "") {
      toast.error("Location name is required");
      return;
    }

    const updatedLocations = [
      ...allowedLocations,
      {
        id: crypto.randomUUID(),
        name: newLocation.name,
        ip_range: newLocation.ip_range,
      },
    ];

    form.setValue("allowedLocations", updatedLocations);
    setNewLocation({ name: "", ip_range: "" });
    setIsAddingLocation(false);
    toast.success(`Added ${newLocation.name} to allowed locations`);
  };

  // Remove a location from the allowed locations list
  const handleRemoveLocation = (id: string) => {
    const updatedLocations = allowedLocations.filter(location => location.id !== id);
    form.setValue("allowedLocations", updatedLocations);
  };

  return (
    <div className="space-y-6">
      {/* Login History Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5 text-primary" />
              Login History
            </CardTitle>
            <CardDescription>
              Review recent account activity and login attempts
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>Device</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loginHistory.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{formatTimestamp(item.timestamp)}</TableCell>
                    <TableCell>{item.browser}</TableCell>
                    <TableCell>{item.location}</TableCell>
                    <TableCell>{item.ip}</TableCell>
                    <TableCell>
                      {item.status === "success" ? (
                        <Badge className="bg-green-500 hover:bg-green-600">Success</Badge>
                      ) : (
                        <Badge variant="destructive">Failed</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {loginHistory.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                      No login history available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            disabled={isLoading}
            onClick={() => toast.info("This would download the complete login history")}
          >
            Download Full History
          </Button>
        </CardContent>
      </Card>

      {/* Location-based Access Restrictions */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Location-based Restrictions
            </CardTitle>
            <CardDescription>
              Control access to your account based on geographic location
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="enableLocationRestriction"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between space-y-0 rounded-md border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="flex items-center gap-2">
                        <ShieldAlert className="h-4 w-4 text-muted-foreground" />
                        Enable Location Restrictions
                      </FormLabel>
                      <FormDescription>
                        Only allow logins from specific locations or IP ranges
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

              {watchLocationRestriction && (
                <div className="space-y-4">
                  <div className="rounded-md border p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-sm font-medium">Allowed Locations</h4>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex items-center gap-1"
                            onClick={() => setIsAddingLocation(true)}
                          >
                            <Plus className="h-3.5 w-3.5" />
                            Add Location
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Add Allowed Location</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <FormLabel>Location Name</FormLabel>
                              <Input
                                placeholder="e.g., Office, Home"
                                value={newLocation.name}
                                onChange={(e) => setNewLocation({ ...newLocation, name: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <FormLabel>IP Range (optional)</FormLabel>
                              <Input
                                placeholder="e.g., 192.168.1.0/24"
                                value={newLocation.ip_range}
                                onChange={(e) => setNewLocation({ ...newLocation, ip_range: e.target.value })}
                              />
                              <p className="text-xs text-muted-foreground">
                                Leave blank to allow any IP from this location
                              </p>
                            </div>
                            <div className="flex justify-end space-x-2 pt-4">
                              <Button variant="outline" onClick={() => setIsAddingLocation(false)}>
                                Cancel
                              </Button>
                              <Button onClick={handleAddLocation}>
                                Add Location
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>

                    {allowedLocations.length === 0 ? (
                      <div className="text-center py-6 text-muted-foreground">
                        <AlertTriangle className="h-12 w-12 mx-auto mb-2 text-yellow-500" />
                        <p>No allowed locations set</p>
                        <p className="text-sm mt-1">
                          Warning: Without any allowed locations, access will be restricted for all locations
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {allowedLocations.map((location) => (
                          <div
                            key={location.id}
                            className="flex items-center justify-between rounded-md border p-3"
                          >
                            <div>
                              <p className="font-medium">{location.name}</p>
                              {location.ip_range && (
                                <p className="text-xs text-muted-foreground">
                                  IP Range: {location.ip_range}
                                </p>
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveLocation(location.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="bg-yellow-50 dark:bg-yellow-950 text-yellow-800 dark:text-yellow-300 p-4 rounded-md border border-yellow-200 dark:border-yellow-800">
                    <p className="text-sm flex items-start gap-2">
                      <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                      <span>
                        Enabling location restrictions may prevent you from accessing your account if you 
                        travel to a new location. Make sure to add all locations where you might need access.
                      </span>
                    </p>
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-4">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Settings"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

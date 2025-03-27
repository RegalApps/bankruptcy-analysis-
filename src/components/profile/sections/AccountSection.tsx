
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const AccountSection = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input id="username" placeholder="Enter your username" defaultValue="johndoe1" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="accountType">Account Type</Label>
            <Select defaultValue="premium">
              <SelectTrigger id="accountType">
                <SelectValue placeholder="Select account type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
                <SelectItem value="enterprise">Enterprise</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="accountId">Account ID</Label>
          <Input id="accountId" value="ACC-12345-6789" readOnly className="bg-muted" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="createdAt">Account Created</Label>
            <Input id="createdAt" value="March 15, 2023" readOnly className="bg-muted" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="lastLogin">Last Login</Label>
            <Input id="lastLogin" value="Today, 9:45 AM" readOnly className="bg-muted" />
          </div>
        </div>
        
        <div className="pt-4 border-t">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Danger Zone</h3>
            <p className="text-sm text-muted-foreground">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <Button variant="destructive" className="mt-2">Delete Account</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

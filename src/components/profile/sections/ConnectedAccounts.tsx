
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Github, Mail, Slack, Twitter } from "lucide-react";

export const ConnectedAccounts = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Connected Accounts</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Github className="h-6 w-6" />
            <div>
              <p className="font-medium">GitHub</p>
              <p className="text-sm text-muted-foreground">Manage your repositories</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              Connected
            </Badge>
            <Button variant="outline" size="sm">Disconnect</Button>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Slack className="h-6 w-6" />
            <div>
              <p className="font-medium">Slack</p>
              <p className="text-sm text-muted-foreground">Collaborate with your team</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              Connected
            </Badge>
            <Button variant="outline" size="sm">Disconnect</Button>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Twitter className="h-6 w-6 text-[#1DA1F2]" />
            <div>
              <p className="font-medium">Twitter</p>
              <p className="text-sm text-muted-foreground">Share your updates</p>
            </div>
          </div>
          <Button variant="outline" size="sm">Connect</Button>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Mail className="h-6 w-6" />
            <div>
              <p className="font-medium">Google</p>
              <p className="text-sm text-muted-foreground">Access Google services</p>
            </div>
          </div>
          <Button variant="outline" size="sm">Connect</Button>
        </div>
      </CardContent>
    </Card>
  );
};

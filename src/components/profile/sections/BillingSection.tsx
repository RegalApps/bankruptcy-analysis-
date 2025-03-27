
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Plus, Edit2, FileText } from "lucide-react";

export const BillingSection = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Billing & Payment</CardTitle>
        <CardDescription>Manage your subscription and payment methods</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-2">Current Plan</h3>
            <div className="flex items-center justify-between p-4 border rounded-md">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">Premium Plan</h4>
                  <Badge variant="secondary">Active</Badge>
                </div>
                <p className="text-sm text-muted-foreground">$29.99/month, billed monthly</p>
              </div>
              <Button variant="outline">Change Plan</Button>
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium">Payment Methods</h3>
              <Button variant="ghost" size="sm" className="h-8 gap-1">
                <Plus className="h-4 w-4" />
                Add
              </Button>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-md">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Visa ending in 4242</p>
                    <p className="text-sm text-muted-foreground">Expires 04/2025</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge>Default</Badge>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Edit2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-md">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Mastercard ending in 8888</p>
                    <p className="text-sm text-muted-foreground">Expires 09/2024</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Edit2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium">Billing History</h3>
              <Button variant="ghost" size="sm" className="h-8 gap-1">
                <FileText className="h-4 w-4" />
                View All
              </Button>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-md">
                <div>
                  <p className="font-medium">Premium Plan - Monthly</p>
                  <p className="text-sm text-muted-foreground">April 1, 2023</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">$29.99</p>
                  <Badge variant="outline" className="text-xs">Paid</Badge>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-md">
                <div>
                  <p className="font-medium">Premium Plan - Monthly</p>
                  <p className="text-sm text-muted-foreground">March 1, 2023</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">$29.99</p>
                  <Badge variant="outline" className="text-xs">Paid</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

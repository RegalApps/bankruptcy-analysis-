
import { Trash, Upload, Edit, Shield, User, FileText, CheckCircle, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export const FilterPanel = () => {
  return (
    <Card>
      <CardHeader className="px-4 py-3 border-b">
        <CardTitle className="text-lg flex items-center gap-1">
          <Filter className="h-4 w-4" /> 
          Filters
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Action Types */}
          <div>
            <h4 className="text-sm font-medium mb-2">Action Type</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="upload" />
                <Label htmlFor="upload" className="flex items-center gap-1.5 text-sm">
                  <Upload className="h-3.5 w-3.5" /> Upload
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="edit" />
                <Label htmlFor="edit" className="flex items-center gap-1.5 text-sm">
                  <Edit className="h-3.5 w-3.5" /> Edit
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="delete" />
                <Label htmlFor="delete" className="flex items-center gap-1.5 text-sm">
                  <Trash className="h-3.5 w-3.5" /> Delete
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="risk" />
                <Label htmlFor="risk" className="flex items-center gap-1.5 text-sm">
                  <Shield className="h-3.5 w-3.5" /> Risk Assessment
                </Label>
              </div>
            </div>
          </div>

          <Separator />

          {/* User Filters */}
          <div>
            <h4 className="text-sm font-medium mb-2">Users</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="all-users" />
                <Label htmlFor="all-users" className="text-sm">All Users</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="admin-users" />
                <Label htmlFor="admin-users" className="text-sm">Administrators</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="compliance-users" />
                <Label htmlFor="compliance-users" className="text-sm">Compliance Officers</Label>
              </div>
            </div>
          </div>

          <Separator />

          {/* Critical Events */}
          <div>
            <h4 className="text-sm font-medium mb-2">Severity</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="critical" />
                <Label htmlFor="critical" className="text-sm">Critical Events Only</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="verified" />
                <Label htmlFor="verified" className="flex items-center gap-1.5 text-sm">
                  <CheckCircle className="h-3.5 w-3.5" /> Verified Actions
                </Label>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

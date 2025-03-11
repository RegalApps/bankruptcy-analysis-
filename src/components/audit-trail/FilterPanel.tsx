
import { Trash, Upload, Edit, Shield, User, FileText, CheckCircle, Filter, Calendar, AlertTriangle, Download, Eye, Share, CheckSquare, Pen, FileOutput } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ActionType } from "./types";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

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
        <Accordion type="multiple" defaultValue={["action-type"]}>
          {/* Action Types */}
          <AccordionItem value="action-type">
            <AccordionTrigger className="text-sm font-medium py-1">Action Type</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 pt-1">
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
                  <Checkbox id="download" />
                  <Label htmlFor="download" className="flex items-center gap-1.5 text-sm">
                    <Download className="h-3.5 w-3.5" /> Download
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="view" />
                  <Label htmlFor="view" className="flex items-center gap-1.5 text-sm">
                    <Eye className="h-3.5 w-3.5" /> View
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="share" />
                  <Label htmlFor="share" className="flex items-center gap-1.5 text-sm">
                    <Share className="h-3.5 w-3.5" /> Share
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="risk" />
                  <Label htmlFor="risk" className="flex items-center gap-1.5 text-sm">
                    <Shield className="h-3.5 w-3.5" /> Risk Assessment
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="task" />
                  <Label htmlFor="task" className="flex items-center gap-1.5 text-sm">
                    <CheckSquare className="h-3.5 w-3.5" /> Task Assignment
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="signature" />
                  <Label htmlFor="signature" className="flex items-center gap-1.5 text-sm">
                    <Pen className="h-3.5 w-3.5" /> Signature
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="export" />
                  <Label htmlFor="export" className="flex items-center gap-1.5 text-sm">
                    <FileOutput className="h-3.5 w-3.5" /> Export
                  </Label>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Users */}
          <AccordionItem value="users">
            <AccordionTrigger className="text-sm font-medium py-1">Users</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 pt-1">
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
                <div className="flex items-center space-x-2">
                  <Checkbox id="regular-users" />
                  <Label htmlFor="regular-users" className="text-sm">Regular Users</Label>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Time Period */}
          <AccordionItem value="time">
            <AccordionTrigger className="text-sm font-medium py-1">Time Period</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 pt-1">
                <div className="flex items-center space-x-2">
                  <Checkbox id="today" />
                  <Label htmlFor="today" className="text-sm">Today</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="yesterday" />
                  <Label htmlFor="yesterday" className="text-sm">Yesterday</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="last-week" />
                  <Label htmlFor="last-week" className="text-sm">Last 7 days</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="last-month" />
                  <Label htmlFor="last-month" className="text-sm">Last 30 days</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="custom-date" />
                  <Label htmlFor="custom-date" className="text-sm">Custom Date Range</Label>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Critical Events */}
          <AccordionItem value="severity">
            <AccordionTrigger className="text-sm font-medium py-1">Severity</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 pt-1">
                <div className="flex items-center space-x-2">
                  <Checkbox id="critical" />
                  <Label htmlFor="critical" className="flex items-center gap-1.5 text-sm">
                    <AlertTriangle className="h-3.5 w-3.5 text-destructive" /> Critical Events
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="verified" />
                  <Label htmlFor="verified" className="flex items-center gap-1.5 text-sm">
                    <CheckCircle className="h-3.5 w-3.5 text-green-600" /> Verified Actions
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="blockchain" />
                  <Label htmlFor="blockchain" className="flex items-center gap-1.5 text-sm">
                    <Shield className="h-3.5 w-3.5 text-blue-600" /> Blockchain Protected
                  </Label>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="mt-4 pt-4 border-t">
          <Button variant="secondary" size="sm" className="w-full">
            Apply Filters
          </Button>
          <Button variant="ghost" size="sm" className="w-full mt-2">
            Reset
          </Button>
        </div>

        <div className="mt-4 pt-4 border-t">
          <h4 className="text-sm font-medium mb-2">Active Filters</h4>
          <div className="flex flex-wrap gap-1">
            <Badge variant="outline" className="flex items-center gap-1">
              Last 7 days <button className="ml-1 text-muted-foreground hover:text-foreground">×</button>
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              Critical Events <button className="ml-1 text-muted-foreground hover:text-foreground">×</button>
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

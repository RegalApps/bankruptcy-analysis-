
import { Shield, Download, Calendar, Filter, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { DatePickerWithRange } from "./DatePickerWithRange";
import { Input } from "@/components/ui/input";

export const AuditTrailHeader = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="mb-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-semibold">SecureFiles AI Audit Trail</h1>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          onClick={() => {
            // Handle export
          }}
        >
          <Download className="h-4 w-4" />
          Export Report
        </Button>
      </div>

      <div className="flex flex-col space-y-3 md:flex-row md:items-center md:space-x-4 md:space-y-0">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search audit logs..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3">
          <DatePickerWithRange />
          <Button variant="outline" size="icon" className="h-9 w-9">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
        <span className="flex items-center gap-1">
          <Calendar className="h-3.5 w-3.5" /> Last 7 days
        </span>
        <span>•</span>
        <span>154 activities</span>
        <span>•</span>
        <span>12 users</span>
        <span>•</span>
        <span>5 critical events</span>
      </div>
    </div>
  );
};

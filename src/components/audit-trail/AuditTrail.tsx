
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AuditTimeline } from "./AuditTimeline";
import { AuditVisualization } from "./AuditVisualization";
import { AuditDetailPanel } from "./AuditDetailPanel";
import { RecentActivities } from "./RecentActivities";
import { useAuditTrail } from "./hooks/useAuditTrail";
import { FilterPanel } from "./FilterPanel";
import { AuditEntry } from "./types";

export const AuditTrail = () => {
  const { auditEntries, isLoading, error } = useAuditTrail();
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);
  const [viewType, setViewType] = useState<"timeline" | "visualization">("timeline");

  const selectedEntry = selectedEntryId 
    ? auditEntries.find(entry => entry.id === selectedEntryId) || null
    : null;

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      {/* Left Panel - Timeline */}
      <div className="lg:col-span-5 space-y-6">
        <Card className="h-[calc(100vh-240px)]">
          <CardHeader className="px-4 py-3 border-b">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">Audit Trail</CardTitle>
              <Tabs value={viewType} onValueChange={(v) => setViewType(v as any)}>
                <TabsList className="h-8">
                  <TabsTrigger value="timeline" className="text-xs px-3">
                    Timeline
                  </TabsTrigger>
                  <TabsTrigger value="visualization" className="text-xs px-3">
                    Visualization
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[calc(100vh-300px)]">
              <TabsContent value="timeline" className="m-0">
                <AuditTimeline 
                  entries={auditEntries} 
                  isLoading={isLoading}
                  error={error}
                  selectedEntryId={selectedEntryId}
                  onSelectEntry={setSelectedEntryId}
                />
              </TabsContent>
              <TabsContent value="visualization" className="m-0 p-4">
                <AuditVisualization entries={auditEntries} />
              </TabsContent>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Center Panel - Detail View */}
      <div className="lg:col-span-4">
        <Card className="h-[calc(100vh-240px)]">
          <CardHeader className="px-4 py-3 border-b">
            <CardTitle className="text-lg">
              {selectedEntry ? "Event Details" : "Select an Event"}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[calc(100vh-300px)]">
              <AuditDetailPanel selectedEntry={selectedEntry} />
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Right Panel - Filters and Recent Activity */}
      <div className="lg:col-span-3 space-y-6">
        <FilterPanel />

        <Card className="h-[calc(100vh-330px)]">
          <CardHeader className="px-4 py-3 border-b">
            <CardTitle className="text-lg">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[calc(100vh-390px)]">
              <RecentActivities entries={auditEntries.slice(0, 5)} />
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

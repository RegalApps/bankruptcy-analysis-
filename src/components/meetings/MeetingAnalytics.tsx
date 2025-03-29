
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MeetingsAnalytics } from "@/components/analytics/meetings/MeetingsAnalytics";

export const MeetingAnalytics = () => {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <MeetingsAnalytics />
        </TabsContent>
        
        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Meeting Trends</CardTitle>
              <CardDescription>Analysis of meeting patterns over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  Meeting trend analysis will be available after more meetings are completed.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="feedback">
          <Card>
            <CardHeader>
              <CardTitle>Client Feedback</CardTitle>
              <CardDescription>Feedback collected from clients after meetings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  Client feedback will be displayed here after meetings with feedback collection.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

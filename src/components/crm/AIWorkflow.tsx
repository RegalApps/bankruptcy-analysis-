
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, BarChart, Bell } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export const AIWorkflow = () => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>AI-Powered Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium">Document Analytics</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Client Engagement</span>
                    <span className="text-muted-foreground">85%</span>
                  </div>
                  <Progress value={85} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Response Time</span>
                    <span className="text-muted-foreground">92%</span>
                  </div>
                  <Progress value={92} />
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="font-medium">Automated Workflows</h4>
                <div className="space-y-2">
                  {["Document Generation", "Client Follow-up", "Task Assignment"].map((task) => (
                    <Card key={task} className="p-3">
                      <div className="flex items-center gap-3">
                        <Brain className="h-4 w-4 text-primary" />
                        <span className="text-sm">{task}</span>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

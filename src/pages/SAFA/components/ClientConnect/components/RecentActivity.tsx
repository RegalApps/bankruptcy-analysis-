
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

export const RecentActivity = () => {
  return (
    <div className="flex-1">
      <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
      <ScrollArea className="h-[calc(100vh-500px)]">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">
            Loading recent client activity...
          </p>
        </Card>
      </ScrollArea>
    </div>
  );
};

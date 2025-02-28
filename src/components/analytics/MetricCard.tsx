
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
}

export const MetricCard = ({ title, value, description, icon: Icon, trend }: MetricCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
        {trend && (
          <div className="mt-2">
            <span className={cn(
              "text-xs px-2 py-0.5 rounded-full",
              trend === "up" ? "bg-green-100 text-green-700" : 
              trend === "down" ? "bg-red-100 text-red-700" : 
              "bg-gray-100 text-gray-700"
            )}>
              {trend === "up" ? "↑ Positive" : 
               trend === "down" ? "↓ Negative" : 
               "→ Neutral"}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};


import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface ModuleCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actions?: React.ReactNode;
}

export const ModuleCard = ({
  icon: Icon,
  title,
  description,
  actions
}: ModuleCardProps) => {
  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Icon className="h-5 w-5 text-primary" />
          <span className="font-medium">{title}</span>
        </div>
        <p className="text-sm text-muted-foreground">
          {description}
        </p>
        {actions}
      </div>
    </Card>
  );
};


import { Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ActionTypesFilterProps {
  actionTypes: string[];
  selectedActionTypes: Set<string>;
  onActionTypeChange: (actionType: string) => void;
}

export const ActionTypesFilter = ({ 
  actionTypes, 
  selectedActionTypes, 
  onActionTypeChange 
}: ActionTypesFilterProps) => {
  return (
    <Card>
      <CardHeader className="py-3">
        <CardTitle className="text-sm flex items-center">
          <Activity className="h-4 w-4 mr-2" />
          Action Types
        </CardTitle>
      </CardHeader>
      <CardContent className="py-0 px-3 pb-3">
        <div className="flex flex-wrap gap-2">
          {actionTypes.map(actionType => (
            <Badge
              key={actionType}
              variant={selectedActionTypes.has(actionType) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => onActionTypeChange(actionType)}
            >
              {actionType.replace('_', ' ')}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

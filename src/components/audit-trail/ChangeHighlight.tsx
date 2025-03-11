
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Change } from "./types";

interface ChangeHighlightProps {
  changes: Change[];
}

export const ChangeHighlight = ({ changes }: ChangeHighlightProps) => {
  if (!changes.length) return null;

  return (
    <div className="space-y-2">
      {changes.map((change, index) => (
        <Card key={index}>
          <CardContent className="p-2 text-xs">
            <div className="flex justify-between items-center mb-1">
              <div className="font-medium">{change.field}</div>
              <div className={cn(
                "text-xs px-1.5 py-0.5 rounded",
                change.type === "added" ? "bg-green-100 text-green-800" :
                change.type === "modified" ? "bg-blue-100 text-blue-800" :
                "bg-red-100 text-red-800"
              )}>
                {change.type === "added" ? "Added" : 
                 change.type === "modified" ? "Modified" : "Removed"}
              </div>
            </div>
            
            {change.type === "modified" && (
              <div className="grid grid-cols-2 gap-2 mt-1">
                <div>
                  <div className="text-muted-foreground">Previous</div>
                  <div className="bg-red-50 p-1 rounded line-through text-red-700">
                    {change.previousValue || "Empty"}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground">New</div>
                  <div className="bg-green-50 p-1 rounded text-green-700">
                    {change.newValue || "Empty"}
                  </div>
                </div>
              </div>
            )}

            {change.type === "added" && (
              <div className="bg-green-50 p-1 rounded text-green-700 mt-1">
                {change.newValue}
              </div>
            )}

            {change.type === "removed" && (
              <div className="bg-red-50 p-1 rounded line-through text-red-700 mt-1">
                {change.previousValue}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

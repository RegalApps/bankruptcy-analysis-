
import { Button } from "@/components/ui/button";
import { Grid2X2, List } from "lucide-react";

interface DocumentViewControlsProps {
  isGridView: boolean;
  setIsGridView: (isGrid: boolean) => void;
}

export const DocumentViewControls = ({
  isGridView,
  setIsGridView
}: DocumentViewControlsProps) => {
  return (
    <div className="flex items-center space-x-2">
      <Button
        variant={isGridView ? "default" : "outline"}
        size="sm"
        onClick={() => setIsGridView(true)}
        className="h-8 w-8 p-0"
      >
        <Grid2X2 className="h-4 w-4" />
      </Button>
      <Button
        variant={!isGridView ? "default" : "outline"}
        size="sm"
        onClick={() => setIsGridView(false)}
        className="h-8 w-8 p-0"
      >
        <List className="h-4 w-4" />
      </Button>
    </div>
  );
};

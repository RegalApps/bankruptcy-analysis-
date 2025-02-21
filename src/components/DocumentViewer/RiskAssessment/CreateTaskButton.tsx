
import { ClipboardList } from "lucide-react";
import { Button } from "../../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { Risk } from "./types";
import { useCreateTask } from "./useCreateTask";

interface CreateTaskButtonProps {
  risk: Risk;
  documentId: string;
}

export const CreateTaskButton = ({ risk, documentId }: CreateTaskButtonProps) => {
  const { handleCreateTask } = useCreateTask(documentId);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="ml-4 shrink-0">
          <ClipboardList className="h-4 w-4 mr-2" />
          Create Task
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-2">
          <h4 className="font-medium">Create Task for Risk</h4>
          <p className="text-sm text-muted-foreground">
            This will create a task with the following due date based on severity:
          </p>
          <ul className="text-sm space-y-1">
            <li>High: 2 days</li>
            <li>Medium: 5 days</li>
            <li>Low: 7 days</li>
          </ul>
          <Button className="w-full mt-2" onClick={() => handleCreateTask(risk)}>
            Confirm Task Creation
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

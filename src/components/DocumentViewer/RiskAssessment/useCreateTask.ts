
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Risk } from "./types";

export const useCreateTask = (documentId: string) => {
  const { toast } = useToast();

  const handleCreateTask = async (risk: Risk) => {
    try {
      const {
        data: { user },
        error: userError
      } = await supabase.auth.getUser();

      if (userError) throw userError;

      const dueDays = risk.severity === 'high' ? 2 : risk.severity === 'medium' ? 5 : 7;
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + dueDays);

      const { error: taskError } = await supabase
        .from('tasks')
        .insert({
          title: `Resolve ${risk.severity} risk: ${risk.type}`,
          description: `${risk.description}\n\nRequired Action: ${risk.requiredAction || 'N/A'}\nImpact: ${risk.impact || 'N/A'}`,
          severity: risk.severity,
          document_id: documentId,
          created_by: user.id,
          regulation: risk.regulation,
          solution: risk.solution,
          due_date: dueDate.toISOString(),
          status: 'pending'
        });

      if (taskError) throw taskError;

      toast({
        title: "Task Created",
        description: `Created task for risk: ${risk.type}`,
      });
    } catch (error) {
      console.error('Error creating task:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create task"
      });
    }
  };

  return { handleCreateTask };
};

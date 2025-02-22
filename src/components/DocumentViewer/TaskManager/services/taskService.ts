
import { supabase } from "@/lib/supabase";
import type { Task } from "../../types";

export const updateTaskStatus = async (taskId: string, newStatus: Task['status']) => {
  const { error } = await supabase
    .from('tasks')
    .update({ status: newStatus })
    .eq('id', taskId);

  if (error) throw error;
};

export const assignTask = async (taskId: string, userId: string) => {
  const { error } = await supabase
    .from('tasks')
    .update({ assigned_to: userId })
    .eq('id', taskId);

  if (error) throw error;
};

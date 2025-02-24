
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export const documentService = {
  async renameItem(itemId: string, newName: string) {
    const { error } = await supabase
      .from('documents')
      .update({ title: newName.trim() })
      .eq('id', itemId);

    if (error) throw error;
  },

  async deleteItem(itemId: string, itemType: "folder" | "file") {
    // Check if folder is empty
    if (itemType === 'folder') {
      const { data: containedItems } = await supabase
        .from('documents')
        .select('id')
        .eq('parent_folder_id', itemId);

      if (containedItems && containedItems.length > 0) {
        throw new Error("Cannot delete non-empty folder");
      }
    }

    // Handle file storage deletion
    if (itemType === 'file') {
      const { data: document } = await supabase
        .from('documents')
        .select('storage_path')
        .eq('id', itemId)
        .single();

      if (document?.storage_path) {
        await supabase.storage
          .from('documents')
          .remove([document.storage_path]);
      }
    }

    // Delete from documents table
    const { error } = await supabase
      .from('documents')
      .delete()
      .eq('id', itemId);

    if (error) throw error;
  }
};


import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

export const DocumentUpload = () => {
  const { toast } = useToast();

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('secure_documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      const { data: documentData, error: dbError } = await supabase
        .from('documents')
        .insert({
          title: file.name,
          file_path: filePath,
          status: 'pending',
          user_id: user?.id
        })
        .select()
        .single();

      if (dbError) throw dbError;

      // Create notification for document upload
      await supabase.functions.invoke('handle-notifications', {
        body: {
          action: 'create',
          userId: user?.id,
          notification: {
            title: 'Document Uploaded',
            message: `"${file.name}" has been uploaded successfully`,
            type: 'info',
            category: 'file_activity',
            priority: 'normal',
            action_url: `/documents/${documentData.id}`,
            metadata: {
              documentId: documentData.id,
              fileName: file.name,
              fileSize: file.size,
              uploadedAt: new Date().toISOString()
            }
          }
        }
      });

      toast({
        title: "Success",
        description: "Document uploaded successfully"
      });
    } catch (error) {
      console.error('Error uploading document:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to upload document"
      });
    }
  };

  return (
    <div className="flex justify-end">
      <Button className="gap-2">
        <Upload className="h-4 w-4" />
        <label className="cursor-pointer">
          Upload Document
          <input
            type="file"
            className="hidden"
            onChange={handleUpload}
            accept=".pdf,.doc,.docx,.xls,.xlsx"
          />
        </label>
      </Button>
    </div>
  );
};


import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileUpload } from "@/components/FileUpload";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface DocumentUploadSectionProps {
  financialRecordId: string | null;
}

export const DocumentUploadSection = ({ financialRecordId }: DocumentUploadSectionProps) => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  const handleUploadComplete = async (documentId: string) => {
    if (!financialRecordId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please save the financial record first before uploading documents.",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("financial_documents")
        .update({ financial_record_id: financialRecordId })
        .eq("id", documentId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Document uploaded and linked successfully",
      });
    } catch (error) {
      console.error("Error linking document:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to link document to financial record",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Supporting Documents</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Upload PDF, Word, or Excel files containing your financial information
        </p>
        <FileUpload onUploadComplete={handleUploadComplete} />
      </CardContent>
    </Card>
  );
};

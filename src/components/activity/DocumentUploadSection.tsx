
import { FileUpload } from "@/components/FileUpload";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const DocumentUploadSection = () => {
  const handleUploadComplete = async (documentId: string) => {
    console.log("Document uploaded:", documentId);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Supporting Documents</CardTitle>
      </CardHeader>
      <CardContent>
        <FileUpload onUploadComplete={handleUploadComplete} />
      </CardContent>
    </Card>
  );
};

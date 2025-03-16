
import { Button } from "@/components/ui/button";
import { Upload, FileText } from "lucide-react";

interface UploadAreaProps {
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isUploading: boolean;
}

export const UploadArea = ({ handleFileChange, isUploading }: UploadAreaProps) => {
  return (
    <div className="border-2 border-dashed rounded-lg p-8 text-center space-y-4">
      <FileText className="h-10 w-10 mx-auto text-muted-foreground" />
      <div>
        <h3 className="font-medium">Drag & drop files or click to upload</h3>
        <p className="text-sm text-muted-foreground mt-1">Supports PDF, Word, Excel, and image files</p>
      </div>
      
      <Button variant="outline" disabled={isUploading}>
        <Upload className="mr-2 h-4 w-4" />
        <label className="cursor-pointer">
          Select Files
          <input
            type="file"
            className="hidden"
            multiple
            onChange={handleFileChange}
            accept=".pdf,.docx,.doc,.xlsx,.xls,.jpg,.jpeg,.png"
          />
        </label>
      </Button>
    </div>
  );
};

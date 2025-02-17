
import { useState } from 'react';
import { Upload, File } from 'lucide-react';
import { cn } from "@/lib/utils";

export const FileUpload = () => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    // Handle file drop logic here
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        "relative w-full h-48 border-2 border-dashed rounded-lg transition-colors duration-200 ease-in-out",
        "flex items-center justify-center",
        isDragging 
          ? "border-primary bg-primary/5" 
          : "border-gray-200 hover:border-primary"
      )}
    >
      <div className="text-center space-y-2">
        <Upload className="mx-auto h-8 w-8 text-gray-400" />
        <div className="flex text-sm text-gray-600">
          <label
            htmlFor="file-upload"
            className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/80"
          >
            <span>Upload a file</span>
            <input id="file-upload" name="file-upload" type="file" className="sr-only" />
          </label>
          <p className="pl-1">or drag and drop</p>
        </div>
        <p className="text-xs text-gray-500">PDF, DOC, DOCX up to 10MB</p>
      </div>
    </div>
  );
};

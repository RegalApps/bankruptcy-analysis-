import React, { useState } from 'react';
import { Upload } from "lucide-react";

interface DropAreaProps {
  onFileSelect: (file: File) => void;
}

export const DropArea: React.FC<DropAreaProps> = ({ onFileSelect }) => {
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
    
    const file = e.dataTransfer.files[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <div 
      className={`border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-primary transition-colors ${isDragging ? 'border-primary bg-primary/10' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center justify-center space-y-2">
        <Upload className="h-8 w-8 text-gray-400" />
        <p className="text-sm text-gray-600">
          Drop your document here or click to browse
        </p>
        <p className="text-xs text-gray-400">
          Supports PDF, DOC, DOCX, XLS, XLSX up to 10MB
        </p>
      </div>
      <input
        id="file-upload"
        type="file"
        className="hidden"
        accept=".pdf,.doc,.docx,.xls,.xlsx"
        onChange={handleFileInputChange}
      />
    </div>
  );
};

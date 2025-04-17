
import React from 'react';
import { DropArea } from './components/DropArea';
import { UploadProgressDisplay } from './components/UploadProgressDisplay';
import { useFileUpload } from './hooks/useFileUpload';
import { FileUploadProps } from './types';

export const FileUpload: React.FC<FileUploadProps> = ({ onUploadComplete }) => {
  const { handleUpload, isUploading, progress } = useFileUpload(onUploadComplete);

  return (
    <div className="space-y-4">
      {isUploading ? (
        <UploadProgressDisplay 
          uploadProgress={progress.percentage || 0} 
          uploadStep={progress.message} 
        />
      ) : (
        <div className="flex items-center justify-center w-full">
          <label htmlFor="file-upload" className="w-full">
            <DropArea onFileSelect={handleUpload} />
          </label>
        </div>
      )}
    </div>
  );
};


import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, RotateCw } from "lucide-react";

interface ImageViewerProps {
  url: string;
  title?: string;
}

export const ImageViewer: React.FC<ImageViewerProps> = ({ url, title }) => {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [error, setError] = useState(false);

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.1, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.1, 0.5));
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const handleImageError = () => {
    console.error("Error loading image:", url);
    setError(true);
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-muted/30">
        <p className="text-destructive mb-2">Failed to load image</p>
        <p className="text-sm text-muted-foreground">The image could not be loaded or is in an unsupported format.</p>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col h-full">
      <div className="absolute top-2 right-2 flex gap-2 z-10 bg-background/80 rounded-md p-1">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={handleZoomIn}
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={handleZoomOut}
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={handleRotate}
        >
          <RotateCw className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex-1 flex items-center justify-center overflow-auto p-4">
        <img
          src={url}
          alt={title || "Image preview"}
          className="max-h-full object-contain"
          style={{ 
            transform: `scale(${zoom}) rotate(${rotation}deg)`,
            transition: 'transform 0.2s ease'
          }}
          onError={handleImageError}
        />
      </div>
    </div>
  );
};

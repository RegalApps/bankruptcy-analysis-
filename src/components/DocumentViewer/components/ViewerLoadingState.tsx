
import React from "react";
import { Loader2 } from "lucide-react";

export interface ViewerLoadingStateProps {
  message?: string;
  size?: "small" | "medium" | "large";
}

export const ViewerLoadingState: React.FC<ViewerLoadingStateProps> = ({
  message = "Loading document...",
  size = "medium"
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case "small":
        return "min-h-[100px] p-3";
      case "large":
        return "min-h-[300px] p-8";
      default:
        return "min-h-[200px] p-6";
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${getSizeClasses()}`}>
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
};

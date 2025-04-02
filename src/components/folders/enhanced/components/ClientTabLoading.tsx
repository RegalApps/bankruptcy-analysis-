
import React from "react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

interface ClientTabLoadingProps {
  clientId: string;
}

export const ClientTabLoading: React.FC<ClientTabLoadingProps> = ({ clientId }) => {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="large" className="mx-auto mb-4" />
        <p className="text-muted-foreground">Loading client information...</p>
        {clientId.toLowerCase().includes('josh') && (
          <p className="text-xs text-muted-foreground mt-2">
            Loading Josh Hart's profile and documents
          </p>
        )}
      </div>
    </div>
  );
};

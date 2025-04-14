
import { useState } from "react";

export const useDocumentViewerState = () => {
  const [document, setDocument] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRiskId, setSelectedRiskId] = useState<string | null>(null);

  return {
    document,
    setDocument,
    isLoading,
    setIsLoading,
    error,
    setError,
    selectedRiskId,
    setSelectedRiskId
  };
};


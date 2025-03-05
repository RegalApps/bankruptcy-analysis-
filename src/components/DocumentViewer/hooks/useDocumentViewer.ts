
import { useState } from "react";
import { useDocumentDetails } from "./useDocumentDetails";
import { useDocumentRealtime } from "./useDocumentRealtime";
import { DocumentDetails } from "../types";

export const useDocumentViewer = (documentId: string) => {
  const [document, setDocument] = useState<DocumentDetails | null>(null);
  const [loading, setLoading] = useState(true);

  const { fetchDocumentDetails } = useDocumentDetails(documentId, {
    onSuccess: (data) => {
      setDocument(data);
      setLoading(false);
    },
    onError: () => {
      setLoading(false);
    }
  });

  // Set up real-time subscriptions
  useDocumentRealtime(documentId, fetchDocumentDetails);

  return {
    document,
    loading,
    fetchDocumentDetails
  };
};

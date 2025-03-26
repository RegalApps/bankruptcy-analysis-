
import { useState, useEffect } from "react";
import { Document } from "../types";

// Mock data for documents
const MOCK_DOCUMENTS: Document[] = [
  {
    id: "doc1",
    title: "Form 47 - Consumer Proposal",
    is_folder: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    type: "pdf",
    metadata: {
      client_id: "client1",
      client_name: "John Doe"
    }
  },
  {
    id: "folder1",
    title: "Client Folders",
    is_folder: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    folder_type: "root"
  },
  {
    id: "folder2",
    title: "John Doe",
    is_folder: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    folder_type: "client",
    parent_folder_id: "folder1"
  }
];

export const useDocuments = () => {
  const [documents, setDocuments] = useState<Document[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchDocuments = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real app, this would be a call to an API or Supabase
      // We're using mock data here for demonstration
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
      setDocuments(MOCK_DOCUMENTS);
    } catch (err) {
      console.error("Error fetching documents:", err);
      setError(err instanceof Error ? err : new Error("Failed to fetch documents"));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const refetch = () => {
    fetchDocuments();
  };

  return {
    documents,
    isLoading,
    error,
    refetch
  };
};

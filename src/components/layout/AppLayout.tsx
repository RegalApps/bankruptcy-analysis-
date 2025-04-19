
import { Outlet } from "react-router-dom";
import { AppShell } from "./AppShell";
import { Toaster } from "sonner";
import { UploadProgressTracker } from "@/components/documents/UploadProgressTracker";
import { useEffect } from "react";
import { addUploadProgressCallback } from "@/utils/documents/uploadTracker";
import { supabase } from "@/lib/supabase";

export const AppLayout = () => {
  // Set up document processing listener when the app loads
  useEffect(() => {
    // Create a listener that will be removed on component unmount
    const unsubscribe = addUploadProgressCallback((id, progress, stage) => {
      console.log(`Document ${id} - Progress: ${progress}%, Stage: ${stage}`);
    });
    
    // Initialize storage bucket when app loads
    const initializeStorage = async () => {
      try {
        // Check if documents bucket exists
        const { data: buckets } = await supabase.storage.listBuckets();
        const hasDocumentsBucket = buckets?.some(bucket => bucket.name === 'documents');
        
        if (!hasDocumentsBucket) {
          console.log("Creating documents bucket on app initialization");
          const { error } = await supabase.storage.createBucket('documents', { 
            public: false,
            fileSizeLimit: 10485760 // 10MB
          });
          
          if (error) {
            console.error("Error creating documents bucket:", error);
          } else {
            console.log("Documents bucket created successfully");
          }
        } else {
          console.log("Documents bucket exists");
        }
      } catch (error) {
        console.error("Error initializing storage:", error);
      }
    };
    
    // Initialize storage
    initializeStorage();
    
    return unsubscribe;
  }, []);

  return (
    <>
      <AppShell>
        <Outlet />
      </AppShell>
      <Toaster />
      <UploadProgressTracker />
    </>
  );
};


import { Outlet } from "react-router-dom";
import { AppShell } from "./AppShell";
import { Toaster } from "sonner";
import { UploadProgressTracker } from "@/components/documents/UploadProgressTracker";
import { useEffect } from "react";
import { addUploadProgressCallback } from "@/utils/documents/uploadTracker";
import { supabase } from "@/lib/supabase";
import { ensureStorageBuckets } from "@/utils/storage/bucketManager";

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
        const bucketsReady = await ensureStorageBuckets();
        
        if (bucketsReady) {
          console.log("Storage system initialized successfully");
        } else {
          console.error("Failed to initialize storage system");
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

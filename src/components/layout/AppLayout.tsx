
import { Outlet } from "react-router-dom";
import { AppShell } from "./AppShell";
import { Toaster } from "sonner";
import { UploadProgressTracker } from "@/components/documents/UploadProgressTracker";
import { useEffect } from "react";
import { addUploadProgressCallback } from "@/utils/documents/uploadTracker";

export const AppLayout = () => {
  // Set up document processing listener when the app loads
  useEffect(() => {
    // Create a listener that will be removed on component unmount
    const unsubscribe = addUploadProgressCallback((id, progress, stage) => {
      console.log(`Document ${id} - Progress: ${progress}%, Stage: ${stage}`);
    });
    
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

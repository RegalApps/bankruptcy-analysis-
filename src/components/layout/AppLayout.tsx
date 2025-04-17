
import { Outlet } from "react-router-dom";
import { AppShell } from "./AppShell";
import { Toaster } from "sonner";
import { UploadProgressTracker } from "@/components/documents/UploadProgressTracker";
import { useEffect } from "react";
import { setupDocumentProcessingListener } from "@/utils/documents/uploadTracker";

export const AppLayout = () => {
  // Set up document processing listener when the app loads
  useEffect(() => {
    const unsubscribe = setupDocumentProcessingListener();
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

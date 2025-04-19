
import { StorageDiagnostic } from "@/components/docs/StorageDiagnostic";

export const UploadDiagnosticPage = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Upload System Diagnostics</h1>
      <p className="text-muted-foreground mb-6">
        This tool helps troubleshoot file upload issues by checking storage configuration,
        authentication, and permissions.
      </p>
      
      <div className="my-8">
        <StorageDiagnostic />
      </div>
    </div>
  );
};

export default UploadDiagnosticPage;

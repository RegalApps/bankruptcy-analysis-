
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const ClientViewerRedirect = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Normalize the client ID
    const normalizedClientId = clientId?.toLowerCase().replace(/\s+/g, '-') || '';
    
    // Log the redirect for debugging
    console.log(`ClientViewerRedirect: Redirecting from client-viewer to client: ${normalizedClientId}`);
    
    // Display toast to notify user
    toast.info("Redirecting to client profile...");
    
    // Redirect to the correct URL path with a short delay to let the toast display
    setTimeout(() => {
      navigate(`/client/${normalizedClientId}`, { replace: true });
    }, 100);
  }, [clientId, navigate]);
  
  // Show a simple loading message while redirecting
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-muted-foreground">Redirecting to client profile...</p>
      </div>
    </div>
  );
};

export default ClientViewerRedirect;

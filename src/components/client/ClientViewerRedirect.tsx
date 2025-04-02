
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const ClientViewerRedirect = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Normalize the client ID
    const normalizedClientId = clientId?.toLowerCase().replace(/\s+/g, '-') || '';
    
    // Log the redirect for debugging
    console.log(`Redirecting from client-viewer to client: ${normalizedClientId}`);
    
    // Display toast to notify user
    toast.info("Redirecting to client profile...");
    
    // Redirect to the correct URL path
    navigate(`/client/${normalizedClientId}`, { replace: true });
  }, [clientId, navigate]);
  
  // This component doesn't render anything, it just redirects
  return null;
};

export default ClientViewerRedirect;


import { useState, useEffect } from "react";
import { DocumentViewer } from "@/components/DocumentViewer";
import { DocumentManagementPage } from "@/pages/DocumentManagementPage";
import { Auth } from "@/components/Auth";
import { supabase } from "@/lib/supabase";
import { MainSidebar } from "@/components/layout/MainSidebar";
import { MainHeader } from "@/components/header/MainHeader";
import { Footer } from "@/components/layout/Footer";
import { useLocation, useNavigate } from "react-router-dom";
import { showPerformanceToast } from "@/utils/performance";
import { Button } from "@/components/ui/button";
import { Home, Mail, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isEmailConfirmationPending, setIsEmailConfirmationPending] = useState(false);
  const [confirmationEmail, setConfirmationEmail] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Handle email confirmation redirects
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const errorCode = params.get('error');
    const errorDescription = params.get('error_description');
    
    if (errorCode === '401') {
      // This happens when a user clicks on an expired confirmation link
      toast({
        variant: "destructive",
        title: "Link expired",
        description: "Your confirmation link has expired. Please sign up again."
      });
      navigate('/', { replace: true });
    } else if (errorDescription) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: decodeURIComponent(errorDescription)
      });
      navigate('/', { replace: true });
    }
  }, [navigate, toast]);

  useEffect(() => {
    if (location.state?.selectedDocument) {
      setSelectedDocument(location.state.selectedDocument);
    }
  }, [location]);

  useEffect(() => {
    // Measure and show performance metrics when the page loads
    showPerformanceToast("Home Page");
  }, []);

  useEffect(() => {
    console.log("Initializing auth state...");
    setIsLoading(true);
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Session state:", session);
      setSession(session);
      
      // Check if user exists but is not confirmed
      if (session?.user) {
        // Check if email is confirmed by looking at the confirmed_at property
        const isConfirmed = session.user.confirmed_at !== null;
        setIsEmailConfirmationPending(!isConfirmed);
        if (!isConfirmed) {
          setConfirmationEmail(session.user.email);
          
          // Show a toast if email is not confirmed
          toast({
            title: "Email Confirmation Required",
            description: "Please check your email for a confirmation link.",
          });
        }
      }
      
      setIsLoading(false);
    }).catch(error => {
      console.error("Error fetching session:", error);
      setIsLoading(false);
      setAuthError(error.message);
    });

    // Subscribe to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session);
      
      if (event === 'SIGNED_IN') {
        setSession(session);
        // Check if email is confirmed
        const isConfirmed = session?.user?.confirmed_at !== null;
        setIsEmailConfirmationPending(!isConfirmed);
        if (!isConfirmed && session?.user) {
          setConfirmationEmail(session.user.email);
          // Show a toast if email is not confirmed
          toast({
            title: "Email Confirmation Required",
            description: "Please check your email for a confirmation link.",
          });
        }
      } else if (event === 'SIGNED_OUT') {
        setSession(null);
        setIsEmailConfirmationPending(false);
        setConfirmationEmail(null);
      } else if (event === 'USER_UPDATED') {
        setSession(session);
        // If user was updated, check if email confirmation changed
        if (session?.user?.confirmed_at) {
          setIsEmailConfirmationPending(false);
          setConfirmationEmail(null);
          toast({
            title: "Email Confirmed",
            description: "Your email has been successfully confirmed.",
          });
        }
      }
      
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [toast]);

  const handleBackToDocuments = () => {
    setSelectedDocument(null);
    navigate('/');
  };
  
  const handleResendConfirmation = async () => {
    if (!confirmationEmail) return;
    
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: confirmationEmail,
        options: {
          emailRedirectTo: window.location.origin,
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Confirmation Email Sent",
        description: `A new confirmation email has been sent to ${confirmationEmail}`,
      });
    } catch (error: any) {
      console.error("Error resending confirmation email:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to resend confirmation email",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (authError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center p-6 max-w-md">
          <h2 className="text-xl font-semibold mb-4">Authentication Error</h2>
          <p className="text-muted-foreground mb-6">{authError}</p>
          <Button onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  // If user's email is not confirmed, show a confirmation screen
  if (session && isEmailConfirmationPending) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center p-6 max-w-md border rounded-lg shadow-md">
          <div className="flex justify-center mb-4">
            <Mail className="h-12 w-12 text-primary" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Confirm Your Email</h2>
          <p className="text-muted-foreground mb-6">
            We've sent a confirmation link to <strong>{confirmationEmail}</strong>. 
            Please check your email and click the link to activate your account.
          </p>
          
          <Alert className="mb-6 bg-muted">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              You need to confirm your email before you can use all features of the application.
            </AlertDescription>
          </Alert>
          
          <div className="space-y-4">
            <Button onClick={handleResendConfirmation} variant="outline" className="w-full">
              Resend Confirmation Email
            </Button>
            <Button 
              onClick={() => {
                supabase.auth.signOut();
                navigate('/');
              }}
              variant="secondary"
              className="w-full"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // If no session is found, redirect to auth page
  if (!session) {
    return <Auth />;
  }

  return (
    <div className="min-h-screen flex">
      <MainSidebar />
      <div className="flex-1 pl-64 flex flex-col">
        <MainHeader />
        <main className="flex-1">
          {selectedDocument ? (
            <div className="container py-8">
              <div className="space-y-6">
                <button
                  onClick={handleBackToDocuments}
                  className="flex items-center text-sm text-muted-foreground hover:text-foreground"
                >
                  <Home className="h-4 w-4 mr-1" /> Back to Documents
                </button>
                <DocumentViewer documentId={selectedDocument} />
              </div>
            </div>
          ) : (
            <DocumentManagementPage />
          )}
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Index;

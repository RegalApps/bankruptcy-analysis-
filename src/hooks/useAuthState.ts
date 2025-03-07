
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { authService } from "@/components/auth/authService";

export const useAuthState = () => {
  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isEmailConfirmationPending, setIsEmailConfirmationPending] = useState(false);
  const [confirmationEmail, setConfirmationEmail] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Handle URL error parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const errorCode = params.get('error');
    const errorDescription = params.get('error_description');
    
    if (errorCode === '401') {
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

  // Initialize auth state and set up listeners
  useEffect(() => {
    console.log("Initializing auth state...");
    setIsLoading(true);
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      console.log("Session state:", session);
      
      if (error) {
        console.error("Error fetching session:", error);
        setAuthError(error.message);
        setIsLoading(false);
        return;
      }
      
      setSession(session);
      
      if (session?.user) {
        const isConfirmed = session.user.confirmed_at !== null;
        setIsEmailConfirmationPending(!isConfirmed);
        if (!isConfirmed) {
          setConfirmationEmail(session.user.email);
          toast({
            title: "Email Confirmation Required",
            description: "Please check your email for a confirmation link.",
          });
        }
      }
      
      setIsLoading(false);
    });

    // Subscribe to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session);
      
      if (event === 'SIGNED_IN') {
        setSession(session);
        const isConfirmed = session?.user?.confirmed_at !== null;
        setIsEmailConfirmationPending(!isConfirmed);
        if (!isConfirmed && session?.user) {
          setConfirmationEmail(session.user.email);
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
        if (session?.user?.confirmed_at) {
          setIsEmailConfirmationPending(false);
          setConfirmationEmail(null);
          toast({
            title: "Email Confirmed",
            description: "Your email has been successfully confirmed.",
          });
        }
      } else if (event === 'TOKEN_REFRESHED') {
        setSession(session);
      } else if (event === 'PASSWORD_RECOVERY') {
        toast({
          title: "Password Recovery",
          description: "Check your email to reset your password.",
        });
      } else if (event === 'USER_DELETED') {
        setSession(null);
        toast({
          title: "Account Deleted",
          description: "Your account has been deleted.",
        });
        navigate('/');
      }
      
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [toast, navigate]);

  // Handle sign out
  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await authService.signOut();
      navigate('/');
    } catch (error: any) {
      console.error("Error signing out:", error);
      setAuthError(error.message || "Failed to sign out");
      toast({
        variant: "destructive",
        title: "Sign Out Error",
        description: error.message || "Failed to sign out",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    session,
    isLoading,
    authError,
    isEmailConfirmationPending,
    confirmationEmail,
    handleSignOut
  };
};

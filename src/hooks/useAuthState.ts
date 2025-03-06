
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

  useEffect(() => {
    console.log("Initializing auth state...");
    setIsLoading(true);
    
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Session state:", session);
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
    }).catch(error => {
      console.error("Error fetching session:", error);
      setIsLoading(false);
      setAuthError(error.message);
    });

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
      }
      
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [toast]);

  const handleSignOut = async () => {
    try {
      await authService.signOut();
      navigate('/');
    } catch (error) {
      console.error("Error signing out:", error);
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

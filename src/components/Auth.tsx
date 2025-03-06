
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Lock, AlertTriangle, Mail, Info } from 'lucide-react';
import { SignUpFields } from './auth/SignUpFields';
import { AuthFields } from './auth/AuthFields';
import { validateAuthForm } from './auth/authValidation';
import { authService } from './auth/authService';

export const Auth = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [userId, setUserId] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmationSent, setConfirmationSent] = useState(false);
  const [lastAttemptTime, setLastAttemptTime] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const { toast } = useToast();

  // Reset attempts after 15 minutes
  useEffect(() => {
    const timer = setInterval(() => {
      if (attempts > 0 && Date.now() - lastAttemptTime > 900000) {
        setAttempts(0);
      }
    }, 60000);

    return () => clearInterval(timer);
  }, [attempts, lastAttemptTime]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = validateAuthForm({
      email,
      password,
      isSignUp,
      fullName,
      userId
    });
    
    if (!validation.isValid) {
      setError(validation.error);
      return;
    }

    // Check for rate limiting
    const currentTime = Date.now();
    if (attempts >= 5) {
      const timeLeft = Math.ceil((900000 - (currentTime - lastAttemptTime)) / 1000);
      setError(`Too many attempts. Please wait ${timeLeft} seconds before trying again`);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        const { user } = await authService.signUp({
          email,
          password,
          fullName,
          userId,
          avatarUrl
        });

        if (user?.identities?.length === 0) {
          // User already exists but hasn't confirmed their email
          setError("This email is already registered but not confirmed. Please check your email for the confirmation link.");
        } else {
          setConfirmationSent(true);
          toast({
            title: "Success",
            description: "Please check your email to confirm your account",
          });
        }
      } else {
        try {
          await authService.signIn(email, password);
          toast({
            title: "Success",
            description: "Successfully signed in!",
          });
        } catch (signInError: any) {
          if (signInError.message.includes('Email not confirmed')) {
            // Handle the email confirmation error specifically
            setError("Please check your email and confirm your account before signing in.");
          } else {
            throw signInError;
          }
        }
      }

      // Reset attempts on successful auth
      setAttempts(0);
    } catch (error: any) {
      console.error('Auth error:', error);
      setAttempts(prev => prev + 1);
      setLastAttemptTime(currentTime);

      if (error.message.includes('Invalid login credentials')) {
        setError('Invalid email or password');
      } else if (error.message.includes('Email already registered')) {
        setError('This email is already registered. Try signing in instead.');
      } else if (error.message.includes('Password should be')) {
        setError('Password should be at least 6 characters long');
      } else {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // If confirmation was sent, show a dedicated confirmation screen
  if (confirmationSent) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-secondary/20">
        <div className="container max-w-[1200px] px-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <img 
                src="/lovable-uploads/01eb992b-a293-4ef9-a5ff-fa81da6a95ed.png" 
                alt="SecureFiles AI" 
                className="h-12"
              />
            </div>
          </div>

          <div className="w-full max-w-md mx-auto space-y-8 rounded-lg border bg-card p-8 shadow-lg">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <Mail className="h-12 w-12 text-primary" />
              </div>
              <h1 className="text-2xl font-bold text-primary">Check Your Email</h1>
              <p className="text-muted-foreground">
                We've sent a confirmation link to <strong>{email}</strong>
              </p>
              <p className="text-sm text-muted-foreground mt-4">
                Please click the link in your email to confirm your account.
                If you don't see the email, check your spam folder.
              </p>
            </div>

            <Alert className="bg-muted">
              <Info className="h-4 w-4" />
              <AlertDescription>
                You won't be able to sign in until you confirm your email address.
              </AlertDescription>
            </Alert>

            <div className="text-center mt-6">
              <button
                onClick={() => {
                  setIsSignUp(false);
                  setConfirmationSent(false);
                }}
                className="text-sm text-primary hover:underline"
              >
                Back to Sign In
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-secondary/20">
      <div className="container max-w-[1200px] px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <img 
              src="/lovable-uploads/01eb992b-a293-4ef9-a5ff-fa81da6a95ed.png" 
              alt="SecureFiles AI" 
              className="h-12"
            />
          </div>
        </div>

        <div className="w-full max-w-md mx-auto space-y-8 rounded-lg border bg-card p-8 shadow-lg">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold text-primary">Access to SecureFiles AI</h1>
            <p className="text-sm text-muted-foreground">
              {isSignUp ? 'Create a new account to continue' : 'Sign in to your account'}
            </p>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleAuth} className="space-y-4">
            {isSignUp && (
              <SignUpFields
                fullName={fullName}
                setFullName={setFullName}
                userId={userId}
                setUserId={setUserId}
                avatarUrl={avatarUrl}
                setAvatarUrl={setAvatarUrl}
              />
            )}

            <AuthFields
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              isDisabled={loading}
            />

            <button
              type="submit"
              disabled={loading || (attempts >= 5)}
              className="w-full flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Lock className="h-4 w-4" />
              {loading ? 'Processing...' : isSignUp ? 'Sign Up' : 'Sign In'}
            </button>

            {attempts > 0 && attempts < 5 && (
              <p className="text-xs text-destructive text-center">
                {5 - attempts} attempts remaining before temporary lockout
              </p>
            )}
          </form>

          <div className="text-center">
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError(null);
              }}
              className="text-sm text-primary hover:underline"
            >
              {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Lock } from 'lucide-react';
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
  const [lastAttemptTime, setLastAttemptTime] = useState(0);
  const { toast } = useToast();

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

    // Check for rate limiting on signup
    if (isSignUp) {
      const currentTime = Date.now();
      const timeSinceLastAttempt = currentTime - lastAttemptTime;
      const COOLDOWN_PERIOD = 15000; // 15 seconds to be safe

      if (timeSinceLastAttempt < COOLDOWN_PERIOD) {
        const remainingTime = Math.ceil((COOLDOWN_PERIOD - timeSinceLastAttempt) / 1000);
        setError(`Please wait ${remainingTime} seconds before trying again`);
        return;
      }
      setLastAttemptTime(currentTime);
    }
    
    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        await authService.signUp({
          email,
          password,
          fullName,
          userId,
          avatarUrl
        });

        toast({
          title: "Success",
          description: "Please check your email to confirm your account",
        });
      } else {
        await authService.signIn(email, password);
        toast({
          title: "Success",
          description: "Successfully signed in!",
        });
      }
    } catch (error: any) {
      if (error.error_type === 'http_client_error' && error.status === 429) {
        setError('Too many attempts. Please wait a moment before trying again.');
      } else {
        setError(error.message);
      }
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-secondary/20">
      <div className="container max-w-[1200px] px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <img 
              src="/lovable-uploads/01eb992b-a293-4ef9-a5ff-fa81da6a95ed.png" 
              alt="SecureFile AI" 
              className="h-12"
            />
          </div>
        </div>

        <div className="w-full max-w-md mx-auto space-y-8 rounded-lg border bg-card p-8 shadow-lg">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold text-primary">Access to FileSecure AI</h1>
            <p className="text-sm text-muted-foreground">
              {isSignUp ? 'Create a new account to continue' : 'Sign in to your account'}
            </p>
          </div>

          {error && (
            <Alert variant="destructive">
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
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
            >
              <Lock className="h-4 w-4" />
              {loading ? 'Processing...' : isSignUp ? 'Sign Up' : 'Sign In'}
            </button>
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

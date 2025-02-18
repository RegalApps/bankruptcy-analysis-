
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ProfilePicture } from './ProfilePicture';
import { Lock } from 'lucide-react';

export const Auth = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [userId, setUserId] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const validateForm = () => {
    if (!email || !password) {
      setError('Email and password are required');
      return false;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    if (isSignUp && (!fullName || !userId)) {
      setError('Full Name and User ID are required');
      return false;
    }
    setError(null);
    return true;
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        // First, sign up the user
        const { error: signUpError, data } = await supabase.auth.signUp({
          email,
          password,
        });
        
        if (signUpError) throw signUpError;

        // Then update their profile with the additional information
        if (data.user) {
          const { error: profileError } = await supabase
            .from('profiles')
            .update({
              full_name: fullName,
              user_id: userId,
              avatar_url: avatarUrl,
            })
            .eq('id', data.user.id);

          if (profileError) throw profileError;
        }

        toast({
          title: "Success",
          description: "Please check your email to confirm your account",
        });
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast({
          title: "Success",
          description: "Successfully signed in!",
        });
      }
    } catch (error: any) {
      setError(error.message);
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
              <>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium">
                      Full Name
                    </label>
                    <input
                      id="fullName"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="mt-1 block w-full rounded-md border bg-background px-3 py-2"
                    />
                  </div>
                  <div>
                    <label htmlFor="userId" className="block text-sm font-medium">
                      User ID
                    </label>
                    <input
                      id="userId"
                      type="text"
                      value={userId}
                      onChange={(e) => setUserId(e.target.value)}
                      className="mt-1 block w-full rounded-md border bg-background px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Profile Picture
                    </label>
                    <ProfilePicture
                      url={avatarUrl}
                      onUpload={(url) => setAvatarUrl(url)}
                      size={100}
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border bg-background px-3 py-2"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="mt-1 block w-full rounded-md border bg-background px-3 py-2"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Password must be at least 6 characters long
              </p>
            </div>

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

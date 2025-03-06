
import { Mail, Info } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ConfirmationSentScreenProps {
  email: string;
  onBackToSignIn: () => void;
}

export const ConfirmationSentScreen = ({ email, onBackToSignIn }: ConfirmationSentScreenProps) => {
  return (
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
          onClick={onBackToSignIn}
          className="text-sm text-primary hover:underline"
        >
          Back to Sign In
        </button>
      </div>
    </div>
  );
};

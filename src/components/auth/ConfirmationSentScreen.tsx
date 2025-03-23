
import React from 'react';
import { Button } from "@/components/ui/button";
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';

interface ConfirmationSentScreenProps {
  email: string;
  onBackToSignIn: () => void;
}

export const ConfirmationSentScreen: React.FC<ConfirmationSentScreenProps> = ({ 
  email, 
  onBackToSignIn 
}) => {
  return (
    <div className="w-full max-w-md mx-auto rounded-xl border bg-card/95 p-8 shadow-lg space-y-6 backdrop-blur-sm">
      <div className="flex flex-col items-center justify-center space-y-3">
        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
          <CheckCircle className="h-6 w-6 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-center">Confirmation Email Sent</h2>
        <p className="text-center text-muted-foreground">
          We've sent a confirmation email to:
        </p>
        <div className="flex items-center gap-2 p-3 rounded-md bg-secondary/10 border border-border">
          <Mail className="h-5 w-5 text-secondary" />
          <span className="font-medium">{email}</span>
        </div>
      </div>
      
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground text-center">
          Please check your inbox and click on the confirmation link to complete your registration.
        </p>
        
        <div className="bg-muted/30 p-4 rounded-lg border border-border text-sm">
          <p className="font-medium mb-1">Don't see the email?</p>
          <ul className="list-disc ml-5 space-y-1">
            <li>Check your spam or junk folder</li>
            <li>Make sure the email address is correct</li>
            <li>Allow a few minutes for the email to arrive</li>
          </ul>
        </div>
      </div>
      
      <Button 
        onClick={onBackToSignIn}
        variant="outline" 
        className="w-full flex items-center justify-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Sign In
      </Button>
    </div>
  );
};

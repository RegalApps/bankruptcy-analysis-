
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
    <div className="w-full max-w-md mx-auto rounded-xl border bg-card/95 p-6 sm:p-8 shadow-lg space-y-5 sm:space-y-6 backdrop-blur-sm">
      <div className="flex flex-col items-center justify-center space-y-3">
        <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-primary/10 flex items-center justify-center">
          <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-center">Confirmation Email Sent</h2>
        <p className="text-center text-muted-foreground text-sm sm:text-base">
          We've sent a confirmation email to:
        </p>
        <div className="flex items-center gap-2 p-2 sm:p-3 rounded-md bg-secondary/10 border border-border w-full max-w-xs break-all">
          <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-secondary flex-shrink-0" />
          <span className="font-medium text-sm sm:text-base">{email}</span>
        </div>
      </div>
      
      <div className="space-y-4">
        <p className="text-xs sm:text-sm text-muted-foreground text-center">
          Please check your inbox and click on the confirmation link to complete your registration.
        </p>
        
        <div className="bg-muted/30 p-3 sm:p-4 rounded-lg border border-border text-xs sm:text-sm">
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

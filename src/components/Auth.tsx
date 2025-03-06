
import { useState } from 'react';
import { AuthLayout } from './auth/AuthLayout';
import { AuthForm } from './auth/AuthForm';
import { ConfirmationSentScreen } from './auth/ConfirmationSentScreen';

export const Auth = () => {
  const [confirmationSent, setConfirmationSent] = useState(false);
  const [confirmationEmail, setConfirmationEmail] = useState('');

  const handleConfirmationSent = (email: string) => {
    setConfirmationEmail(email);
    setConfirmationSent(true);
  };

  const handleBackToSignIn = () => {
    setConfirmationSent(false);
  };

  return (
    <AuthLayout>
      {confirmationSent ? (
        <ConfirmationSentScreen 
          email={confirmationEmail}
          onBackToSignIn={handleBackToSignIn}
        />
      ) : (
        <AuthForm onConfirmationSent={handleConfirmationSent} />
      )}
    </AuthLayout>
  );
};

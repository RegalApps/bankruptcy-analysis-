
import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout = ({ children }: AuthLayoutProps) => {
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
        {children}
      </div>
    </div>
  );
};

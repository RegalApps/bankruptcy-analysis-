
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl mb-8">Page not found</p>
        <Button 
          onClick={() => navigate('/')}
          className="px-6"
        >
          Go to Home
        </Button>
      </div>
    </MainLayout>
  );
};

export default NotFoundPage;

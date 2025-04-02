
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Footer } from '@/components/layout/Footer';

const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <MainLayout>
        <div className="container py-8">
          <h1 className="text-3xl font-bold">Home Page</h1>
          <p className="text-muted-foreground mt-2">
            Welcome to the application
          </p>
        </div>
      </MainLayout>
      <Footer compact className="mt-auto w-full" />
    </div>
  );
};

export default HomePage;

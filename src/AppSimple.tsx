
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './components/ui/theme-provider';
import { Toaster } from 'sonner';

// Create a simple page that will definitely render
const HomePage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="container max-w-md mx-auto p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Secure Files AI</h1>
          <p className="mb-6">Your document management application</p>
          <a 
            href="/documents" 
            className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
          >
            Go to Documents
          </a>
        </div>
      </div>
    </div>
  );
};

// Create a basic fallback for documents page
const DocumentsPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="container max-w-xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Documents</h1>
        <div className="bg-white p-6 rounded-lg shadow">
          <p>Loading document management system...</p>
        </div>
      </div>
    </div>
  );
};

// A simple version of the app that should render without errors
const AppSimple = () => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="app-theme">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/documents" element={<DocumentsPage />} />
            <Route path="*" element={<HomePage />} />
          </Routes>
          <Toaster />
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default AppSimple;

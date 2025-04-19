
import React from 'react';
import { Outlet } from 'react-router-dom';

export const AppLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

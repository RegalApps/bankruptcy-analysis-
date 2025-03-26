
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
  activeClassName?: string;
  prefetch?: boolean;
  onClick?: () => void;
}

export const NavLink: React.FC<NavLinkProps> = ({
  to,
  children,
  className = '',
  activeClassName = 'bg-accent text-accent-foreground',
  prefetch = true,
  onClick
}) => {
  const location = useLocation();
  const isActive = location.pathname === to || 
                  (to !== '/' && location.pathname.startsWith(to));
  
  // Handle prefetching on hover
  const handleMouseEnter = React.useCallback(() => {
    if (prefetch) {
      // Implementation depends on your routing library
      // This is a simple example for React Router
      const path = to.startsWith('/') ? to.substring(1) : to;
      
      if (path === 'documents') {
        import('../DocumentList/DocumentManagement').catch(() => {});
      } else if (path === 'analytics') {
        import('../../pages/AnalyticsPage').catch(() => {});
      } else if (path === '' || path === 'index') {
        import('../../pages/Index').catch(() => {});
      }
    }
  }, [to, prefetch]);
  
  return (
    <Link
      to={to}
      className={cn(
        'flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors',
        className,
        isActive ? activeClassName : 'hover:bg-accent hover:text-accent-foreground'
      )}
      onMouseEnter={handleMouseEnter}
      onClick={onClick}
    >
      {children}
    </Link>
  );
};

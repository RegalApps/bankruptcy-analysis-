
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
  exact?: boolean; // Added exact prop for exact path matching
}

export const NavLink: React.FC<NavLinkProps> = ({
  to,
  children,
  className = '',
  activeClassName = 'bg-accent text-accent-foreground',
  prefetch = true,
  onClick,
  exact = false
}) => {
  const location = useLocation();
  
  // Check if the current path matches the link
  const isActive = exact 
    ? location.pathname === to 
    : (to !== '/' ? location.pathname.startsWith(to) : location.pathname === '/');
  
  // Safer implementation of prefetching with error handling
  const handleMouseEnter = React.useCallback(() => {
    if (prefetch) {
      try {
        const path = to.startsWith('/') ? to.substring(1) : to;
        
        // Check path and import corresponding modules
        if (path === 'documents' || path === 'documents/') {
          import('../../pages/DocumentsPage').catch(err => 
            console.warn('Error prefetching DocumentsPage:', err)
          );
        } 
        else if (path === 'analytics' || path === 'analytics/') {
          import('../../pages/AnalyticsPage').catch(err => 
            console.warn('Error prefetching AnalyticsPage:', err)
          );
        }
        else if (path === '' || path === 'index' || path === '/') {
          import('../../pages/Index').catch(err => 
            console.warn('Error prefetching IndexPage:', err)
          );
        }
      } catch (error) {
        console.warn('Prefetch error:', error);
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

import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";

export interface AvailableUser {
  id: string;
  full_name: string | null;
  email: string;
}

// Mock users for local implementation
const mockUsers: AvailableUser[] = [
  {
    id: "user-1",
    full_name: "John Doe",
    email: "john.doe@example.com"
  },
  {
    id: "user-2",
    full_name: "Jane Smith",
    email: "jane.smith@example.com"
  },
  {
    id: "user-3",
    full_name: "Alex Johnson",
    email: "alex.johnson@example.com"
  }
];

export const useAvailableUsers = () => {
  const { toast } = useToast();
  const [availableUsers, setAvailableUsers] = useState<AvailableUser[]>([]);

  const fetchAvailableUsers = async () => {
    try {
      // Check if we have users in localStorage
      const storedUsers = localStorage.getItem('available_users');
      
      if (storedUsers) {
        // Use stored users if available
        setAvailableUsers(JSON.parse(storedUsers));
      } else {
        // Initialize with mock users
        localStorage.setItem('available_users', JSON.stringify(mockUsers));
        setAvailableUsers(mockUsers);
      }
    } catch (error) {
      console.error('Error fetching available users:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch available users"
      });
      
      // Fallback to mock users if there's an error
      setAvailableUsers(mockUsers);
    }
  };

  useEffect(() => {
    fetchAvailableUsers();
    
    // Set up listener for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'available_users') {
        fetchAvailableUsers();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return { availableUsers };
};

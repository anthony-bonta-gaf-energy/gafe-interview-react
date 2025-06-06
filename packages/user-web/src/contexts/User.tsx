import type { User } from '@/services/users'; // Adjust the import path as necessary
import React, { createContext, ReactNode, useContext, useState } from 'react';

interface UserContextType {
  saveUsers: (users: User[]) => void;
  users: User[];
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Create a provider component
interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);

  const saveUsers = (newUsers: User[]) => setUsers([...newUsers]);

  return <UserContext.Provider value={{ saveUsers, users }}>{children}</UserContext.Provider>;
};

// Create a custom hook to use the context
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

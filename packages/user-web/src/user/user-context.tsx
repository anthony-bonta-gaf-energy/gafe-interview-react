import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { APIClient } from "./api-client";
import { mockUsers } from "./user-mock";
import { User } from "./user.mjs";

export const fetchUsers = async (): Promise<User[]> => {
  try {
    return await APIClient.request<User[]>({ url: '/users', method: 'GET' });
  } catch (err) {
    // fallback a mocks
    return mockUsers;
  }
};

type UsersContextType = {
  users: User[];
  addUser: (user: User) => void;
  updateUser: (id: string, newData: Partial<User>) => void;
};

const UsersContext = createContext<UsersContextType | null>(null);

export function UsersProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>([]);
  useEffect(() => {
    fetchUsers().then(setUsers)
  }, []);
  const addUser = (user: User) =>
    setUsers(prev => Array.isArray(prev) ? [...prev, user] : [user]);
  const updateUser = (id: string, newData: Partial<User>) =>
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...newData } : u));

  return (
    <UsersContext.Provider value={{ users, addUser, updateUser }}>
      {children}
    </UsersContext.Provider>
  );
}

export function useUsers() {
  const context = useContext(UsersContext);
  if (!context) throw new Error("useUsers must be used within a UsersProvider");
  return context;
}

import { useCallback, useEffect, useState } from 'react';
import {
  createUser as apiCreateUser,
  getUser as apiGetUser,
  updateUser as apiUpdateUser,
  getUsers,
} from '../user/api/user-api';
import { User } from '../user/user.mjs';

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getUsers();
      setUsers(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  const getUser = useCallback(async (id: string) => {
    try {
      setLoading(true);
      const user = await apiGetUser(id);
      setSelectedUser(user);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  const createUser = async (user: Omit<User, 'id'>) => {
    return await apiCreateUser(user);
  };

  const updateUser = async (user: User) => {
    return await apiUpdateUser(user);
  };

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    users,
    selectedUser,
    loading,
    error,

    refresh,
    getUser,
    createUser,
    updateUser,
  };
}

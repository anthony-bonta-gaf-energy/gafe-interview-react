import { useCallback, useEffect, useState } from 'react';
import { createUser as apiCreateUser, getUsers } from '../user/api/user-api';
import { User } from '../user/user.mjs';

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    setUsers(await getUsers());
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const createUser = async (u: Omit<User, 'id'>) => {
    return await apiCreateUser(u);
  };

  return { users, loading, createUser, refresh };
}

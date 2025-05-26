import { createUser as apiCreateUser } from '../user/api/user-api';
import { User } from '../user/user.mjs';

export function useUsers() {
  const createUser = async (user: Omit<User, 'id'>): Promise<User> => {
    return await apiCreateUser(user);
  };

  return { createUser };
}

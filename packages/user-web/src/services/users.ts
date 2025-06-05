const USERS_STORAGE_KEY = 'users';
import { UserType } from '@/utils/constants';

export interface User {
  id?: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  type: UserType;
}

/**
 * Gets all users from localStorage
 */
export const getAllUsers = (): User[] => {
  const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);

  if (!storedUsers) {
    return [];
  }

  return JSON.parse(storedUsers) as User[];
};

/**
 * Saves a user to localStorage
 * @param user User to save
 * @returns The saved user with ID
 */
export const saveUser = (user: User): User => {
  const users = getAllUsers();

  // Generate a new ID if one doesn't exist
  const newUser = {
    ...user,
    id: user.id || crypto.randomUUID(),
  };

  // Add the new user to the list
  users.push(newUser);

  // Save to localStorage
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));

  return newUser;
};

/**
 * Gets a user by ID from localStorage
 * @param id ID of the user to find
 * @returns User if found, null otherwise
 */
export const getUserById = (id: string): User | null => {
  const users = getAllUsers();
  const user = users.find(u => u.id === id);
  return user || null;
};

/**
 * Updates an existing user in localStorage
 * @param user User to update
 * @returns Updated user or null if not found
 */
export const updateUser = (user: User): User | null => {
  if (!user.id) return null;

  const users = getAllUsers();
  const index = users.findIndex(u => u.id === user.id);

  if (index === -1) return null;

  users[index] = user;
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));

  return user;
};

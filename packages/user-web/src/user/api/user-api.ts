import { User } from '../user.mjs';

const mockUsers: User[] = [];

export async function createUser(user: Omit<User, 'id'>): Promise<User> {
  await new Promise(res => setTimeout(res, 300));
  const newUser: User = { ...user, id: crypto.randomUUID() };
  mockUsers.push(newUser);
  return newUser;
}

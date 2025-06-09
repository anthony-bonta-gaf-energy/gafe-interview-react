import { User } from '../user.mts';

const users = new Map<string, User>();

export async function saveUser(user: User): Promise<void> {
  users.set(user.email, user);
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
  return Promise.resolve(users.get(email));
}

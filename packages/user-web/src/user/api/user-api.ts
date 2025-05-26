import { User, UserType } from '../user.mjs';

const mockUsers: User[] = [
  {
    id: 'ff899ea1-5397-42b4-996d-f52492e8c835',
    firstName: 'Tom',
    lastName: 'Sawyer',
    email: 'tom@email.fake',
    phoneNumber: '+1-214-555-7294',
    type: UserType.Basic,
  },
];

export async function getUsers(): Promise<User[]> {
  await new Promise(res => setTimeout(res, 200));
  return [...mockUsers];
}

export async function createUser(user: Omit<User, 'id'>): Promise<User> {
  await new Promise(res => setTimeout(res, 200));
  const newUser: User = { ...user, id: crypto.randomUUID() };
  mockUsers.push(newUser);
  return newUser;
}

export async function getUser(id: string): Promise<User> {
  await new Promise(res => setTimeout(res, 200));
  const user = mockUsers.find(u => u.id === id);
  if (!user) throw new Error('User not found');
  return user;
}

export async function updateUser(updatedUser: User): Promise<User> {
  await new Promise(res => setTimeout(res, 200));
  const index = mockUsers.findIndex(u => u.id === updatedUser.id);
  if (index === -1) throw new Error('User not found');
  mockUsers[index] = updatedUser;
  return updatedUser;
}

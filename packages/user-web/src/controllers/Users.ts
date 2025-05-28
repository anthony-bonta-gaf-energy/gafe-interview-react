import { v4 as uuidv4 } from 'uuid';
import { ExistingUser, User, UserType } from '../user/user.mjs';

export interface UserControllerInterface {
  getUsers(): Promise<ExistingUser[]>;
  getUser(id: string): Promise<ExistingUser | undefined>;
  createUser(newUser: User): Promise<ExistingUser>;
  updateUser(id: string, updatedData: Partial<ExistingUser>): Promise<ExistingUser | undefined>;
}

export class UserController implements UserControllerInterface {
  private readonly apiUrl = '/api/users';
  private users: ExistingUser[] = [
    {
      id: 'ff899ea1-5397-42b4-996d-f52492e8c835',
      firstName: 'Tom',
      lastName: 'Sawyer',
      email: 'tom@email.fake',
      phoneNumber: '+1-214-555-7294',
      type: UserType.Basic,
    },
    {
      id: 'ff899ea1-5397-42b4-996d-f52492e8c629',
      firstName: 'Mark',
      lastName: 'Twain',
      email: 'becky@example.com',
      phoneNumber: '+1-214-555-7294',
      type: UserType.Admin,
    },
  ];

  async getUsers(): Promise<ExistingUser[]> {
    return Promise.resolve(this.users);
  }
  // async getUsers(): Promise<ExistingUser[]> {
  //   try {
  //     const response = await fetch(this.apiUrl);

  //     if (!response.ok) {
  //       throw new Error(`Failed to fetch users: ${response.statusText}`);
  //     }

  //     const users: ExistingUser[] = await response.json();
  //     return users;
  //   } catch (error) {
  //     console.error('Error fetching users:', error);
  //     throw error;
  //   }
  // }

  getUser(id: string): Promise<ExistingUser | undefined> {
    return Promise.resolve(this.users.find(user => user.id === id));
  }

  createUser(newUser: User): Promise<ExistingUser> {
    const id = uuidv4();
    const user: ExistingUser = { ...newUser, id };
    this.users.push(user);

    return Promise.resolve(user);
  }

  updateUser(id: string, updatedData: Partial<ExistingUser>): Promise<ExistingUser | undefined> {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex === -1) return Promise.resolve(undefined);
    this.users[userIndex] = { ...this.users[userIndex], ...updatedData };

    return Promise.resolve(this.users[userIndex]);
  }
}

export const userInstance = new UserController();

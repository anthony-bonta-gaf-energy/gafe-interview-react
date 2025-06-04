import { UserType } from '@/utils/constants';

export interface User {
  id?: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  type: UserType;
}

const initialUsers: User[] = [
  {
    id: 'ff899ea1-5397-42b4-996d-f52492e8c835',
    firstName: 'Tom',
    lastName: 'Sawyer',
    phoneNumber: '+1-214-555-7294',
    email: 'tom@email.fake',
    type: UserType.Basic,
  },
];

const getAllUsers = (): Promise<User[]> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(initialUsers);
    }, 800);
  });
};

export { getAllUsers };

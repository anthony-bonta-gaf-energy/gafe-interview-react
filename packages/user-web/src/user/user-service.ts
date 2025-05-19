import { User, UserType } from './user.mjs';

export const getUserList = async (): Promise<User[]> => {
  const response = await fetch('/api/users');
  if (!response.ok) {
    throw new Error('Something went wrong trying to fetch the user list');
  }
  return await response.json();
};

export const getUser = async (id: string): Promise<User> => {
  // const response = await fetch(`/api/users/${id}`);
  // if (!response.ok) {
  //   if (response.status === 404) {
  //     throw new Error('User not found');
  //   }
  //
  //   throw new Error('Something went wrong trying to fetch the user');
  // }
  // return await response.json();

  // NOTE: Mocking the response due to the api not existing yet
  return {
    id: id,
    firstName: 'Tom',
    lastName: 'Sawyer',
    phoneNumber: '+1-214-555-7294',
    email: 'tom@email.fake',
    type: UserType.Basic,
  };
};

export const createUser = async (user: User): Promise<User> => {
  const response = await fetch('/api/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  });
  if (!response.ok) {
    throw new Error('Something went wrong trying to create the user');
  }
  return await response.json();
};

export const updateUser = async (id: string, user: Partial<User>): Promise<User> => {
  const response = await fetch(`/api/users/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  });
  if (!response.ok) {
    throw new Error('Something went wrong trying to update the user');
  }

  return response.json();
};

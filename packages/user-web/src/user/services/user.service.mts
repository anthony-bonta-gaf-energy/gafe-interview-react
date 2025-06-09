import { User } from '../user.mjs';

export async function saveUser(user: User): Promise<void> {
  const response = await fetch('/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  });

  if (!response.ok) {
    throw new Error(`Failed to save user:  ${response.statusText}`);
  }
}

export async function getUserById(id: string): Promise<User | null> {
  const response = await fetch(`/users/${id}`);

  if (!response.ok) {
    return null;
  }

  return response.json();
}

export async function updateUser(userId: string, user: Partial<User>) {
  const response = await fetch(`/users/${userId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  });

  if (!response.ok) {
    throw new Error(`Failed to update user: ${response.statusText}`);
  }
}

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

import { User } from '../user/user.mjs';

interface IResponse<T> {
  ok: boolean;
  data: T | null;
  error?: unknown;
}

const base_url = '';

async function fetcher<T>(input: URL | RequestInfo, init?: RequestInit): Promise<T> {
  const response = await fetch(input, init);

  if (!response.ok) {
    throw new Error(`${response.status}`);
  }

  const data = response.json();
  return data;
}

async function handleFetch<T>(input: URL | RequestInfo, init?: RequestInit): Promise<IResponse<T>> {
  try {
    const result = await fetcher<T>(input, init);
    return {
      ok: true,
      data: result,
    };
  } catch (err) {
    return {
      ok: false,
      data: null,
      error: err,
    };
  }
}

export const getUsers = async () => {
  const url = new URL(`/users`, base_url);
  return await handleFetch<User[]>(url);
};

export const getUserById = async (id: string) => {
  const url = new URL(`/users/${id}`, base_url);
  return await handleFetch<User>(url);
};

export const createUser = async (userData: Omit<User, 'id'>) => {
  const url = new URL(`/users`, base_url);
  const init = {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(userData),
  };
  return await handleFetch<User>(url, init);
};

export const updateUser = async (id: string, userData: Partial<User>) => {
  const url = new URL(`/users/${id}`, base_url);
  const init = {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'PATCH',
    body: JSON.stringify(userData),
  };
  return await handleFetch<User>(url, init);
};

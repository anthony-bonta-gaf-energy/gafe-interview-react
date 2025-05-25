import { useCallback, useEffect, useState } from "react";

import { User, UserType } from "../user/user.mjs";

const WAIT_TIME = 300;


const mockUsers: User[] = [
  {
    id: "ff899ea1-5397-42b4-996d-f52492e8c835",
    firstName: "Tom",
    lastName: "Sawyer",
    phoneNumber: "+1-214-555-7294",
    email: "tom@email.fake",
    type: UserType.Basic
  }
]

// can use fetch with a api
const fetchUser: (id: string) => Promise<User | undefined> = async (id) => {
  const users: User[] = await new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockUsers);
    }, WAIT_TIME);
  });

  const user = users.find(user => user.id === id);

  return user;
}

const fetchUsers: () => Promise<User[]> = async () => {
  const users: User[] = await new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockUsers);
    }, WAIT_TIME);
  });

  return users;
}

const mutateUser = async (user: User) => {
  const index = mockUsers.findIndex(u => u.id === user.id);
  if (index === -1) {
    mockUsers.push(user);
  } else {
    mockUsers[index] = user;
  }

  await new Promise((resolve) => {
    setTimeout(() => {
      resolve(() => { });
    }, WAIT_TIME);
  });
}

export const useGetUser = (id: string | undefined) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User>();

  useEffect(() => {
    if (!id) return;

    fetchUser(id).then(user => {
      setUser(user)
      setLoading(false)
    })
  }, [])

  return { loading, user };
}

export const useGetUsers = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetchUsers().then(users => {
      setUsers(users)
      setLoading(false)
    })
  }, [])

  return { loading, users };
}

export const useMutateUser = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const mutate = useCallback(async (user: User) => {
    setLoading(true);
    await mutateUser(user);
    setLoading(false);
    setSuccess(true);
  }, [])

  return { loading, success, mutate };
}
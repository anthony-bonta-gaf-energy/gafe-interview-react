import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { getUserById } from 'user-web/src/api/users.js';
import { FormProvider } from 'user-web/src/context/form-context.js';
import { User } from '../user.mjs';
import { UserForm } from './user-form/index.js';

const initialNewUserState: Partial<User> = {
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
};

export function UserPage() {
  const { id } = useParams();
  const [initialUserData, setInitialUserData] = useState<User | Partial<User>>();

  useEffect(() => {
    const loadUserData = async () => {
      if (id) {
        const userResponse = await getUserById(id);
        if (userResponse.ok && userResponse.data) {
          //Todo: better comparison than JSON.stringify that requires properties in the same order.
          const { id, firstName, lastName, email, phoneNumber, type } = userResponse.data;
          setInitialUserData({ id, firstName, lastName, email, phoneNumber, type });
        } else {
          console.warn(`User with ID ${id} not found.`);
          console.error(userResponse.error);
          setInitialUserData(initialNewUserState);
        }
      } else {
        setInitialUserData(initialNewUserState);
      }
    };

    loadUserData();
  }, [id]);

  if (!initialUserData) {
    return <p>loading</p>;
  }

  const title = id ? 'Edit User' : 'Create User';
  return (
    <article className="modify-user-page">
      <h2>{title}</h2>
      <FormProvider>
        <UserForm initialUserData={initialUserData} userId={id} />
      </FormProvider>
    </article>
  );
}

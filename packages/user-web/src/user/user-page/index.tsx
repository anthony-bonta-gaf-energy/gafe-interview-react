import { useParams } from 'react-router';
import { FormProvider } from 'user-web/src/context/form-context.js';
import { UserForm } from './user-form/index.js';

export function UserPage() {
  const { id } = useParams();
  const title = id ? 'Edit User' : 'Create User';
  return (
    <article className="modify-user-page">
      <h2>{title}</h2>
      <FormProvider>
        <UserForm />
      </FormProvider>
    </article>
  );
}

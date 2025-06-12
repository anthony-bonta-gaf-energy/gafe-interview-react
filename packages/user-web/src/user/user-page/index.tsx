import { useParams } from 'react-router';
import { UserForm } from './user-form/index.js';

export function UserPage() {
  const { id } = useParams();
  const title = id ? 'Edit User' : 'Create User';
  return (
    <article className="modify-user-page">
      <h2>{title}</h2>
      <UserForm />
    </article>
  );
}

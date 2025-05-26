import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { useUsers } from '../hooks/use-users';
import { User, UserType } from './user.mjs';

export function UserPage() {
  const navigate = useNavigate();
  const { createUser } = useUsers();

  const {
    register,
    handleSubmit,
    formState: { isValid, isSubmitting },
    reset,
  } = useForm<Omit<User, 'id'>>({
    mode: 'onChange',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      type: UserType.Basic,
    },
  });

  const onSubmit = async (data: Omit<User, 'id'>) => {
    await createUser(data);
    reset();
    navigate('/');
  };

  return (
    <div className="user-page">
      <h2>Create User</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>
          First Name
          <input {...register('firstName', { required: true })} />
        </label>
        <label>
          Last Name
          <input {...register('lastName', { required: true })} />
        </label>
        <label>
          Email
          <input type="email" {...register('email', { required: true })} />
        </label>
        <label>
          Phone Number
          <input type="tel" {...register('phoneNumber')} />
        </label>
        <label>
          Type
          <select {...register('type', { required: true })}>
            <option value={UserType.Basic}>Basic</option>
            <option value={UserType.Admin}>Admin</option>
          </select>
        </label>
        <button type="submit" disabled={!isValid || isSubmitting}>
          Save
        </button>
        <button type="button" onClick={() => navigate('/')}>
          Cancel
        </button>
      </form>
    </div>
  );
}

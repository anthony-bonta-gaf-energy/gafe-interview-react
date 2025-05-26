import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { useUsers } from '../hooks/use-users';
import styles from './user-page.module.css';
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
    <div className={styles['user-page']}>
      <h2>Create User</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="firstName">
          First Name
          <input id="firstName" {...register('firstName', { required: true })} />
        </label>

        <label htmlFor="lastName">
          Last Name
          <input id="lastName" {...register('lastName', { required: true })} />
        </label>

        <label htmlFor="email">
          Email
          <input id="email" type="email" {...register('email', { required: true })} />
        </label>

        <label htmlFor="phoneNumber">
          Phone Number
          <input id="phoneNumber" type="tel" {...register('phoneNumber')} />
        </label>

        <label htmlFor="type">
          Type
          <select id="type" {...register('type', { required: true })}>
            <option value={UserType.Basic}>Basic</option>
            <option value={UserType.Admin}>Admin</option>
          </select>
        </label>

        <div className={styles['button-group']}>
          <button type="submit" disabled={!isValid || isSubmitting}>
            Save
          </button>
          <button type="button" onClick={() => navigate('/')}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

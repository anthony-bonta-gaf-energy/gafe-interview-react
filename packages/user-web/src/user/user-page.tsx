import { useNavigate, useParams } from 'react-router';
import { User, UserType } from './user.mjs';
import { createUser, getUser, updateUser } from './user-service';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useEffect, useState } from 'react';

type FormData = Omit<User, 'id'>;
const INITIAL_VALUES: FormData = {
  firstName: '',
  lastName: '',
  phoneNumber: '',
  email: '',
  type: UserType.Basic,
};

export function UserPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLoading, setLoading] = useState(true);
  const isNewUser = id === 'new' || id === undefined;
  const { register, formState, handleSubmit, reset } = useForm<FormData>({
    defaultValues: INITIAL_VALUES,
  });

  const onCancel = () => {
    navigate('/');
  };

  const onResetForm = () => {
    reset();
  };

  const onSubmit: SubmitHandler<FormData> = async data => {
    try {
      if (isNewUser) {
        await createUser(data);
      } else {
        // NOTE:Update only dirty fields
        const dirtyData = Object.keys(formState.dirtyFields).reduce((acc, key) => {
          acc[key] = data[key];
          return acc;
        }, {} as Partial<FormData>);

        await updateUser(id!, dirtyData);
      }

      navigate('/');
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      if (!isNewUser) {
        try {
          const user = await getUser(id);
          // NOTE: Reset the form with the fetched user data without making the form dirty
          reset(user);
        } catch (error) {
          console.error('Error fetching user:', error);
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, [id, isNewUser]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="modify-user-page">
      <h2>{isNewUser ? 'Create New ' : 'Modify'} User</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="first-name">First Name*</label>
          <input
            type="text"
            id="first-name"
            data-testid="first-name-input"
            required
            {...register('firstName', { required: true })}
          />
        </div>
        <div>
          <label htmlFor="last-name">Last Name*</label>
          <input
            type="text"
            id="last-name"
            data-testid="last-name-input"
            required
            {...register('lastName', { required: true })}
          />
        </div>
        <div>
          <label htmlFor="phone-number">Phone Number:</label>
          <input
            type="tel"
            id="phone-number"
            data-testid="phone-number-input"
            {...register('phoneNumber')}
          />
        </div>
        <div>
          <label htmlFor="email">Email*</label>
          <input
            type="email"
            id="email"
            data-testid="email-input"
            {...register('email', { required: true })}
          />
        </div>
        <div>
          <label htmlFor="type">Type*</label>
          <select id="type" data-testid="type-input" {...register('type', { required: true })}>
            <option value={UserType.Admin}>Admin</option>
            <option value={UserType.Basic}>Basic</option>
          </select>
        </div>
        <button
          data-testid="save-button"
          type="submit"
          disabled={!formState.isValid || !formState.isDirty}
        >
          Save
        </button>
        <button type="button" disabled={!formState.isDirty} onClick={onResetForm}>
          Reset
        </button>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </form>
    </div>
  );
}

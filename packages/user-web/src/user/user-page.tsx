import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router';
import { useUsers } from '../hooks/use-users';
import styles from './user-page.module.css';
import { User, UserType } from './user.mjs';

export function UserPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const { createUser, updateUser, getUser, selectedUser } = useUsers();

  const {
    register,
    handleSubmit,
    formState: { isValid, isSubmitting, isDirty, errors, touchedFields },
    reset,
  } = useForm<Omit<User, 'id'>>({
    mode: 'onTouched',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      type: UserType.Basic,
    },
  });

  useEffect(() => {
    if (isEdit && id) getUser(id);
  }, [isEdit, id, getUser]);

  useEffect(() => {
    if (selectedUser && isEdit) {
      const { id: _discard, ...rest } = selectedUser;
      reset(rest);
    }
  }, [selectedUser, isEdit, reset]);

  const onSubmit = async (data: Omit<User, 'id'>) => {
    if (isEdit && id) {
      await updateUser({ ...data, id });
    } else {
      await createUser(data);
    }
    navigate('/');
  };

  return (
    <div className={styles['user-page']}>
      <h2>{isEdit ? 'Edit User' : 'Create User'}</h2>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <label htmlFor="firstName">
          First Name
          <input
            id="firstName"
            {...register('firstName', { required: 'First name is required' })}
            aria-invalid={!!errors.firstName}
            aria-describedby={errors.firstName ? 'firstName-error' : undefined}
          />
          {touchedFields.firstName && errors.firstName && (
            <span id="firstName-error" role="alert" className={styles['error-message']}>
              {errors.firstName.message}
            </span>
          )}
        </label>

        <label htmlFor="lastName">
          Last Name
          <input
            id="lastName"
            {...register('lastName', { required: 'Last name is required' })}
            aria-invalid={!!errors.lastName}
            aria-describedby={errors.lastName ? 'lastName-error' : undefined}
          />
          {touchedFields.lastName && errors.lastName && (
            <span id="lastName-error" role="alert" className={styles['error-message']}>
              {errors.lastName.message}
            </span>
          )}
        </label>

        <label htmlFor="email">
          Email
          <input
            id="email"
            type="email"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Invalid email address',
              },
            })}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
          {touchedFields.email && errors.email && (
            <span id="email-error" role="alert" className={styles['error-message']}>
              {errors.email.message}
            </span>
          )}
        </label>

        <label htmlFor="phoneNumber">
          Phone Number
          <input id="phoneNumber" type="tel" {...register('phoneNumber')} />
        </label>

        <label htmlFor="type">
          Type
          <select
            id="type"
            {...register('type', { required: 'Type is required' })}
            aria-invalid={!!errors.type}
            aria-describedby={errors.type ? 'type-error' : undefined}
          >
            <option value={UserType.Basic}>Basic</option>
            <option value={UserType.Admin}>Admin</option>
          </select>
          {touchedFields.type && errors.type && (
            <span id="type-error" role="alert" className={styles['error-message']}>
              {errors.type.message}
            </span>
          )}
        </label>

        <div className={styles['button-group']}>
          <button type="submit" disabled={!isValid || isSubmitting || (isEdit && !isDirty)}>
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

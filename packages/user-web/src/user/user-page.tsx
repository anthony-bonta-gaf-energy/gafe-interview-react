import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router';
import { z } from 'zod';
import { userInstance } from '../controllers/Users';
import { User, UserType } from './user.mjs';

const userSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phoneNumber: z.string().min(1, 'Phone number is required'),
  email: z.string().email('Invalid email address').min(1, 'Email is required'),
  type: z.nativeEnum(UserType),
});

type UserForm = z.infer<typeof userSchema>;

export function UserPage() {
  const navigate = useNavigate();
  const { id: userID } = useParams();

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting, isValid, isDirty },
  } = useForm<UserForm>({
    defaultValues: {
      firstName: '',
      lastName: '',
      phoneNumber: '',
      email: '',
      type: UserType.Basic,
    },
    reValidateMode: 'onChange',
    resolver: zodResolver(userSchema),
  });

  const fetchUser = async (id: string) => {
    const $user = await userInstance.getUser(id);
    if (!$user) return;
    reset($user);
  };

  useEffect(() => {
    if (!userID || userID === 'new') return;

    fetchUser(userID);
  }, [userID]);

  const onSubmit: SubmitHandler<User> = async data => {
    try {
      if (userID && userID !== 'new') {
        await userInstance.updateUser(userID, data);
      } else {
        await userInstance.createUser(data);
      }
    } catch (error) {
      setError('root', {
        message: 'An error occurred while submitting the form. Please try again later.',
      });
      console.error('Error submitting form:', error);
    } finally {
      navigate('/');
    }
  };

  const onCancel = useCallback(() => {
    navigate('/');
  }, [navigate]);

  return (
    <div className="modify-user-page p-4">
      <h2 className="text-2xl/7 font-bold text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
        User Form Page
      </h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 p-4"
        data-testid="user-form"
      >
        <input
          {...register('firstName')}
          type="text"
          placeholder="First Name"
          className="block min-w-0 grow px-4 py-2 text-base rounded-sm text-gray-900 placeholder:text-gray-400  outline-1 -outline-offset-1 outline-gray-300"
        />
        {errors.firstName && <span className="text-red-500">{errors.firstName.message}</span>}
        <input
          {...register('lastName')}
          type="text"
          placeholder="Last Name"
          className="block min-w-0 grow px-4 py-2 text-base rounded-sm text-gray-900 placeholder:text-gray-400  outline-1 -outline-offset-1 outline-gray-300"
        />
        {errors.lastName && <span className="text-red-500">{errors.lastName.message}</span>}
        <input
          {...register('phoneNumber')}
          type="text"
          placeholder="Phone Number"
          className="block min-w-0 grow px-4 py-2 text-base rounded-sm text-gray-900 placeholder:text-gray-400  outline-1 -outline-offset-1 outline-gray-300"
        />
        {errors.phoneNumber && <span className="text-red-500">{errors.phoneNumber.message}</span>}
        <input
          {...register('email')}
          type="email"
          placeholder="Email"
          data-testid="email-input"
          className="block min-w-0 grow px-4 py-2 text-base rounded-sm text-gray-900 placeholder:text-gray-400 outline-1 -outline-offset-1 outline-gray-300"
        />
        {errors.email && <span className="text-red-500">{errors.email.message}</span>}
        <div className="relative w-full flex">
          <select
            {...register('type')}
            className="col-start-1 row-start-1 h-9 appearance-none rounded-sm border-0 bg-transparent pr-7 pl-3 text-base text-gray-900 sm:text-sm outline-1 -outline-offset-1 outline-gray-300 w-full"
          >
            <option value="basic">Basic</option>
            <option value="admin">Admin</option>
          </select>
          <div className="w-4 absolute top-4 right-2 overflow-hidden inline-block">
            <div className=" h-2 w-2 bg-black -rotate-45 transform origin-top-left"></div>
          </div>
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isSubmitting || (isDirty && !isValid)}
          data-testid="save-button"
        >
          {isSubmitting ? 'Loading...' : 'Save'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded opacity-50"
        >
          Cancel
        </button>
        {errors.root && <span className="text-red-500">{errors.root.message}</span>}
      </form>
    </div>
  );
}

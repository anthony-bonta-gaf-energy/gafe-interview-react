import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { handleError } from '../shared/handleError.mjs';
import { FormField } from './components/atoms/form-field/form-field.js';
import { getUserById, saveUser, updateUser } from './services/user.service.mjs';
import { User, UserType } from './user.mjs';

export function UserPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [type, setType] = useState<UserType | ''>('');

  const navigate = useNavigate();
  const { id } = useParams();

  const initialUserRef = useRef<User | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const user = { firstName, lastName, phoneNumber, email, type: type as UserType };

      if (id) {
        await updateUser(id, user);
      } else {
        await saveUser(user);
      }

      navigate('/');
    } catch (error) {
      handleError(error);
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  const isUserFormValid = useCallback((): boolean => {
    return Boolean(firstName && lastName && email && type);
  }, [firstName, lastName, email, type]);

  const hasFormChanged = useCallback((): boolean => {
    const initialUser = initialUserRef.current;
    if (!initialUser || !id) return true;

    return (
      initialUser.firstName !== firstName ||
      initialUser.lastName !== lastName ||
      initialUser.phoneNumber !== phoneNumber ||
      initialUser.email !== email ||
      initialUser.type !== type
    );
  }, [firstName, lastName, phoneNumber, email, type, id]);

  useEffect(() => {
    const populateForm = async () => {
      if (!id) return;

      const user = await getUserById(id);
      if (!user) return;

      initialUserRef.current = user;

      setFirstName(user.firstName);
      setLastName(user.lastName);
      user.phoneNumber && setPhoneNumber(user.phoneNumber);
      setEmail(user.email);
      setType(user.type);
    };
    populateForm();
  }, [id]);

  const isSaveDisabled = useMemo(
    () => !isUserFormValid() || !hasFormChanged(),
    [isUserFormValid, hasFormChanged],
  );

  return (
    <div>
      <h1>User Page</h1>

      <form aria-label="User Form" onSubmit={handleSubmit}>
        <FormField htmlFor="firstName" label="First Name">
          <input
            id="firstName"
            name="firstName"
            type="text"
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
          />
        </FormField>
        <FormField htmlFor="lastName" label="Last Name">
          <input
            id="lastName"
            name="lastName"
            type="text"
            value={lastName}
            onChange={e => setLastName(e.target.value)}
          />
        </FormField>
        <FormField htmlFor="phoneNumber" label="Phone Number">
          <input
            id="phoneNumber"
            name="phoneNumber"
            type="tel"
            value={phoneNumber}
            onChange={e => setPhoneNumber(e.target.value)}
          />
        </FormField>
        <FormField htmlFor="email" label="Email">
          <input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </FormField>
        <FormField htmlFor="type" label="Type">
          <select
            id="type"
            name="type"
            value={type}
            onChange={e => setType(e.target.value as UserType)}
          >
            <option value="">Select...</option>
            <option value="admin">Admin</option>
            <option value="basic">Basic</option>
          </select>
        </FormField>

        <button type="submit" disabled={isSaveDisabled}>
          Save
        </button>
        <button type="button" onClick={handleCancel}>
          Cancel
        </button>
      </form>
    </div>
  );
}

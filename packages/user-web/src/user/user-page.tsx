import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router';
import { handleError } from '../shared/handleError.mjs';
import { FormField } from './components/atoms/form-field/form-field.js';
import { saveUser } from './services/user.service.mjs';
import { UserType } from './user.mjs';

export function UserPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [type, setType] = useState<UserType | ''>('');

  const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const user = { firstName, lastName, phoneNumber, email, type: type as UserType };
      await saveUser(user);

      navigate('/');
    } catch (error) {
      handleError(error);
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  const isUserFormValid = (): boolean => {
    return Boolean(firstName && lastName && email && type);
  };

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

        <button type="submit" disabled={!isUserFormValid()}>
          Save
        </button>
        <button type="button" onClick={handleCancel}>
          Cancel
        </button>
      </form>
    </div>
  );
}

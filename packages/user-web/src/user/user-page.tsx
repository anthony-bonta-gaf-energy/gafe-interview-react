import { Button, Input, Select } from '@/components';
import type { User } from '@/services/users';
import { getUserById } from '@/services/users';
import { UserType } from '@/utils/constants';
import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

interface Props {
  onSubmit: (data: User) => void;
}

export function UserPage({ onSubmit }: Props) {
  const params = useParams();
  const userId = params.id;

  const [formData, setFormData] = useState<User>({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    type: UserType.Basic,
  });

  // Handle input changes
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleSubmit = event => {
    event.preventDefault();
    onSubmit(formData);
  };

  useEffect(() => {
    if (userId) {
      const foundUser = getUserById(userId);

      if (foundUser) {
        setFormData({ ...foundUser });
      }
    }
  }, [userId]);

  const isFormDisabled = !formData.firstName || !formData.lastName || !formData.email;

  return (
    <>
      <Link to="/" className="text-blue-600 hover:text-blue-800">
        &larr; Go Back
      </Link>
      <h1 className="text-4xl font-bold text-gray-800 my-4 py-2 border-b-2 border-gray-200">
        User Profile
      </h1>
      <form id="user-form" onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="firstName"
          name="firstName"
          label="First Name"
          required
          placeholder="Enter first name"
          value={formData.firstName}
          onChange={handleChange}
        />
        <Input
          id="lastName"
          name="lastName"
          label="Last Name"
          required
          placeholder="Enter last name"
          value={formData.lastName}
          onChange={handleChange}
        />
        <Input
          id="phoneNumber"
          name="phoneNumber"
          label="Phone Number"
          type="tel"
          placeholder="Enter phone number"
          value={formData.phoneNumber}
          onChange={handleChange}
        />
        <Input
          id="email"
          name="email"
          label="Email"
          type="email"
          required
          placeholder="Enter email address"
          value={formData.email}
          onChange={handleChange}
        />
        <Select
          id="type"
          name="type"
          label="User Type"
          value={formData.type}
          onChange={handleChange}
        >
          {Object.entries(UserType).map(([key, value]) => (
            <option key={key} value={value}>
              {key}
            </option>
          ))}
        </Select>
        <Button
          text={userId === 'new' ? 'Create User' : 'Update User'}
          type="submit"
          disabled={isFormDisabled}
          color="blue"
          className="w-full"
        />
      </form>
    </>
  );
}

import Button from '@/components/Button';
import Input from '@/components/Input';
import Select from '@/components/Select';
import { UserType } from '@/utils/constants';
import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';

function UserPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    userType: UserType.Basic,
  });

  // Handle input changes
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log('Form submitted', formData);
  };

  const isFormDisabled = !formData.firstName || !formData.lastName || !formData.email;

  return (
    <>
      <Link to="/" className="text-blue-600 hover:text-blue-800">
        &larr; Go Back
      </Link>
      <h1 className="text-4xl font-bold text-gray-800 my-4 py-2 border-b-2 border-gray-200">
        User Profile
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          name="firstName"
          label="First Name"
          required
          placeholder="Enter first name"
          value={formData.firstName}
          onChange={handleChange}
        />
        <Input
          name="lastName"
          label="Last Name"
          required
          placeholder="Enter last name"
          value={formData.lastName}
          onChange={handleChange}
        />
        <Input
          name="phoneNumber"
          label="Phone Number"
          type="tel"
          placeholder="Enter phone number"
          value={formData.phoneNumber}
          onChange={handleChange}
        />
        <Input
          name="email"
          label="Email"
          type="email"
          required
          placeholder="Enter email address"
          value={formData.email}
          onChange={handleChange}
        />
        <Select name="userType" label="User Type" value={formData.userType} onChange={handleChange}>
          {Object.entries(UserType).map(([key, value]) => (
            <option key={key} value={value}>
              {key}
            </option>
          ))}
        </Select>
        <Button
          text="Save"
          type="submit"
          disabled={isFormDisabled}
          color="blue"
          className="w-full"
        />
      </form>
    </>
  );
}

export default UserPage;

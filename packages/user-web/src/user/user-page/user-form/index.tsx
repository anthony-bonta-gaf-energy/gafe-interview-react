import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { createUser, updateUser } from '../../../api/users.js';
import { useFormValidation } from '../../../context/form-context.js';
import { User, UserType, UserTypeSelect } from '../../user.mjs';
import { FormInput } from './form-input.js';
import { FormSelect } from './form-select.js';
interface UserFormProps {
  userId?: string;
  initialUserData: Partial<User>;
}

export const UserForm = ({ userId, initialUserData }: UserFormProps) => {
  const { isFormValid } = useFormValidation();
  const navigate = useNavigate();
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (initialUserData) {
      setIsDirty(userId ? false : Object.values(initialUserData).some(val => val !== ''));
    }
  }, [initialUserData, userId]);

  const navigateToList = () => navigate(`/`);
  const handleFormChange = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      const formData = new FormData(e.currentTarget);

      const newUserInfo: Partial<User> = {
        ...(userId && { id: userId }),
        firstName: formData.get('firstName') as string,
        lastName: formData.get('lastName') as string,
        email: formData.get('email') as string,
        phoneNumber: (formData.get('phoneNumber') as string) || undefined, // Make phoneNumber optional if empty
        type: formData.get('type') as UserType,
      };

      setIsDirty(JSON.stringify(newUserInfo) !== JSON.stringify(initialUserData));
    },
    [initialUserData],
  );
  const handleSave = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const formData = new FormData(e.currentTarget);
      const newUser: Omit<User, 'id'> = {
        firstName: formData.get('firstName') as string,
        lastName: formData.get('lastName') as string,
        email: formData.get('email') as string,
        phoneNumber: (formData.get('phoneNumber') as string) || undefined, // Make phoneNumber optional if empty
        type: formData.get('type') as UserType,
      };

      const result = userId ? await updateUser(userId, newUser) : await createUser(newUser);

      if (result.ok) {
        navigateToList();
      } else if (result.error) {
        console.error(result.error);
      }
    },
    [userId],
  );

  const isSaveButtonEnabled = isFormValid && (!userId || isDirty);

  return (
    <form onSubmit={handleSave} onChange={handleFormChange}>
      <FormInput
        name="firstName"
        label="First Name"
        defaultValue={initialUserData.firstName}
        required
      />
      <FormInput
        name="lastName"
        label="Last Name"
        defaultValue={initialUserData.lastName}
        required
      />
      <FormInput
        name="email"
        label="Email"
        type="email"
        defaultValue={initialUserData.email}
        required
      />
      <FormInput
        name="phoneNumber"
        label="Phone Number"
        type="tel"
        defaultValue={initialUserData.phoneNumber}
      />
      <FormSelect name="type" label="Type" defaultValue={initialUserData.type} required>
        <option value={UserTypeSelect.Empty}></option>
        <option value={UserTypeSelect.Basic}>Basic</option>
        <option value={UserTypeSelect.Admin}>Admin</option>
      </FormSelect>
      <button type="submit" disabled={!isSaveButtonEnabled}>
        Save
      </button>
      <button type="button" onClick={navigateToList}>
        Cancel
      </button>
    </form>
  );
};

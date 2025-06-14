import { useNavigate } from 'react-router';
import { createUser } from '../../../api/users.js';
import { useFormValidation } from '../../../context/form-context.js';
import { User, UserType, UserTypeSelect } from '../../user.mjs';
import { FormInput } from './form-input.js';
import { FormSelect } from './form-select.js';

export const UserForm = () => {
  const { isFormValid } = useFormValidation();
  const navigate = useNavigate();

  const navigateToList = () => navigate(`/`);
  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const newUser: Omit<User, 'id'> = {
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      email: formData.get('email') as string,
      phoneNumber: (formData.get('phoneNumber') as string) || undefined, // Make phoneNumber optional if empty
      type: formData.get('type') as UserType,
    };

    const result = await createUser(newUser);

    if (result.ok) {
      navigateToList();
    } else if (result.error) {
      console.error(result.error);
    }
  };

  return (
    <form onSubmit={handleSave}>
      <FormInput name="firstName" label="First Name" required />
      <FormInput name="lastName" label="Last Name" required />
      <FormInput name="email" label="Email" type="email" required />
      <FormInput name="phoneNumber" label="Phone Number" type="tel" />
      <FormSelect name="type" label="Type" required>
        <option value={UserTypeSelect.Empty}></option>
        <option value={UserTypeSelect.Basic}>Basic</option>
        <option value={UserTypeSelect.Admin}>Admin</option>
      </FormSelect>
      <button type="submit" disabled={!isFormValid}>
        Save
      </button>
      <button type="button" onClick={navigateToList}>
        Cancel
      </button>
    </form>
  );
};

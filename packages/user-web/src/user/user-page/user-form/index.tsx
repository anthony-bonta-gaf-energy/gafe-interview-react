import { useFormValidation } from '../../../context/form-context.js';
import { UserTypeSelect } from '../../user.mjs';
import { FormInput } from './form-input.js';
import { FormSelect } from './form-select.js';

export const UserForm = () => {
  const { isFormValid } = useFormValidation();
  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
    </form>
  );
};

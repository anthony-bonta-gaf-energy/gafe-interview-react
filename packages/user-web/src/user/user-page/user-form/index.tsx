import { UserType } from '../../user.mjs';
import { FormInput } from './form-input.js';
import { FormSelect } from './form-select.js';

export const UserForm = () => {
  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };
  return (
    <form onSubmit={handleSave}>
      <FormInput name="firstName" label="First Name" />
      <FormInput name="lastName" label="Last Name" />
      <FormInput name="phoneNumber" label="Phone Number" type="tel" />
      <FormInput name="email" label="Email" type="email" />
      <FormSelect name="type" label="Type">
        <option value={UserType.Basic}>Basic</option>
        <option value={UserType.Admin}>Admin</option>
      </FormSelect>
      <button type="submit">Save</button>
    </form>
  );
};

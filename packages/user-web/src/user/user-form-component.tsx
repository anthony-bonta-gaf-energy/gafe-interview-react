// UserForm is a component that allows admin users to create or edit a user
// this component should be responsable for handling the form submission and validation
// there are a couple ways to manage its state, you can use the useState hook or the useReducer hook
// in order to test it we should keep the fields controlled and use the onChange event handler to update the state
// considerations: 
// initial values, if we are editing a user, we should pass the user object as a prop and use it to set the initial values of the form
// keep the state values of the form separate to the validations errors

// keeping UserForm data partial since we might not need all the fields to create a user
export type PartialUser = Partial<User>;
interface UserFormProps {
  initialValues?: User;
  onSave: (values: User) => void;
  onCancel: () => void;
}
const emptyForm = {
  firstName: '',
  lastName: '',
  phoneNumber: '',
  email: '',
};
import React from "react";
import { User, UserType } from "./user.mjs";

export function UserForm({ initialValues, onSave, onCancel }: UserFormProps) {
  const [form, setForm] = React.useState<User | PartialUser>(emptyForm);

  // list of fields to make sure are included in the form
  const requiredFields = ["firstName", "lastName", "email", "type"];


  // selector used for validating the fields, and make sure are filled
  // form is able to prevent the submit because the required keyword but we need to make sure
  // that the fields are filled before submitting
  const isFormValid = requiredFields.every(field => form[field]);

  // selector usedfull to determine if the form is in edit mode or create mode
  const isEditMode = initialValues !== undefined;

  // selector usefull to determine if the form has been modified
  const isDirty = (initialFormValues: PartialUser): boolean => {
    return requiredFields.concat(['phoneNumber']).some(
      field => form[field] !== initialFormValues[field]
    );
  };

  // selector usefull to determine is the save buttons should be enabled
  const isSaveButtonEnabled = isFormValid && (isEditMode ? isDirty(initialValues) : true);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {// add types
    // make sure to validate the form before submitting
    event.preventDefault();

    const user: User = {
      id: form.id,
      firstName: form.firstName as string,
      lastName: form.lastName as string,
      email: form.email as string,
      phoneNumber: form.phoneNumber, // this could be undefined
      type: form.type as UserType,
    };

    onSave(user);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    if (name === "phoneNumber" && value === "") {
      setForm(f => ({ ...f, [name]: undefined }));
      return;
    };
    setForm(f => ({ ...f, [name]: value }));
  };

  // since this is a controlled component we should take care to initilize the fields
  // fields should be initialize only if the user exist or initialvalues are provide
  // if initial values are not provided that means its a new user case
  React.useEffect(() => {
    // Solo actualiza si initialValues cambia y no son iguales
    if (initialValues) {
      setForm(initialValues);
    } else {
      setForm(emptyForm);
    }
  }, [initialValues]);


  const {
    firstName,
    lastName,
    phoneNumber,
    email,
    type,
  } = form;

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="firstName">First Name</label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            value={firstName}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="lastName">Last Name</label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            value={lastName}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="phoneNumber">Phone Number</label>
          <input
            id="phoneNumber"
            name="phoneNumber"
            type="tel"
            value={phoneNumber || ""}
            onChange={handleChange}
            pattern="[+0-9\-() ]*"
          />
        </div>

        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="type">Type</label>
          <select
            id="type"
            name="type"
            value={type}
            onChange={handleChange}
            required
          >
            <option value="">Select type</option>
            <option value="admin">Admin</option>
            <option value="basic">Basic</option>
          </select>
        </div>
        <div>
          <button data-testid="saveButton" type="submit" disabled={!isSaveButtonEnabled}>Save</button>
          <button type="reset" data-testid="cancelButton" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </>
  );
}

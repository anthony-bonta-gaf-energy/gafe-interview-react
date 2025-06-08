import { FormEvent } from 'react';

export function UserPage() {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // TODO: save user
  };

  return (
    <div>
      <h1>User Page</h1>

      <form aria-label="User Form" onSubmit={handleSubmit}>
        <div className="form-field">
          <label htmlFor="firstName">First Name</label>
          <input id="firstName" name="firstName" type="text" />
        </div>
        <div className="form-field">
          <label htmlFor="lastName">Last Name</label>
          <input id="lastName" name="lastName" type="text" />
        </div>
        <div className="form-field">
          <label htmlFor="phoneNumber">Phone Number</label>
          <input id="phoneNumber" name="phoneNumber" type="tel" />
        </div>
        <div className="form-field">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" />
        </div>
        <div className="form-field">
          <label htmlFor="type">Type</label>
          <select id="type" name="type">
            <option value="">Select...</option>
            <option value="admin">Admin</option>
            <option value="basic">Basic</option>
          </select>
        </div>
      </form>
    </div>
  );
}

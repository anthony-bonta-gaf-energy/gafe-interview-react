import { FormEvent, useState } from 'react';
import { UserType } from './user.mjs';

export function UserPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [type, setType] = useState<UserType | ''>('');

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
          <input
            id="firstName"
            name="firstName"
            type="text"
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
          />
        </div>
        <div className="form-field">
          <label htmlFor="lastName">Last Name</label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            value={lastName}
            onChange={e => setLastName(e.target.value)}
          />
        </div>
        <div className="form-field">
          <label htmlFor="phoneNumber">Phone Number</label>
          <input
            id="phoneNumber"
            name="phoneNumber"
            type="tel"
            value={phoneNumber}
            onChange={e => setPhoneNumber(e.target.value)}
          />
        </div>
        <div className="form-field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>
        <div className="form-field">
          <label htmlFor="type">Type</label>
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
        </div>
      </form>
    </div>
  );
}

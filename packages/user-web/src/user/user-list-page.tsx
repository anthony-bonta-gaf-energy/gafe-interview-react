import Button from '@/components/Button';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router';
import styles from './user-list-page.module.css';

// Define user data outside the component
const initialUsers = [
  {
    id: 'ff899ea1-5397-42b4-996d-f52492e8c835',
    firstName: 'Tom',
    lastName: 'Sawyer',
    phoneNumber: '+1-214-555-7294',
    email: 'tom@email.fake',
    type: 'Basic',
  },
];

export function UserListPage() {
  const navigate = useNavigate();
  // Create state using the initial data
  const [users] = useState(initialUsers);

  const handleCreateUser = useCallback(() => navigate('/users/new'), [navigate]);
  const handleEditUser = useCallback((id: string) => navigate(`/users/${id}`), [navigate]);

  const renderUsers = useCallback(
    () =>
      users.map(user => {
        const editUserHandler = () => handleEditUser(user.id);
        return (
          <tr key={user.id} data-row={user.id}>
            <td data-col="first-name">{user.firstName}</td>
            <td data-col="last-name">{user.lastName}</td>
            <td data-col="phone-number">{user.phoneNumber}</td>
            <td data-col="email">{user.email}</td>
            <td data-col="type">{user.type}</td>
            <td data-col="actions">
              <button
                onClick={editUserHandler}
                className="bg-gray-100 cursor-pointer hover:bg-gray-300 text-gray-800 font-small py-1 px-3 rounded text-sm transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                Edit
              </button>
            </td>
          </tr>
        );
      }),
    [users],
  );

  return (
    <div className={styles['user-list-page']}>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Users</h1>
      <Button color="blue" text="Create New User" onClick={handleCreateUser} />
      <table>
        <thead>
          <tr>
            <th data-col="first-name">First Name</th>
            <th data-col="last-name">Last Name</th>
            <th data-col="phone-number">Phone Number</th>
            <th data-col="email">Email</th>
            <th data-col="type">Type</th>
            <th data-col="actions"></th>
          </tr>
        </thead>
        <tbody>{renderUsers()}</tbody>
      </table>
    </div>
  );
}

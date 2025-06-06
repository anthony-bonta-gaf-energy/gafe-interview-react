import { Button } from '@/components';
import { User } from '@/services/users';
import { useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './user-list-page.module.css';

interface Props {
  users: User[];
}

export function UserListPage({ users = [] }: Props) {
  const navigate = useNavigate();

  const handleCreateUser = useCallback(() => navigate('/users/new'), [navigate]);
  const handleEditUser = useCallback((id: string) => navigate(`/users/${id}`), [navigate]);

  const renderUsers = useCallback(() => {
    if (users.length === 0) {
      return (
        <tr>
          <td colSpan={6} className="text-center py-8 text-gray-500">
            No users found. Click "Create New User" to add one.
          </td>
        </tr>
      );
    }

    return users.map(user => {
      const editUserHandler = () => handleEditUser(user.id || '');
      return (
        <tr key={user.id} data-row={user.id} data-testid={user.id}>
          <td data-col="first-name">{user.firstName}</td>
          <td data-col="last-name">{user.lastName}</td>
          <td data-col="phone-number">{user.phoneNumber}</td>
          <td data-col="email">{user.email}</td>
          <td data-col="type">{user.type}</td>
          <td data-col="actions">
            <Link
              className="text-sm w-8 h-8 p-0 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
              to={`/users/${user.id}`}
            >
              Edit
            </Link>
          </td>
        </tr>
      );
    });
  }, [users, handleEditUser]);

  return (
    <div className={styles['user-list-page']}>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Users</h1>
      <Button color="blue" text="Create New User" onClick={handleCreateUser} />
      <table className="w-full mt-6 border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="text-left py-2 px-4 border-b" data-col="first-name">
              First Name
            </th>
            <th className="text-left py-2 px-4 border-b" data-col="last-name">
              Last Name
            </th>
            <th className="text-left py-2 px-4 border-b" data-col="phone-number">
              Phone Number
            </th>
            <th className="text-left py-2 px-4 border-b" data-col="email">
              Email
            </th>
            <th className="text-left py-2 px-4 border-b" data-col="type">
              Type
            </th>
            <th className="text-left py-2 px-4 border-b" data-col="actions">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>{renderUsers()}</tbody>
      </table>
    </div>
  );
}

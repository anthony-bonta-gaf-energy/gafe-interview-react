import Button from '@/components/Button';
import { useUser } from '@/contexts/User';
import { getAllUsers } from '@/services/users';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import styles from './user-list-page.module.css';

export function UserListPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [loading, setLoading] = useState(true);
  const { users, saveUsers } = useUser();

  const handleCreateUser = useCallback(() => navigate('/users/new'), [navigate]);
  const handleEditUser = useCallback((id: string) => navigate(`/users/${id}`), [navigate]);

  const renderUsers = useCallback(
    () =>
      users.map(user => {
        const editUserHandler = () => handleEditUser(user.id || '');
        return (
          <tr key={user.id} data-row={user.id}>
            <td data-col="first-name">{user.firstName}</td>
            <td data-col="last-name">{user.lastName}</td>
            <td data-col="phone-number">{user.phoneNumber}</td>
            <td data-col="email">{user.email}</td>
            <td data-col="type">{user.type}</td>
            <td data-col="actions">
              <Button
                className="text-sm w-8 h-8 p-0 rounded-full flex items-center justify-center hover:bg-gray-200"
                onClick={editUserHandler}
              >
                Edit{' '}
              </Button>
            </td>
          </tr>
        );
      }),
    [users],
  );

  const handleFetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const fetchedUsers = await getAllUsers();
      saveUsers(fetchedUsers);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    handleFetchUsers();
  }, []);

  return (
    <div className={styles['user-list-page']}>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Users</h1>
      <Button color="blue" text="Create New User" onClick={handleCreateUser} />
      {loading ? (
        <div className="flex flex-col items-center justify-center my-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 animate-pulse">
            Loading users...
          </h2>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : (
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
      )}
    </div>
  );
}

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { userInstance } from '../controllers/Users';
import styles from './user-list-page.module.css';
import { ExistingUser } from './user.mjs';

export function UserListPage() {
  const navigate = useNavigate();

  const handleCreateUser = () => navigate('/users/new');
  const handleEditUser = (id: string) => navigate(`/users/${id}`);

  const [users, setUsers] = useState<ExistingUser[]>([]);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const userList = await userInstance.getUsers();
        setUsers(userList);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };

    loadUsers();
  }, []);

  return (
    <div
      className={`${styles['user-list-page']} grid items-center justify-center p-4 text-center gap-4 grid-rows-3 grid-cols-1 w-2/3 m-auto`}
    >
      <h2 className="text-2xl/7 font-bold text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
        Users
      </h2>
      <button
        onClick={handleCreateUser}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-60 m-auto"
      >
        Create New User
      </button>
      <table className="w-auto text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th className="w-1/6" data-col="first-name">
              First Name
            </th>
            <th className="w-1/6" data-col="last-name">
              Last Name
            </th>
            <th className="w-1/6" data-col="phone-number">
              Phone Number
            </th>
            <th className="w-1/6" data-col="email">
              Email
            </th>
            <th className="w-1/6" data-col="type">
              Type
            </th>
            <th className="w-1/6" data-col="actions"></th>
          </tr>
        </thead>
        <tbody>
          {users?.map(user => (
            <tr data-row={user.id} key={user.id}>
              <td data-col="first-name">{user.firstName}</td>
              <td data-col="last-name">{user.lastName}</td>
              <td data-col="phone-number">{user.phoneNumber}</td>
              <td data-col="email">{user.email}</td>
              <td data-col="type">{user.type}</td>
              <td data-col="actions">
                <button
                  data-testid={`edit-button-${user.id}`}
                  onClick={handleEditUser.bind(null, user.id)}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

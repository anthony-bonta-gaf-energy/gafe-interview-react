import { useNavigate } from 'react-router';
import styles from './user-list-page.module.css';

import { useGetUsers } from '../hooks/user';

export function UserListPage() {
  const navigate = useNavigate();
  const { loading, users } = useGetUsers();

  const handleCreateUser = () => navigate('/users');
  const handleEditUser = (id: string) => navigate(`/users/${id}`);

  return (
    <div className={styles['user-list-page']}>
      <h2>Users</h2>
      <button onClick={handleCreateUser}>Create New User</button>
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
        <tbody>
          {loading && <tr><td colSpan={6}>Loading...</td></tr>}
          {users.map((user) => (
            <tr key={user.id} data-row={user.id}>
              <td data-col="first-name">{user.firstName}</td>
              <td data-col="last-name">{user.lastName}</td>
              <td data-col="phone-number">{user.phoneNumber}</td>
              <td data-col="email">{user.email}</td>
              <td data-col="type">{user.type}</td>
              <td data-col="actions">
                <button onClick={handleEditUser.bind(null, user.id)}>
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

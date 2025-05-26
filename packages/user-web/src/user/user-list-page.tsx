import { useNavigate } from 'react-router';
import { useUsers } from '../hooks/use-users';
import styles from './user-list-page.module.css';

export function UserListPage() {
  const navigate = useNavigate();
  const { users, loading } = useUsers();

  const handleCreateUser = () => navigate('/users/new');
  const handleEditUser = (id: string) => navigate(`/users/${id}`);

  return (
    <div className={styles['user-list-page']}>
      <h2>Users</h2>
      <button onClick={handleCreateUser}>Create New User</button>

      {loading ? (
        <div className={styles['loading']}>Loading users...</div>
      ) : (
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
            {users.map(u => (
              <tr key={u.id} data-row={u.id}>
                <td data-col="first-name">{u.firstName}</td>
                <td data-col="last-name">{u.lastName}</td>
                <td data-col="phone-number">{u.phoneNumber}</td>
                <td data-col="email">{u.email}</td>
                <td data-col="type">{u.type}</td>
                <td data-col="actions">
                  <button onClick={() => handleEditUser(u.id!)}>Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

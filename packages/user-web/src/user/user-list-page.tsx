import { useNavigate } from 'react-router';
import styles from './user-list-page.module.css';

export function UserListPage() {
  const navigate = useNavigate();

  const handleCreateUser = () => navigate('/users/new');
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
          <tr data-row="ff899ea1-5397-42b4-996d-f52492e8c835">
            <td data-col="first-name">Tom</td>
            <td data-col="last-name">Sawyer</td>
            <td data-col="phone-number">+1-214-555-7294</td>
            <td data-col="email">tom@email.fake</td>
            <td data-col="type">Basic</td>
            <td data-col="actions">
              <button onClick={handleEditUser.bind(null, 'ff899ea1-5397-42b4-996d-f52492e8c835')}>
                Edit
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

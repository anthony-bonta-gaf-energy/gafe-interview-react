import { Route, Routes } from 'react-router';
import { UsersProvider } from '../user/user-context';
import { UserListPage } from '../user/user-list-page';
import { UserPage } from '../user/user-page';

export function UserApp() {
  return (
    <UsersProvider>
      <div className="gafe-user-app">
        <Routes>
          <Route path="/" element={<UserListPage />} />
          <Route path="/users/new" element={<UserPage />} />
          <Route path="/users/:id" element={<UserPage />} />
        </Routes>
      </div>
    </UsersProvider>
  );
}

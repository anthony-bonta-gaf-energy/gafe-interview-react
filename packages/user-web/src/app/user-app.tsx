import { Route, Routes } from 'react-router';
import { UserListPage } from '../user/user-list-page';
import UserPage from '../user/user-page';

export function UserApp() {
  return (
    <div className="gafe-user-app min-h-screen p-4 border rounded w-1/2 mx-auto my-2">
      <Routes>
        <Route path="/" element={<UserListPage />} />
        <Route path="/users/:id" element={<UserPage />} />
      </Routes>
    </div>
  );
}

import { UserListPage } from '@/user/user-list-page';
import UserPage from '@/user/user-page';
import { Route, Routes } from 'react-router';

export function UserApp() {
  return (
    <div className="gafe-user-app min-h-screen p-4 border rounded w-[80vw] mx-auto my-2">
      <Routes>
        <Route path="/" element={<UserListPage />} />
        <Route path="/users/:id" element={<UserPage />} />
      </Routes>
    </div>
  );
}

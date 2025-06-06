import { getAllUsers, saveUser, updateUser } from '@/services/users';
import { UserListPage } from '@/user/user-list-page';
import { UserPage } from '@/user/user-page';
import { Route, Routes, useNavigate } from 'react-router-dom';

export function UserApp() {
  const navigate = useNavigate();
  const users = getAllUsers();

  const handleSubmit = data => {
    if ('id' in data) {
      updateUser(data);
    } else {
      saveUser(data);
    }

    navigate('/');
  };

  return (
    <div className="gafe-user-app min-h-screen p-4 border rounded w-[80vw] mx-auto my-2">
      <Routes>
        <Route path="/" element={<UserListPage users={users} />} />
        <Route path="/users/:id" element={<UserPage onSubmit={handleSubmit} />} />
      </Routes>
    </div>
  );
}

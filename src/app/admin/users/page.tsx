import { getUserRole } from '@/src/lib/auth/getUserRoleServerAction';
import { AdminUserListPage } from './users';
import { redirect } from 'next/navigation';

const AdminUserList: React.FC = async () => {
  const role = await getUserRole();
  if (role !== 'ADMIN') {
    redirect('/dashboard');
  } else {
    return <AdminUserListPage />;
  }
};

export default AdminUserList;

'use client';

import { UserListTable } from '@/src/app/components/UserListTable/UserListTable';
import { getUsers } from '@/src/lib/admin/getUserListServerAction';
import { getUserRole } from '@/src/lib/auth/getUserRoleServerAction';
import { useEffect, useState } from 'react';

const AdminUserListPage: React.FC = () => {
  const [userList, setUserList] = useState([]);
  // const [role, setRole] = useState(undefined);
  useEffect(() => {
    const fetchUsers = async () => {
      const users = await getUsers();
      if (users?.length) {
        setUserList(users);
      }
      // const serverRole = await getUserRole();
      // if (serverRole) {
      //   setRole(serverRole);
      // }
    };
    fetchUsers();
  }, []);
  return <div>{userList?.length && <UserListTable users={userList} />}</div>;
};

export { AdminUserListPage };

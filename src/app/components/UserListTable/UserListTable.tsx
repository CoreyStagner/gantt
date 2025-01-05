import { Log } from '@/src/lib/log/addLogServerAction';

type User = {
  id: string;
  name: string;
  email: string;
  email_verified: boolean;
  image: string;
  role: string;
};
const UserListTable: React.FC = ({ users }: { users?: Array<User> }) => {
  return (
    <div className='user-list-table'>
      <h2>User Table</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Email Verified</th>
            <th>Role</th>
            <th>Permissions</th>
          </tr>
        </thead>
        <tbody>
          {users &&
            users.map((user: User) => {
              return (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.email_verified ? 'Yes' : 'No'}</td>
                  <td>{user.role}</td>
                  <td>TODO: List permissions</td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
};

export { UserListTable };

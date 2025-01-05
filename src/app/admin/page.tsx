import { getUserRole } from "@/src/lib/auth/getUserRoleServerAction";
import { AdminPage } from "./admin"
import { redirect } from "next/navigation";

const Admin: React.FC = async () => {
  const role = await getUserRole();
  if (role !== 'ADMIN') {
    redirect('/dashboard');
  } else {
    return (
      <AdminPage />
    )
  }
}

export default Admin;
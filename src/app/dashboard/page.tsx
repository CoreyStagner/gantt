import DashboardPage from '@/src/app/dashboard/dashboard';
import { redirect } from 'next/navigation';
import { checkIsAuthenticated } from '@/src/lib/auth/checkIsAuthenticated';

const Dashboard: React.FC = async () => {
  const isAuthenticated = await checkIsAuthenticated();

  if (!isAuthenticated) {
    redirect('auth/sign-in');
  } else {
    return <DashboardPage />;
  }
};

export default Dashboard;

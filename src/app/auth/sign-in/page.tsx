import { redirect } from "next/navigation";
import SignInPage from "./signin";
import { checkIsAuthenticated } from "@/src/lib/auth/checkIsAuthenticated";

const Page:React.FC = async () => {

  const isAuthenticated = await checkIsAuthenticated();

  if (isAuthenticated) {
    redirect('/dashboard');
  } else {
    return <SignInPage />;
  }
}

export default Page;
import { Navigate, useLocation } from "react-router";
import AuthLayout from "@/components/layout/auth-layout";
import PasswordForm from "@/components/password-form";

export default function SetupPasswordPage() {
  const location = useLocation();
  const email = location.state?.email;

  if (!email) {
    return <Navigate to="/sign-up" replace />;
  }

  return (
    <AuthLayout>
      <PasswordForm
        type="setup"
        email={email}
      />
    </AuthLayout>
  );
} 

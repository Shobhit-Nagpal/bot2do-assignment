import AuthLayout from "@/components/layout/auth-layout";
import OtpForm from "@/components/otp-form";
import { useLocation, Navigate } from "react-router";

export default function VerifyPage() {
  const location = useLocation();
  const email = location.state?.email;

  if (!email) {
    return <Navigate to="/sign-up" replace />;
  }

  return (
    <AuthLayout>
      <OtpForm email={email} />
    </AuthLayout>
  );
} 
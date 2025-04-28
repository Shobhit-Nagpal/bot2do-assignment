import AuthLayout from "@/components/layout/auth-layout";
import PasswordForm from "@/components/password-form";
import { useSearchParams } from "react-router";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';

  return (
    <AuthLayout>
      <PasswordForm
        type="reset"
        token={token}
      />
    </AuthLayout>
  );
}

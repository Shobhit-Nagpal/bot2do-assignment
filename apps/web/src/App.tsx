import { Route, Routes } from "react-router";
import SignUpPage from "./pages/sign-up";
import LoginPage from "./pages/login";
import ForgotPasswordPage from "./pages/forgot-password";
import ResetPasswordPage from "./pages/reset-password";
import VerifyPage from "./pages/sign-up/verify";
import SetupPasswordPage from "./pages/sign-up/setup-password";
import useViewportWidth from "./hooks/useViewportWidth";
import { MobileWarning } from "./components/mobile-warning";

function App() {
  const width = useViewportWidth();

  if (width < 768) {
    return <MobileWarning />;
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route path="/sign-up/verify" element={<VerifyPage />} />
        <Route path="/sign-up/setup-password" element={<SetupPasswordPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Routes>
    </>
  );
}

export default App;

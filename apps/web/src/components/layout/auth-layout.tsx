import { PropsWithChildren } from "react";
import scaleSecureLogo from "@/assets/scale-secure-logo.svg";
import leftBg from "@/assets/left-bg.svg";
interface AuthLayoutProps {}

export default function AuthLayout(props: PropsWithChildren<AuthLayoutProps>) {
  const { children } = props;

  return (
    <div className="relative min-h-screen w-full">
      <div className="flex min-h-screen">
        <div className="w-1/2 min-h-screen">
          <img src={leftBg} alt="Left bg" className="w-full h-full object-cover" /> 
        </div>
        <div className="bg-[url(/right-bg.svg)] bg-cover w-1/2 min-h-screen space-y-12 flex flex-col items-center px-4">
          <img src={scaleSecureLogo} className="h-16 w-60 mt-10" alt="Logo" />
          {children}
        </div>
      </div>
    </div>
  );
}

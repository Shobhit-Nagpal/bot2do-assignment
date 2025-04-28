import { Button } from "./ui/button";
import googleIcon from "@/assets/google.svg";
import microsoftIcon from "@/assets/microsoft.svg";

export default function SocialLogin() {
  return (
    <div className="flex items-center justify-center gap-4">
      <Button
        asChild
        variant="outline"
        className="rounded-full bg-[#11141F] border-none cursor-pointer p-3"
      >
        <img src={googleIcon} alt="Google" className="h-12 w-12" />
      </Button>
      <Button
        asChild
        variant="outline"
        className="rounded-full bg-[#11141F] border-none cursor-pointer p-3"
      >
        <img src={microsoftIcon} alt="Microsoft" className="h-12 w-12" />
      </Button>
    </div>
  );
}

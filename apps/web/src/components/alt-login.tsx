import { Link } from "react-router";
import SocialLogin from "./social-login";
import Note from "./note";
import { Separator } from "@/components/ui/separator";

interface AltLoginProps {
  source: "login" | "sign-up";
}

export default function AltLogin(props: AltLoginProps) {
  const { source } = props;

  return (
    <div className="flex flex-col items-center justify-center w-full">

      <div className="flex items-center justify-center gap-4">
        <Separator className="bg-[#363636] w-24 h-[2px]" />
        <p className="text-[#868686]">OR</p>
        <Separator className="bg-[#363636] w-24 h-[2px]" />
      </div>

      <SocialLogin />

      {source === "login" && (
        <div className="mt-8">
          <p className="text-white">
            Don't have an account? {" "}
            <Link to="/sign-up" className="text-primary">
              Sign Up
            </Link>
          </p>
        </div>
      )}

      {source === "sign-up" && (
        <div className="mt-8 flex flex-col items-center justify-center">
          <Note text="Signing up via Google saves your time ~20 seconds" />
          <div className="mt-8">
            <p className="text-white">
              Already have an account? {" "}
              <Link to="/login" className="text-primary">
                Log In
              </Link>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

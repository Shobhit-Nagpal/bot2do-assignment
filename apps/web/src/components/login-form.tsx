import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, TLoginSchema } from "@/schemas/login";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import AltLogin from "./alt-login";
import { Link } from "react-router";
import useAuth from "@/hooks/useAuth";
import { useState } from "react";
import { AlertCircle, Eye, EyeOff } from "lucide-react";

export default function LoginForm() {
  const { login, isLoading } = useAuth();
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginSuccess, setLoginSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<TLoginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { isDirty } = form.formState;

  async function onSubmit(values: z.infer<TLoginSchema>) {
    setLoginError(null);
    setLoginSuccess(null);
    const result = await login(values.email, values.password);
    
    if (result.success) {
      setLoginSuccess('Login successful! Redirecting...');
      console.log('Login successful');
    } else {
      setLoginError(result.error || "Login failed");
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 bg-[#1E2230] backdrop-blur-3xl rounded-[10px] px-14 py-8 max-w-2xl w-full"
      >
        <div>
          <h2 className="text-white font-semibold text-2xl">Sign In</h2>
          <p className="text-[#D9D9D9] mt-3 text-lg">
            Hello there! Welcome back, Sign In to continue where you left!
          </p>
        </div>
        {loginSuccess && (
          <div className="text-green-500 text-base font-semibold mb-2">{loginSuccess}</div>
        )}

        <FormField
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel className="text-white text-xl">
                Email <span className="text-[#EF4444]">*</span>
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    placeholder="Enter your registered email id like abc1234@gmail.com"
                    {...field}
                    className={`text-white text-lg bg-[#11141F] border-2 border-[#34416D] rounded-lg pr-10 px-4 py-6 ${fieldState.invalid || loginError ? 'border-[#EF4444]' : 'border-[#34416D]'}`}
                  />
                  {(fieldState.invalid) && (
                    <div className="text-[#EF4444] text-base mt-2">
                      This email id seems incorrect. Please Try Again!
                    </div>
                  )}
                </div>
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field, fieldState }) => {
            const hasValue = !!field.value;
            return (
              <FormItem>
                <FormLabel className="text-white text-xl">
                  Password <span className="text-[#EF4444]">*</span>
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password you created for your account"
                      {...field}
                      className={`text-white text-lg bg-[#11141F] border-2 border-[#34416D] rounded-lg pr-12 px-4 py-6 ${loginError && !fieldState.invalid ? 'border-[#EF4444]' : fieldState.invalid ? 'border-[#EF4444]' : 'border-[#34416D]'}`}
                    />
                    {hasValue && (
                      <button
                        type="button"
                        tabIndex={-1}
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-10 top-1/2 -translate-y-1/2 text-[#868686] text-xl focus:outline-none"
                      >
                        {showPassword ? <EyeOff /> : <Eye />}
                      </button>
                    )}
                    {(fieldState.invalid || (loginError && !fieldState.invalid)) && (
                      <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 text-[#EF4444] text-xl" />
                    )}
                  </div>
                </FormControl>
                {(fieldState.invalid || (loginError && !fieldState.invalid)) && (
                  <div className="text-[#EF4444] text-base mt-2">
                    The password you entered is incorrect. Please Try Again!
                  </div>
                )}
              </FormItem>
            );
          }}
        />

        <div className="flex justify-between items-center">
          <Button
            type="submit"
            className="bg-primary hover:bg-primary/90 text-white text-lg py-6 px-10 rounded-lg font-semibold disabled:opacity-60 mt-2"
            disabled={isLoading || !isDirty}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
          <Link
            to="/forgot-password"
            className="text-primary hover:text-primary/80 text-sm"
          >
            Forgot Password?
          </Link>
        </div>

        <AltLogin source="login" />
      </form>
    </Form>
  );
}

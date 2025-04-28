import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { passwordSchema, TPasswordSchema } from "@/schemas/password";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CheckCircle2 } from "lucide-react";
import useAuth from "@/hooks/useAuth";
import { useNavigate } from "react-router";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

interface PasswordFormProps {
  type: 'setup' | 'reset';
  email?: string;
  token?: string;
}

export default function PasswordForm({ type, email = "", token = "" }: PasswordFormProps) {
  const { completeSignUp, resetPassword } = useAuth();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<TPasswordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const { watch, formState: { isDirty, isValid } } = form;
  const password = watch("password");

  const validatePassword = (password: string) => {
    const hasMinLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return {
      hasMinLength,
      hasUpperCase,
      hasLowerCase,
      hasNumber,
      hasSpecialChar,
      isValid: hasMinLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar,
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validatePassword(password);
    if (!validation.isValid) {
      setError('Password does not meet requirements');
      return;
    }

    if (type === 'setup') {
      try {
        await completeSignUp(email, password);
        navigate('/login');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to set up password');
      }
    } else {
      try {
        await resetPassword(password, token);
        navigate('/login');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to reset password');
      }
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit}
        className="space-y-8 bg-[#1E2230] backdrop-blur-3xl rounded-[10px] px-14 py-8 max-w-2xl w-full"
      >
        <div className="flex items-start gap-2">
          <div>
            <h2 className="text-white font-semibold text-2xl">
              {type === 'setup' ? 'Setup Password' : 'Reset Password'}
            </h2>
            <p className="text-[#D9D9D9] mt-3 text-lg">
              This will take some effort, Relax and then get started!
            </p>
          </div>
        </div>

        <FormField
          control={form.control}
          name="password"
          render={({ field, fieldState }) => {
            const hasValue = !!field.value;
            return (
              <FormItem>
                <FormLabel className="text-white text-xl">
                  Set-up your 8+ digits password
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Start entering your new password here..."
                      className={`text-white text-lg bg-[#11141F] border-2 rounded-lg pr-12 px-4 py-6 ${fieldState.invalid ? 'border-[#EF4444]' : 'border-[#34416D]'}`}
                      {...field}
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
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field, fieldState }) => {
            const hasValue = !!field.value;
            return (
              <FormItem>
                <FormLabel className="text-white text-xl">
                  Confirm New Password
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Start entering your new password here..."
                      className={`text-white text-lg bg-[#11141F] border-2 rounded-lg pr-12 px-4 py-6 ${fieldState.invalid ? 'border-[#EF4444]' : 'border-[#34416D]'}`}
                      {...field}
                    />
                    {hasValue && (
                      <button
                        type="button"
                        tabIndex={-1}
                        onClick={() => setShowConfirmPassword((v) => !v)}
                        className="absolute right-10 top-1/2 -translate-y-1/2 text-[#868686] text-xl focus:outline-none"
                      >
                        {showConfirmPassword ? <EyeOff /> : <Eye />}
                      </button>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[#868686]">
            <CheckCircle2 className={validatePassword(password).hasMinLength ? "text-green-500" : ""} size={20} />
            <span>Password must be at least 8 characters long</span>
          </div>
          <div className="flex items-center gap-2 text-[#868686]">
            <CheckCircle2 className={validatePassword(password).hasUpperCase ? "text-green-500" : ""} size={20} />
            <span>Password must contain 1 Uppercase & 1 Lowercase letter</span>
          </div>
          <div className="flex items-center gap-2 text-[#868686]">
            <CheckCircle2 className={validatePassword(password).hasNumber ? "text-green-500" : ""} size={20} />
            <span>Password must contain atleast one digit like 1,2,3,4,5,6,etc.</span>
          </div>
          <div className="flex items-center gap-2 text-[#868686]">
            <CheckCircle2 className={validatePassword(password).hasSpecialChar ? "text-green-500" : ""} size={20} />
            <span>Password must contain atleast one special character like !, @, #, $, etc.</span>
          </div>
        </div>

        {error && (
          <div className="text-red-500 text-sm">
            {error}
          </div>
        )}

        <Button
          type="submit"
          className="bg-primary hover:bg-primary/90 text-white text-lg py-6 px-10 rounded-lg font-semibold disabled:opacity-60"
          disabled={!isDirty || !isValid}
        >
          {type === 'setup' ? 'Save' : 'Save & Sign In'}
        </Button>
      </form>
    </Form>
  );
} 
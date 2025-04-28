import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema, TForgotPasswordSchema } from "@/schemas/forgot-password";
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
import { useNavigate } from "react-router";
import useAuth from "@/hooks/useAuth";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";

export default function ForgotPasswordForm() {
  const navigate = useNavigate();
  const { forgotPassword, isLoading } = useAuth();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<TForgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const { isDirty } = form.formState;

  async function onSubmit(values: z.infer<TForgotPasswordSchema>) {
    setError(null);
    setSuccessMessage(null);
    
    const result = await forgotPassword(values.email);
    
    if (result.success) {
      setSuccessMessage("Password reset instructions have been sent to your email.");
    } else {
      setError(result.error || "Failed to send password reset instructions");
    }
  }

  const handleBack = () => {
    navigate("/login");
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 bg-[#1E2230] backdrop-blur-3xl rounded-[10px] px-14 py-8 max-w-2xl w-full"
      >
        <div className="flex items-start gap-2">
          <button
            type="button"
            onClick={handleBack}
            className="w-10 h-10 rounded-full bg-[#232536] flex items-center justify-center text-white hover:bg-[#232536]/80 mr-4 p-0 min-w-0 shadow-none"
          >
            <ArrowLeft className="text-2xl" />
          </button>
          <div>
            <h2 className="text-white font-semibold text-2xl">Forgot Password</h2>
            <p className="text-[#D9D9D9] mt-3 text-lg">
              Enter your email address and we'll send you instructions to reset your password.
            </p>
          </div>
        </div>

        {successMessage && (
          <div className="text-green-500 text-sm">{successMessage}</div>
        )}
        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white text-xl">Email <span className="text-[#EF4444]">*</span></FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your email id like abc1234@gmail.com"
                  {...field}
                  className="bg-[#11141F] border-2 border-[#34416D] text-white px-4 py-6 rounded-lg"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="bg-primary hover:bg-primary/90 px-10 py-6 text-lg font-semibold"
          disabled={isLoading || !isDirty}
        >
          {isLoading ? "Sending..." : "Send Reset Link"}
        </Button>
      </form>
    </Form>
  );
} 

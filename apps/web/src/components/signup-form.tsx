import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, TSignupSchema } from "@/schemas/signup";
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
import { useNavigate } from "react-router";
import useAuth from "@/hooks/useAuth";
import { AlertCircle } from "lucide-react";

export default function SignupForm() {
  const { initiateSignUp } = useAuth();
  const navigate = useNavigate();

  const form = useForm<z.infer<TSignupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
    },
  });

  const { isDirty } = form.formState;
  const email = form.watch("email");
  const isButtonDisabled = !isDirty || !email;

  async function onSubmit(values: z.infer<TSignupSchema>) {
    const success = await initiateSignUp(values.email);
    if (success) {
      navigate("/sign-up/verify", { state: { email: values.email } });
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 bg-[#1E2230] backdrop-blur-3xl rounded-[10px] px-14 py-8 max-w-2xl w-full"
      >
        <div>
          <h2 className="text-white font-semibold text-2xl">Sign Up</h2>
          <p className="text-[#D9D9D9] mt-3 text-lg">
          Hello there! Looks like you are new here, Sign Up now.
          </p>
        </div>
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
                    placeholder="Enter your email address like abc1234@gmail.com"
                    className={`text-white text-lg bg-[#11141F] border-2 border-[#34416D] rounded-lg pr-10 px-4 py-6 ${fieldState.invalid ? 'border-[#EF4444]' : 'border-[#34416D]'}`}
                    {...field}
                  />
                  {fieldState.invalid && (
                    <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 text-[#EF4444] text-xl" />
                  )}
                </div>
              </FormControl>
              {fieldState.invalid && (
                <div className="text-[#EF4444] text-base mt-2">
                  This email id seems incorrect. Please Try Again!
                </div>
              )}
            </FormItem>
          )}
        />
        <div className="flex justify-start">
          <Button
            type="submit"
            className="bg-primary hover:bg-primary/90 text-white text-lg py-6 px-10 rounded-lg font-semibold disabled:opacity-60"
            disabled={isButtonDisabled}
          >
            Generate OTP
          </Button>
        </div>
        <AltLogin source="sign-up" />
      </form>
    </Form>
  );
} 

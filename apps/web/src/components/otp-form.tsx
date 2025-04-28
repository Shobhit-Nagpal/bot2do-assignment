import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { otpSchema, TOtpSchema } from "@/schemas/otp";
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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";
import { useNavigate } from "react-router";
import AltLogin from "./alt-login";
import useAuth from "@/hooks/useAuth";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";

interface OtpFormProps {
  email: string;
}

export default function OtpForm({ email }: OtpFormProps) {
  const { verifySignUp, resendOtp } = useAuth();
  const navigate = useNavigate();
  const [otpError, setOtpError] = useState(false);
  const form = useForm<z.infer<TOtpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  const { isDirty, isValid } = form.formState;
  const otpValue = form.watch("otp");
  const isComplete = otpValue?.length === 6;

  async function onSubmit(values: z.infer<TOtpSchema>) {
    setOtpError(false);
    const success = await verifySignUp(email, values.otp);
    if (success) {
      navigate("/sign-up/setup-password", { state: { email } });
    } else {
      setOtpError(true);
    }
  }

  const handleResendOTP = async () => {
    await resendOtp(email);
  };

  const handleBack = () => {
    navigate("/sign-up", { state: { email } });
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
            <h2 className="text-white font-semibold text-2xl">Enter OTP</h2>
            <p className="text-[#D9D9D9] mt-3 text-lg">
              Fill-in the 6-digit OTP you received in your email
            </p>
          </div>
        </div>

        <FormField
          control={form.control}
          name="otp"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white text-xl">
                OTP <span className="text-[#EF4444]">*</span>
              </FormLabel>
              <FormControl>
                <InputOTP
                  maxLength={6}
                  className="gap-2 w-full"
                  {...field}
                >
                  <InputOTPGroup className="w-full">
                    <InputOTPSlot 
                      index={0} 
                      className={`flex-1 min-w-10 max-w-16 bg-[#11141F] border-2 ${otpError ? 'border-[#EF4444]' : 'border-[#34416D]'} text-white rounded-lg h-12 text-2xl`}
                    />
                    <InputOTPSeparator className="text-[#34416D] text-2xl mx-1">-</InputOTPSeparator>
                    <InputOTPSlot 
                      index={1} 
                      className={`flex-1 min-w-10 max-w-16 bg-[#11141F] border-2 ${otpError ? 'border-[#EF4444]' : 'border-[#34416D]'} text-white rounded-lg h-12 text-2xl`}
                    />
                    <InputOTPSeparator className="text-[#34416D] text-2xl mx-1">-</InputOTPSeparator>
                    <InputOTPSlot 
                      index={2} 
                      className={`flex-1 min-w-10 max-w-16 bg-[#11141F] border-2 ${otpError ? 'border-[#EF4444]' : 'border-[#34416D]'} text-white rounded-lg h-12 text-2xl`}
                    />
                    <InputOTPSeparator className="text-[#34416D] text-2xl mx-1">-</InputOTPSeparator>
                    <InputOTPSlot 
                      index={3} 
                      className={`flex-1 min-w-10 max-w-16 bg-[#11141F] border-2 ${otpError ? 'border-[#EF4444]' : 'border-[#34416D]'} text-white rounded-lg h-12 text-2xl`}
                    />
                    <InputOTPSeparator className="text-[#34416D] text-2xl mx-1">-</InputOTPSeparator>
                    <InputOTPSlot 
                      index={4} 
                      className={`flex-1 min-w-10 max-w-16 bg-[#11141F] border-2 ${otpError ? 'border-[#EF4444]' : 'border-[#34416D]'} text-white rounded-lg h-12 text-2xl`}
                    />
                    <InputOTPSeparator className="text-[#34416D] text-2xl mx-1">-</InputOTPSeparator>
                    <InputOTPSlot 
                      index={5} 
                      className={`flex-1 min-w-10 max-w-16 bg-[#11141F] border-2 ${otpError ? 'border-[#EF4444]' : 'border-[#34416D]'} text-white rounded-lg h-12 text-2xl`}
                    />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              {otpError && (
                <div className="text-[#EF4444] text-base mt-2">
                  Invalid OTP entered. Please re-check your email and enter!
                </div>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4">
          <Button
            type="submit"
            className="bg-primary hover:bg-primary/90 text-white text-lg py-6 px-10 rounded-lg"
            disabled={!isDirty || !isValid || !isComplete}
          >
            Confirm & Signup
          </Button>
          <div className="flex items-center justify-center gap-2">
            <span className="text-[#868686]">Didn't receive OTP?</span>
            <Button
              variant="link"
              onClick={handleResendOTP}
              className="text-primary hover:text-primary/90"
            >
              Resend Now
            </Button>
          </div>
        </div>

        <AltLogin source="sign-up" />
      </form>
    </Form>
  );
} 

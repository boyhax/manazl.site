"use client"
import { useState } from "react";
import { AlertDialogHeader, AlertDialogFooter } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { Formik, Form, Field } from "formik";
import { Label } from "@/components/ui/label";
import { supabase } from "../utils/supabase";
import { object, string } from "yup";
import { Button } from "@/components/ui/button";
import EmailConfirmView from "./emailConfirmCard";

const EmailSchema = object().shape({
  email: string().email("Invalid email").required("Required"),
});

const OTPSchema = object().shape({
  otp: string().length(6, "OTP must be 6 digits").required("Required"),
});

export function EmailOTPSignInDialog({ children }: { children: React.ReactNode }) {
  const { toast } = useToast();
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState("");

  const handleSendOTP = async (values: { email: string }, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
    setSubmitting(true);
    const { error } = await supabase.auth.signInWithOtp({ email: values.email });
    if (error) {
      toast({
        title: "Error sending OTP",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "OTP Sent",
        description: "Please check your email for the OTP",
      });
      setEmail(values.email);
      setStep('otp');
    }
    setSubmitting(false);
  };

  const handleVerifyOTP = async (values: { otp: string }, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
    setSubmitting(true);
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: values.otp,
      type: 'email'
    });
    if (error) {
      toast({
        title: "Error verifying OTP",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Sign In Successful",
        description: "You have been signed in successfully",
      });
      // Close the dialog or redirect the user as needed
    }
    setSubmitting(false);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{step === 'email' ? "Enter Your Email" : "Enter OTP"}</AlertDialogTitle>
          <AlertDialogDescription>
            {step === 'email'
              ? "We'll send you a one-time password to sign in."
              : "Enter the one-time password sent to your email."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        {step === 'email' ? (
          <Formik
            initialValues={{ email: "" }}
            validationSchema={EmailSchema}
            onSubmit={handleSendOTP}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="email">Email</Label>
                    <Field name="email">
                      {({ field }: any) => (
                        <Input
                          id="email"
                          placeholder="Enter your email"
                          type="email"
                          {...field}
                        />
                      )}
                    </Field>
                    {errors.email && touched.email ? (
                      <div className="text-red-500 text-sm">{errors.email}</div>
                    ) : null}
                  </div>
                </div>
                <div className="h-4" />
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Sending..." : "Send OTP"}
                  </Button>
                </AlertDialogFooter>
              </Form>
            )}
          </Formik>
        ) : (
         <EmailConfirmView email={email}/>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
}


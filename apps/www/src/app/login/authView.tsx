"use client";

import { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { SignIn } from "src/lib/db/auth";
import { useTranslate } from "@tolgee/react";
import supabase from "src/lib/supabase";
import { EyeOff, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { MainContent } from "@/components/Page";
import { EmailOTPSignInDialog } from "./EmailOTPSignInDialog";
import GoogleOneTab from "@/app/login/googleOnTab";
import GoogleLoginBtn from "./googleButton";

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().min(8, "Too Short!").required("Required"),
});

const RegisterSchema = Yup.object().shape({
  name: Yup.string().required("Required").min(7),
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(/[a-zA-Z]/, "Password must contain at least one letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(
      /[^a-zA-Z0-9]/,
      "Password must contain at least one special character"
    ),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), undefined], "Passwords must match")
    .required("Confirm password is required"),
});


export default function AuthView() {
  const [activeTab, setActiveTab] = useState("login");
  const { toast } = useToast();
  const navigate = useRouter();
  const { t } = useTranslate();
  const [showPassword, setShowPassword] = useState(false);
  const [pending, setpending] = useState(false);
  const params = useSearchParams();
  const router = useRouter();
  async function signIn(password: string, email: string) {
    setpending(true);
    const { data, error } = await SignIn(email, password)
    toast({ title: error ? t(error.message) : t("seccesfuly sign in"), duration: 1000 });
    setpending(false);
    let next = params.get('next')
    if (!error && !!next) {
      router.push(next)
    }
    return error
  }
  console.log('location.origin + `/login/callback` :>> ', location.origin + `/login/callback`);
  location.origin + `/login/callback`
  const handleGoogleLogin = async () => {
    // Handle Google login here
    setpending(true);

    const { data, error } = await supabase.auth.signInWithOAuth({ provider: 'google' })

    console.log("Google login clicked");
  };

  return (
    <MainContent>
      <Card className="w-[350px] bg-background mx-auto">
        <CardHeader>
          <CardTitle>{t("Authentication")}</CardTitle>
          <CardDescription>
            {t("Login or create a new account.")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2" >
              <TabsTrigger disabled={pending} value="login">{t("Login")}</TabsTrigger>
              <TabsTrigger disabled={pending} value="register">{t("Register")}</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <Formik

                initialValues={{ email: "", password: "" }}
                validationSchema={LoginSchema}
                onSubmit={async (values: any, { setSubmitting }: any) => {
                  const error = await signIn(values.password, values.email);
                  if (!error) {
                    navigate.back();
                  }
                  if (error) {
                    if (error.message.toLowerCase() == "email not confirmed") {
                      navigate.push(`/login/confirm/${values.email}`);
                    }
                    console.log("error :>> ", error);
                    toast({ title: t(error.message), duration: 5000 });
                  }
                  setSubmitting(false);
                }}
              >
                {({ errors, touched, isSubmitting }: any) => (
                  <Form>
                    <div className="grid w-full items-center gap-4">
                      <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="login-email">{t("Email")}</Label>
                        <Field name="email" >
                          {({ field }: any) => (
                            <Input
                              disabled={pending}
                              id="login-email"
                              placeholder="Enter your email"
                              type="email"
                              {...field}
                            />
                          )}
                        </Field>
                        {errors.email && touched.email ? (
                          <div className="text-red-500 text-sm">
                            {errors.email}
                          </div>
                        ) : null}
                      </div>
                      <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="login-password">{t("Password")}</Label>
                        <Field name="password">
                          {({ field }: any) => (
                            <div className={"relative"}>
                              <Input
                                disabled={pending}
                                id="login-password"
                                placeholder="Enter your password"
                                type={showPassword ? "text" : "password"}
                                {...field}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-0 top-0 h-full px-3 text-input bg-inherit"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? (
                                  <EyeOff className="h-4 w-4 " />
                                ) : (
                                  <Eye className="h-4 w-4 " />
                                )}
                              </Button>
                            </div>
                          )}
                        </Field>
                        {errors.password && touched.password ? (
                          <div className="text-red-500 text-sm">
                            {errors.password}
                          </div>
                        ) : null}
                      </div>
                    </div>
                    <EmailOTPSignInDialog>
                      <Label className={"text-sm "}>{t("Forgot Password? Sign in with OTP")}</Label>
                    </EmailOTPSignInDialog>
                    <Button
                      className="w-full mt-4"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? t("Logging in...") : t("Login")}
                    </Button>
                  </Form>
                )}
              </Formik>
              <div className="relative my-4">
                <Separator />
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-xs text-muted-foreground">
                  {t("Or continue with")}
                </span>
              </div>
              <div className="w-full flex items-center justify-center flex-row">
                <GoogleLoginBtn />
              </div>
             
              {/* <Button
                disabled={pending}
                variant="outline"
                className="w-full"
                onClick={handleGoogleLogin}
              >
                <svg
                  className="mr-2 h-4 w-4"
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fab"
                  data-icon="google"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 488 512"
                >
                  <path
                    fill="currentColor"
                    d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                  ></path>
                </svg>
                {t(" Sign in with Google")}
              </Button> */}
            </TabsContent>
            <TabsContent value="register">
              <Formik
                initialValues={{
                  name: "",
                  email: "",
                  password: "",
                  confirmPassword: "",
                }}
                validationSchema={RegisterSchema}
                onSubmit={async (values: any, { setSubmitting }: any) => {
                  setSubmitting(true);
                  try {
                    const { data, error } = await supabase.auth.signUp({
                      email: values.email,
                      password: values.password,
                      options: {
                        data: {
                          full_name: values.name,
                        },
                      },
                    });
                    let ses = data.session ? data.session.user : null;
                    let user = data.user;
                    if (error) {
                      console.log("error :>> ", error);
                      toast({ title: t(error.message), duration: 5000 });
                    } else {
                      if (!ses && user) {
                        toast({
                          title: t("Please find email send to you to confirm "),
                          duration: 5000
                        }
                        );
                        navigate.push(`/login/confirm/${values.email}`);
                      } else {
                        toast({ title: t("Signed Up Successfully "), duration: 5000 });
                        navigate.push("/account");
                      }
                    }
                  } catch (error) {
                    console.error(error);
                    toast({ title: t("Error Happened"), duration: 1000 });
                  }

                  setSubmitting(false);
                }}
              >
                {({ errors, touched, isSubmitting }) => (
                  <Form>
                    <div className="grid w-full items-center gap-4">
                      <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="register-name">{t("Name")}</Label>
                        <Field name="name">
                          {({ field }: any) => (
                            <Input
                              id="register-name"
                              placeholder="Enter your name"
                              {...field}
                            />
                          )}
                        </Field>
                        {errors.name && touched.name ? (
                          <div className="text-red-500 text-sm">
                            {errors?.name! as string}
                          </div>
                        ) : null}
                      </div>
                      <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="register-email">{t("Email")}</Label>
                        <Field name="email">
                          {({ field }: any) => (
                            <Input
                              id="register-email"
                              placeholder="Enter your email"
                              type="email"
                              {...field}
                            />
                          )}
                        </Field>
                        {errors.email && touched.email ? (
                          <div className="text-red-500 text-sm">
                            {errors?.email! as string}
                          </div>
                        ) : null}
                      </div>
                      <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="register-password">
                          {t("Password")}
                        </Label>
                        <Field name="password">
                          {({ field }: any) => (
                            <div className={"relative"}>
                              <Input
                                id="register-password"
                                placeholder="Create a password"
                                type={showPassword ? "text" : "password"}
                                {...field}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-0 top-0 h-full px-3 text-input bg-inherit"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? (
                                  <EyeOff className="h-4 w-4 " />
                                ) : (
                                  <Eye className="h-4 w-4 " />
                                )}
                              </Button>
                            </div>
                          )}
                        </Field>
                        {errors.password && touched.password ? (
                          <div className="text-red-500 text-sm">
                            {errors?.password! as string}
                          </div>
                        ) : null}
                      </div>
                      <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="confirmPassword">
                          {t("Confirm Password")}
                        </Label>
                        <Field name="confirmPassword">
                          {({ field }: any) => (
                            <Input
                              id="confirmPassword"
                              placeholder="Enter your password again"
                              type="password"
                              {...field}
                            />
                          )}
                        </Field>
                        {errors.confirmPassword && touched.confirmPassword ? (
                          <div className="text-red-500 text-sm">
                            {errors?.confirmPassword! as string}
                          </div>
                        ) : null}
                      </div>
                    </div>
                    <Button
                      className="w-full mt-4"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? t("Registering...") : t("Register")}
                    </Button>
                  </Form>
                )}
              </Formik>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground text-center">
            {t("  Subject to the Privacy Policy and Terms of Service.")}
          </p>
        </CardFooter>
      </Card>
    </MainContent>
  );
}

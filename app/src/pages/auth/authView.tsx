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
import { GoogleSignIn } from "src/lib/db/auth";
import { IonContent, useIonToast } from "@ionic/react";
import { useTranslate } from "@tolgee/react";
import { useNavigate } from "react-router";
import useAuth from "src/hooks/useAuth";
import supabase from "src/lib/supabase";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { EyeOff, Eye } from "lucide-react";
import getPathTo from "src/lib/utils/getPathTo";
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
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm password is required"),
});
const PasswordResetSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
});

export default function () {
  const [activeTab, setActiveTab] = useState("login");
  const [toast] = useIonToast();
  const { signIn, ResetPassword } = useAuth();
  const [visiblepassword, setvisiblepassword] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslate();
  const [showPassword, setShowPassword] = useState(false);

  const handleGoogleLogin = () => {
    // Handle Google login here
    GoogleSignIn();
    console.log("Google login clicked");
  };

  return (
    <IonContent>
      <Card className="w-[350px] bg-background mx-auto">
        <CardHeader>
          <CardTitle>{t("Authentication")}</CardTitle>
          <CardDescription>
            {t("Login or create a new account.")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">{t("Login")}</TabsTrigger>
              <TabsTrigger value="register">{t("Register")}</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <Formik
                initialValues={{ email: "", password: "" }}
                validationSchema={LoginSchema}
                onSubmit={async (values, { setSubmitting }) => {
                  const error = await signIn(values.password, values.email);
                  if (!error) {
                    navigate(-1);
                  }
                  if (error) {
                    if (error.message.toLowerCase() == "email not confirmed") {
                      navigate(`/emailconfirm#email=${values.email}`);
                    }
                    console.log("error :>> ", error);
                    toast(t(error.message), 5000);
                  }
                  setSubmitting(false);
                }}
              >
                {({ errors, touched, isSubmitting }) => (
                  <Form>
                    <div className="grid w-full items-center gap-4">
                      <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="login-email">{t("Email")}</Label>
                        <Field name="email">
                          {({ field }) => (
                            <Input
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
                          {({ field }) => (
                            <div className={"relative"}>
                              <Input
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
                    <PasswordResetDialogTrigger>
                      <Label className={"text-sm "}>{t("Reset passord")}</Label>
                    </PasswordResetDialogTrigger>
                    <Button
                      className="w-full mt-4"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Logging in..." : "Login"}
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
              <Button
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
              </Button>
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
                onSubmit={async (values, { setSubmitting }) => {
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
                      toast(t(error.message), 5000);
                    } else {
                      if (!ses && user) {
                        toast(
                          t("Please find email send to you to confirm "),
                          5000
                        );
                        navigate(`/emailconfirm#email=${values.email}`);
                      } else {
                        toast(t("Signed Up Successfully "), 5000);
                        navigate("/account");
                      }
                    }
                  } catch (error) {
                    console.error(error);
                    toast(t("Error Happened"));
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
                          {({ field }) => (
                            <Input
                              id="register-name"
                              placeholder="Enter your name"
                              {...field}
                            />
                          )}
                        </Field>
                        {errors.name && touched.name ? (
                          <div className="text-red-500 text-sm">
                            {errors.name}
                          </div>
                        ) : null}
                      </div>
                      <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="register-email">{t("Email")}</Label>
                        <Field name="email">
                          {({ field }) => (
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
                            {errors.email}
                          </div>
                        ) : null}
                      </div>
                      <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="register-password">
                          {t("Password")}
                        </Label>
                        <Field name="password">
                          {({ field }) => (
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
                            {errors.password}
                          </div>
                        ) : null}
                      </div>
                      <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="confirmPassword">
                          {t("Confirm Password")}
                        </Label>
                        <Field name="confirmPassword">
                          {({ field }) => (
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
                            {errors.confirmPassword}
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
    </IonContent>
  );
}

export function PasswordResetDialogTrigger({ children }) {
  const [toast] = useIonToast();
  const navigate = useNavigate()
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Formik
          initialValues={{ email: "" }}
          validationSchema={PasswordResetSchema}
          onSubmit={async (values, { setSubmitting }) => {
            setSubmitting(true);
            const { error } = await supabase.auth.resetPasswordForEmail(
              values.email,
              { redirectTo: getPathTo("/resetpassword") }
            );
            if (!error) navigate('/confirmemail?email=' + values.email)
            toast(
              error ? "Sorry ErrorNot Send  " + error.message : "Please Find Reset Email Send to You",
              1000
            );
            setSubmitting(false);
          }}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="login-email">Email</Label>
                  <Field name="email">
                    {({ field }) => (
                      <Input
                        id="login-email"
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
              <div className={"h-12"}> </div>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction type="submit">Continue</AlertDialogAction>
              </AlertDialogFooter>
            </Form>
          )}
        </Formik>
      </AlertDialogContent>
    </AlertDialog>
  );
}

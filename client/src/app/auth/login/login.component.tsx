"use client";

import { Formik } from "formik";
import { LogInForm } from "./login-form.component";
import { InitialValue, LoginCreate, LoginSchema } from "./form.config";
import { Card } from "@/components/ui/card";

import { signIn } from "next-auth/react";
import { AppTitle } from "@/healper/common-string";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import Link from "next/link";

export const Login = () => {
  const router = useRouter();

  const handleSubmit = async (values: LoginCreate) => {
    const res = await signIn("credentials", {
      redirect: false,
      ...values,
    });

    if (res?.ok) {
      router.push("/");
    }

    if (res?.error) {
      toast({
        title: "Error",
        description: res?.error,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="h-screen bg-violet-100 flex flex-col items-center justify-center shadow-sm">
      <Card className="w-[600px] p-20">
        <div className="mb-6">
          <p className="text-3xl">{AppTitle}</p>
          <h4 className="font-medium  text-xl mb-1">Welcome back.</h4>
        </div>
        <Formik
          initialValues={InitialValue}
          validationSchema={LoginSchema}
          onSubmit={handleSubmit}
        >
          <LogInForm />
        </Formik>
        <div className="text-xs flex justify-between mt-6">
          <span>Not a member?</span>
          <span>
            <Link href="/auth/signup" className="cursor-pointer font-semibold text-blue-500">
              Join{" "}
            </Link>
            to unlock the best of products.
          </span>
        </div>
      </Card>
    </div>
  );
};

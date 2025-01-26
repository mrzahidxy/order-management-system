"use client";

import { Formik } from "formik";
import { useRouter } from "next/navigation";
import { InitialValue, SignInRequest, SignInSchema } from "./form.config";
import { SignUpForm } from "./signup.form.component";
import { publicRequest } from "@/healper/privateRequest";
import { AppTitle } from "@/healper/common-string";
import { useState } from "react";
import Link from "next/link";

export const SignUp = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleSignupSubmit = async (values: SignInRequest) => {
    console.log('hello')
    try {
      const response = await publicRequest.post("/auth/signup", values);
      if (response.status === 201) {
        router.push("/auth/login");
      }
      setError(null);
    } catch (error: any) {
      setError(error.response?.data?.message);
    }
  };

  return (
    <div className="h-screen bg-violet-100 flex flex-col items-center justify-center shadow-sm">
      <div className="w-[600px] bg-white shadow-xl rounded-md px-20 py-20">
        <div className="mb-6">
          <p className="text-3xl">{AppTitle}</p>
          <h4 className="font-semibold text-2xl mb-1">Welcome.</h4>
        </div>

        <div className="text-center mb-4">
          <span className="font-semibold text-red-600">{error}</span>
        </div>

        <Formik
          initialValues={InitialValue}
          validationSchema={SignInSchema}
          onSubmit={handleSignupSubmit}
        >
          <SignUpForm />
        </Formik>

        <div className="text-xs flex justify-between mt-6">
          <p>Already a member?</p>
          <p>
            <Link href={"/auth/login"} className="cursor-pointer font-semibold">
              Log In{" "}
            </Link>
            to explore best of Traveller.
          </p>
        </div>
      </div>
    </div>
  );
};

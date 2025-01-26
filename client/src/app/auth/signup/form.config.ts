
import { User } from "@/models";
import * as yup from "yup";

export const SignInSchema = yup.object({
  email: yup.string().label("Email").required(),
  password: yup.string().label("Password").min(4).required(),
});

export type SignInRequest = yup.InferType<typeof SignInSchema>;

export const InitialValue: SignInRequest = {
  email: "",
  password: "",
};

type SignInResponse = {
  access_token: string;
  refresh_token: string;
  user: User;
};


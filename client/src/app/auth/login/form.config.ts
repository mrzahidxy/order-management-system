// import { usePost } from "@/features/api";
import * as yup from "yup";

export const LoginSchema = yup.object().shape({
  email: yup.string().label("Username").min(1).max(50).required(),
  password: yup.string().label("Password").min(4).required(),
});

export type LoginCreate = yup.InferType<typeof LoginSchema>;

export const InitialValue: LoginCreate = {
  email: "",
  password: "",
};

export interface LoginCreateApiResponse {
  isSuccess?: boolean;
  statusCode?: number;
  status?: string;
  message?: string;
  data?: null;
}

// export type LoginApiResponse = ReturnType<
//   typeof usePost<LoginCreate, LoginCreateApiResponse>
// >;

// export type LoginCreateApiError = LoginApiResponse["error"];

import axios from "axios";
import { getSession } from "next-auth/react";

export const publicRequest = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
});

const privateRequest = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
});

// Interceptor to add Authorization header
privateRequest.interceptors.request.use(
  async (config) => {
    const session = await getSession()

    config.headers.Authorization = `${session?.user?.token}`;

    return config;
  },
  (error) => {
    // return Promise.reject(error);
  }
);

export default privateRequest;

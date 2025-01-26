"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Navbar } from "../(root)/Navbar.component";
import Sidebar from "./Sidebar.component";


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { status, data } = useSession();
  const router = useRouter();
  const userRole = data?.user?.role;

  useEffect(() => {
    if (status === "unauthenticated" && userRole !== "ADMIN") {
      router.push("/auth/login");
    }
  }, [status, userRole]);


  return (
    <div className="flex flex-col h-screen">
      {/* Navbar */}
      <Navbar />

      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 px-16 p-8 overflow-auto">{children}</main>
      </div>
    </div>
  );
}

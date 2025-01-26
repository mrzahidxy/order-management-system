"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FiShoppingCart } from "react-icons/fi";
import { signOut, useSession } from "next-auth/react";
import { CiLogin } from "react-icons/ci";
import useCartStore from "@/store/useStore";

export const Navbar: React.FC = () => {
  const { data: session } = useSession();
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isFixedNavbar, setIsFixedNavbar] = useState(false);
  const cartItemsCount = useCartStore((state) => state.cartItems.length);

  useEffect(() => {
    const handleScroll = () => setIsFixedNavbar(window.scrollY > 100);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleDropdown = () => setIsDropdownVisible((prev) => !prev);

  return (
    <nav
      className={`w-full py-3 px-3 md:px-10 shadow-md ${
        isFixedNavbar ? "fixed z-50 bg-white" : ""
      }`}
    >
      <div className="flex justify-between items-center container">
        <a href="/" className="flex items-center gap-1 text-2xl font-semibold">
          <FiShoppingCart className="text-blue-500" /> Buynow
        </a>

        {session ? (
          <div className="hidden md:flex items-center gap-6">
            <div className="relative flex items-center gap-1">
              <button onClick={toggleDropdown} className="text-lg">
                {session?.user.email}
              </button>
              {isDropdownVisible && (
                <div className="absolute z-50 right-[-10px]  top-[30px] mt-2 py-2 w-36 bg-white border border-gray-300 rounded shadow-lg">
                  <button
                    onClick={() => signOut()}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
            {session?.user.isAdmin ? (
              <Link href={"/admin"}>Admin</Link>
            ) : (
              <Link href="/cart" className="relative text-xl flex items-center">
                <FiShoppingCart />
                {cartItemsCount > 0 && (
                  <span className="absolute left-5 bottom-3 text-xs bg-blue-500 text-white px-1 rounded-full">
                    {cartItemsCount}
                  </span>
                )}
              </Link>
            )}
          </div>
        ) : (
          <Link
            href="/auth/login"
            className="flex items-center text-sm font-semibold"
          >
            <CiLogin className="text-xl" />
            <span>Login</span>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

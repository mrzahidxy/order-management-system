"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  FiEdit2,
  FiBell,
  FiMenu,
  FiX,
  FiUser,
} from "react-icons/fi";

type Props = {};

export const AdminNavbar = (props: Props) => {
  const [dropdownVisible, setDropDownVisible] = useState<boolean>(false);

  const [showSidebar, setShowSidebar] = useState<boolean>(false);
  const [fixedNavbar, setFixedNavbar] = useState<number>(0);

  const handleDropdownClick = () => {
    setDropDownVisible(!dropdownVisible);
  };

  const handleScrollHeight = () => {
    setFixedNavbar(window.scrollY);
  };

  useEffect(() => {
    addEventListener("scroll", handleScrollHeight);
  }, []);

  return (
    <nav
      className={`w-full py-3 shadow-md ${
        fixedNavbar > 100 ? "fixed z-50 bg-white" : ""
      }`}
    >
      <div className="px-8 flex flex-row justify-between items-center">
        <h2 className=" text-2xl font-semibold">BuyNow</h2>
        {showSidebar && (
          <div className="absolute top-0 right-0 bg-gray-100 min-h-screen z-50 w-1/2">
            <button
              className="block md:hidden border-b-2 w-full p-2"
              onClick={() =>
                setShowSidebar((prevShowSidebar) => !prevShowSidebar)
              }
            >
              <FiX />
            </button>
            <div className="mt-2 space-y-2 pl-2">
              <div className="flex flex-row items-center gap-4">
                <Link href="/" className="text-2xl w-6">
                  <FiBell />
                </Link>
                <span className="text-lg font-semibold">Alerts</span>
              </div>

              <div className="flex flex-row items-center gap-4">
                <Link href="/review" className="text-2xl w-6">
                  <FiEdit2 />
                </Link>
                <span className="text-lg font-semibold">Review</span>
              </div>

              <div
                className="flex flex-row items-center gap-4"
                onClick={handleDropdownClick}
              >
                {/* <Image width={100} height={100} alt=""
                  src="https://fakeimg.pl/200/"
                  className="w-6 h-6 rounded-full cursor-pointer"
                /> */}
                <span className="text-lg font-semibold">Profile</span>
              </div>
            </div>
          </div>
        )}

        <button
          className="block md:hidden"
          onClick={() => setShowSidebar((prevShowSidebar) => !prevShowSidebar)}
        >
          <FiMenu />
        </button>

        <div className="hidden md:flex gap-6 items-center cursor-pointer text-2xl">
          <div className="relative group" onClick={handleDropdownClick}>
            {/* <img
              src="https://fakeimg.pl/200/"
              className="w-10 h-10 rounded-full cursor-pointer"
            /> */}

            <FiUser />
            {dropdownVisible && (
              <div className="z-10 absolute right-0 mt-2 py-2 w-36 bg-white border border-gray-300 rounded shadow-lg">
                <Link
                  href={"#"}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Profile
                </Link>
                <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

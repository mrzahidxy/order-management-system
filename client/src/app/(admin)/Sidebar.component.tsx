"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiBarChart2, FiBox, FiShoppingCart, FiUser } from "react-icons/fi";

type Props = {};

const Sidebar = (props: Props) => {
  const pathname = usePathname();

  const links = [
    { href: "/admin", label: "Dashboard", icon: <FiBarChart2 /> },
    { href: "/admin/products", label: "Product", icon: <FiBox /> },
    { href: "/admin/orders", label: "Order", icon: <FiShoppingCart /> },
    { href: "/admin/promotions", label: "Promotions", icon: <FiUser /> },
  ];

  return (
    <div className="h-screen border w-[260px]">
      <div className="flex flex-col font-semibold">
        {links.map(({ href, label, icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex gap-2 items-center p-3 pl-8 transition duration-100 ease-in-out border-b-2 border-gray-100 ${
              pathname === href
                ? "text-blue-500 bg-blue-100"
                : "hover:text-blue-500 hover:bg-blue-100"
            }`}
          >
            {icon} <span>{label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;

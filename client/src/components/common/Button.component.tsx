"use client";
import React, { ReactNode } from "react";

type Props = {
  title: string;
  className?: string;
  icon?: ReactNode;
  loading?: boolean;
  onClick?: () => void;
};

const CustomButton = ({ className, title, icon, loading, onClick }: Props) => {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`flex justify-center items-center gap-1 border group  border-blue-500 rounded-sm py-1 hover:bg-blue-500 hover:text-white transition duration-100 ease-in-out ${className} `}
    >
      {loading ? (
        <div className="flex items-center gap-2">
          <div className="animate-spin border-t-2 border-blue-500 group-hover:border-white border-solid rounded-full w-4 h-4"></div>
          <span>Loading...</span>
        </div>
      ) : (
        <>
          {title}
          {icon}
        </>
      )}
    </button>
  );
};

export default CustomButton;

import { PropsWithChildren } from "react";

export const FieldContainer = ({
  className = "",
  children,
}: PropsWithChildren<{
  className?: string;
}>) => {
  return <div className={`flex flex-col gap-1 ${className}`}>{children}</div>;
};

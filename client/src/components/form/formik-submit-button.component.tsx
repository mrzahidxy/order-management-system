import React from "react";
import { useFormikContext } from "formik";
import { Button } from "@/components/ui/button";

type FormikSubmitButtonProps = {
  text: string;
  className?: string;
  type?: "submit" | "button" | "reset";
  disabled?: boolean;
};

export const FormikSubmitButton: React.FC<FormikSubmitButtonProps> = ({
  className,
  text,
  type = "submit",
  disabled,
  ...rest
}) => {
  const { isSubmitting } = useFormikContext();

  return (
    <Button
      type={type}
      className={className}
      disabled={disabled || isSubmitting}
      {...rest}
    >
      {isSubmitting ? (
        <>
          <span>Loading...</span>
        </>
      ) : (
        <span>{text}</span>
      )}
    </Button>
  );
};

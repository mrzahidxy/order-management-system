import React, { useEffect, useRef, useState } from "react";
import { Field, FieldProps, useFormikContext } from "formik";
import { FieldContainer } from "./field-container.component";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import Image from "next/image";

type InputFieldProps = {
  placeholder?: string;
  disabled?: boolean;
  label?: string;
  helperText?: string;
  error?: boolean;
  inputClassName?: string;
  id?: string;
  inputRef?: React.RefObject<HTMLInputElement>; // New prop to receive ref
};

const InputField: React.FC<
  InputFieldProps & React.InputHTMLAttributes<HTMLInputElement>
> = ({
  label,
  placeholder,
  disabled,
  error,
  helperText,
  inputClassName = "",
  id = "file-upload",
  inputRef, // Receive inputRef prop
  ...rest
}) => (
  <FieldContainer>
    {label && <label htmlFor={id}>{label}</label>}
    <Input
      placeholder={placeholder}
      className={inputClassName}
      disabled={disabled}
      type="file"
      id={id}
      ref={inputRef} // Attach ref to the input
      {...rest}
    />
    {helperText && (
      <small className={error ? "text-red-600 text-xs" : ""}>
        {helperText}
      </small>
    )}
  </FieldContainer>
);

type FormikUploadFieldProps = {
  inputFieldProps?: InputFieldProps;
  name: string;
};

export const FormikUploadField: React.FC<FormikUploadFieldProps> = ({
  inputFieldProps,
  name,
}) => {
  const { setFieldValue, values } = useFormikContext<any>();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null); // Create ref for the file input

  useEffect(() => {
    // Get the existing image URL from Formik initial values
    const existingImageUrl = values[name];
    if (existingImageUrl) {
      setPreviewUrl(existingImageUrl);
    }
  }, [values, name]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    if (file) {
      setFieldValue(name, file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setFieldValue(name, null);
    setPreviewUrl(null);
    if (inputRef.current) {
      inputRef.current.value = ""; // Clear file input state
    }
  };

  return (
    <Field name={name}>
      {({ meta: { touched, error }, form: { isSubmitting } }: FieldProps) => {
        const helperText =
          touched && error ? error : inputFieldProps?.helperText;

        return (
          <div className="space-y-4">
            <InputField
              {...inputFieldProps}
              error={touched && !!error}
              helperText={helperText}
              disabled={inputFieldProps?.disabled || isSubmitting}
              onChange={handleFileChange}
              inputRef={inputRef} // Pass ref to InputField
            />
            {previewUrl && (
              <div className="relative inline-block">
                <Image
                  src={previewUrl}
                  alt="Selected file preview"
                  width={200}
                  height={200}
                  className="rounded-md"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={handleRemoveImage}
                  disabled={isSubmitting}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        );
      }}
    </Field>
  );
};

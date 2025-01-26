import { FormikInputField, FormikSubmitButton } from "@/components/form";
import { Form } from "formik";

export function LogInForm() {
  return (
    <Form>
      <div className="flex flex-col gap-1">
        <FormikInputField
          name="email"
          inputFieldProps={{
            placeholder: "Enter user Email",
            inputClassName: "öutlined-none py-3",
          }}
        />
        <FormikInputField
          name="password"
          inputFieldProps={{
            placeholder: "Enter password",
            inputClassName: "öutlined-none py-3",
          }}
        />
        <span className="text-right text-xs color-gray cursor-pointer">
          Forget Password?
        </span>

        <div className="w-full mx-auto mt-3">
          <FormikSubmitButton
            className="bg-blue-500 hover:bg-blue-600 transition  delay-100 ease-in-out text-white w-full py-3 rounded-md"
            text="Login"
          />
        </div>
      </div>
    </Form>
  );
}

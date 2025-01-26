import { FormikInputField, FormikSubmitButton } from "@/components/form";
import { Form } from "formik";


export function SignUpForm() {
  return (
    <Form>
      <div className="flex flex-col gap-2 ">
        <FormikInputField
          name="email"
          inputFieldProps={{
            placeholder: "Enter Email...",
            inputClassName: "öutlined-none py-3",
          }}
        />
        <FormikInputField
          name="password"
          inputFieldProps={{
            placeholder: "Enter password...",
            inputClassName: "öutlined-none py-3",
          }}
        />
        <div className="w-full mx-auto mt-3">
          <FormikSubmitButton
            className="bg-blue-500 hover:bg-blue-600 transition  delay-100 ease-in-out text-white w-full py-3 rounded-md"
            text="Sing In"
          />
        </div>
      </div>
    </Form>
  );
}

import { Form } from "formik";
import { FormikInputField, FormikSubmitButton } from "@/components/form";

export function ProductForm() {
  return (
    <Form>
      <div className="space-y-4">
        <FormikInputField
          name="name"
          inputFieldProps={{
            label: "Product Name",
            placeholder: "Product Name",
            inputClassName: "öutlined-none py-3",
          }}
        />
        <FormikInputField
          name="description"
          inputFieldProps={{
            label: "Description",
            placeholder: "Description",
            inputClassName: "öutlined-none py-3",
            type: "textarea",
          }}
        />

        <FormikInputField
          name="price"
          inputFieldProps={{
            label: "Price",
            placeholder: "Price",
            inputClassName: "öutlined-none py-3",
          }}
        />

        <FormikInputField
          name="weight"
          inputFieldProps={{
            label: "Weight (gm)",
            placeholder: "Weight",
            inputClassName: "öutlined-none py-3",
          }}
        />

        <div className=" mt-3">
          <FormikSubmitButton
            className="bg-blue-500 hover:bg-blue-600 transition  delay-100 ease-in-out text-white w-full py-3 rounded-md"
            text="Submit"
          />
        </div>
      </div>
    </Form>
  );
}

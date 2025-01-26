"use client";

import { useState } from "react";
import { Formik, Form, FormikHelpers } from "formik";
import * as Yup from "yup";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import privateRequest from "@/healper/privateRequest";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ConfirmableActionButton from "./Confirmation-Button.component";
import { FormikInputField, FormikSubmitButton } from "@/components/form";


interface Address {
  id: number;
  country: string;
  state: string;
  city: string;
  postalCode: number;
  address: string;
  formattedAddress: string;
}

const AddressSchema = Yup.object().shape({
  country: Yup.string().required("Country is required"),
  state: Yup.string().required("State is required"),
  city: Yup.string().required("City is required"),
  postalCode: Yup.number()
    .typeError("Postal Code must be a number")
    .required("Postal Code is required"),
  address: Yup.string().required("Address is required"),
});

export default function Address({ user, onRefresh }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSettingDefault, setIsSettingDefault] = useState(false);

  const { toast } = useToast();

  const handleSubmit = async (
    values: Omit<Address, "id" | "formattedAddress">,
    { resetForm }: FormikHelpers<Omit<Address, "id" | "formattedAddress">>
  ) => {
    try {
      await privateRequest.post("/addresses", values);
      toast({ title: "Address created", description: "Address added." });
      setIsOpen(false);
      onRefresh();
      resetForm();
    } catch (error) {
      console.error("Error creating address:", error);
      toast({
        title: "Error",
        description: "Failed to create address.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: number) => {
    setIsDeleting(true);
    try {
      await privateRequest.delete(`/addresses/${id}`);
      toast({ title: "Address deleted", description: "Address removed." });
      onRefresh();
    } catch (error) {
      console.error("Error deleting address:", error);
      toast({
        title: "Error",
        description: "Failed to delete address.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const setDefaultAddress = async (
    id: number,
    type: "billing" | "shipping"
  ) => {
    setIsSettingDefault(true);
    const payload =
      type === "billing"
        ? {
            defaultBillingAddress: id,
          }
        : {
            defaultShippingAddress: id,
          };

    try {
      await privateRequest.put("/addresses", payload);
      toast({
        title: `Default ${type} address set`,
        description: `Default ${type} address updated.`,
      });
      onRefresh();
    } catch (error) {
      console.error(`Error setting default ${type} address:`, error);
      toast({
        title: "Error",
        description: `Failed to set default ${type} address.`,
        variant: "destructive",
      });
    } finally {
      setIsSettingDefault(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {user?.Address?.map((address: any) => (
          <div
            key={address.id}
            className="bg-gray-100 p-2 rounded flex items-center justify-between w-full group relative"
          >
            <div className="w-full flex justify-between">
              <span>{address.formattedAddress}</span>
              {address.id === user.defaultShippingAddress && (
                <Badge variant="destructive">Shipping </Badge>
              )}
              {address.id === user.defaultBillingAddress && (
                <Badge variant="destructive">Billing </Badge>
              )}
            </div>

            {/* Hoverable Action Tab */}
            <div
              className="hidden group-hover:flex flex-col gap-1 bg-gray-200 p-1 rounded absolute top-0 z-50"
              style={{ right: "-140px" }}
            >
              <ConfirmableActionButton
                label="Set as Shipping"
                description="Are you sure you want to set this address as your default shipping address?"
                onConfirm={() => setDefaultAddress(address.id, "shipping")}
                isLoading={isSettingDefault}
              />
              <ConfirmableActionButton
                label="Set as Billing"
                description="Are you sure you want to set this address as your default billing address?"
                onConfirm={() => setDefaultAddress(address.id, "billing")}
                isLoading={isSettingDefault}
              />
              <ConfirmableActionButton
                label="Delete"
                description="This action cannot be undone. Delete this address?"
                onConfirm={() => handleDelete(address.id)}
                isLoading={isDeleting}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Create New Address Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" disabled={user?.Address?.length === 5}>
            Create New Address
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Address</DialogTitle>
          </DialogHeader>
          <Formik
            initialValues={{
              country: "",
              state: "",
              city: "",
              postalCode: 0,
              address: "",
            }}
            validationSchema={AddressSchema}
            onSubmit={handleSubmit}
          >
            <Form className="flex flex-col gap-3">
              {["country", "state", "city", "address"].map((field) => (
                <FormikInputField
                  key={field}
                  name={field}
                  inputFieldProps={{
                    placeholder: field.charAt(0).toUpperCase() + field.slice(1),
                    inputClassName: "outlined-none py-3",
                  }}
                />
              ))}
              <FormikInputField
                name="postalCode"
                inputFieldProps={{
                  type: "number",
                  placeholder: "Postal Code",
                  inputClassName: "outlined-none py-3",
                }}
              />
              <FormikSubmitButton
                className="bg-blue-500 hover:bg-blue-600 transition delay-100 ease-in-out text-white w-full py-3 rounded-md"
                text="Submit"
              />
            </Form>
          </Formik>
        </DialogContent>
      </Dialog>
    </div>
  );
}

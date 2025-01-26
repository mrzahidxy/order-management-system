"use client";

import { useState, useEffect } from "react";
import { useFormikContext, FieldArray, Form } from "formik";
import { FormikInputField, FormikSubmitButton } from "@/components/form";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { publicRequest } from "@/healper/privateRequest";
import { Promotion, PromotionType } from "./form.config";

export default function PromotionForm({ id }: { id?: string }) {
  const { values, errors, setFieldValue, handleSubmit } = useFormikContext<Promotion>();
  const [promotionType, setPromotionType] = useState<keyof typeof PromotionType>(values.type || "PERCENTAGE");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [products, setProducts] = useState<{ id: string; name: string; description: string }[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  useEffect(() => {
    if (values.productIds && values.productIds.length > 0) {
      setSelectedProducts(values.productIds.filter((id): id is string => id !== undefined));
    }
  }, [values]);

  // Fetch products for modal
  const fetchProduct = async (): Promise<void> => {
    try {
      const response = await publicRequest.get(`/products`);
      setProducts(response.data.data.collections || []);
    } catch (error) {
      console.error("Failed to fetch product data:", error);
    }
  };

  useEffect(() => {
    if (isModalOpen) {
      fetchProduct();
    }
  }, [isModalOpen]);

  const handleProductSelection = (productId: string) => {
    if (!selectedProducts.includes(productId)) {
      const updatedProducts = [...selectedProducts, productId];
      setSelectedProducts(updatedProducts);
      setFieldValue("productIds", updatedProducts);
    }
  };

  const handleProductRemove = (productId: string) => {
    const updatedProducts = selectedProducts.filter((id) => id !== productId);
    setSelectedProducts(updatedProducts);
    setFieldValue("productIds", updatedProducts);
  };

  return (
    <Form onSubmit={handleSubmit} className="space-y-6">
      {/* Title Field */}
      <FormikInputField
        name="title"
        inputFieldProps={{
          label: "Title",
          placeholder: "Promotion Title",
          inputClassName: "outlined-none py-3",
          disabled: !!id, // Disable title if in edit mode
        }}
      />

      {/* Start Date */}
      <FormikInputField
        name="startDate"
        inputFieldProps={{
          label: "Start Date",
          placeholder: new Date().toISOString().split("T")[0],
          type: "date",
          inputClassName: "outlined-none py-3",
        }}
      />

      {/* End Date */}
      <FormikInputField
        name="endDate"
        inputFieldProps={{
          label: "End Date",
          placeholder: new Date().toISOString().split("T")[0],
          type: "date",
          inputClassName: "outlined-none py-3",
        }}
      />

      {/* Promotion Type (disabled in edit mode) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Promotion Type</label>
        <Select
          value={promotionType}
          onValueChange={(value: keyof typeof PromotionType) => {
            setPromotionType(value);
            setFieldValue("type", value);
          }}
          disabled={!!id} // Disable promotion type in edit mode
        >
          <SelectTrigger>
            <SelectValue placeholder="Select promotion type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="PERCENTAGE">Percentage</SelectItem>
            <SelectItem value="FIXED">Fixed</SelectItem>
            <SelectItem value="WEIGHTED">Weighted</SelectItem>
          </SelectContent>
        </Select>
        {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type}</p>}
      </div>

      {/* Discount Field (disabled in edit mode) */}
      {(promotionType === "PERCENTAGE" || promotionType === "FIXED") && (
        <FormikInputField
          name="discount"
          disabled={!!id}
          inputFieldProps={{
            label: "Discount",
            placeholder: "Enter Discount",
            type: "number",
            inputClassName: "outlined-none py-3",
          }}
        />
      )}

      {/* Weighted Slabs (disabled in edit mode) */}
      {promotionType === "WEIGHTED" && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Slabs</label>
          <div>Enter the max weight, min weight, and discount per unit (500g). Provide the values in grams.</div>
          <FieldArray
            name="slabs"
            render={(arrayHelpers) => (
              <>
                {values.slabs?.map((_, index) => (
                  <div key={index} className="flex space-x-2 mb-2">
                    <FormikInputField
                      name={`slabs.${index}.minWeight`}
                      disabled={!!id}
                      inputFieldProps={{
                        placeholder: "Min Weight",
                        type: "number",
                        inputClassName: "outlined-none py-3",
                      }}
                    />
                    <FormikInputField
                      name={`slabs.${index}.maxWeight`}
                      disabled={!!id}
                      inputFieldProps={{
                        placeholder: "Max Weight",
                        type: "number",
                        inputClassName: "outlined-none py-3",
                      }}
                    />
                    <FormikInputField
                      name={`slabs.${index}.discountPerUnit`}
                      disabled={!!id}
                      inputFieldProps={{
                        placeholder: "Discount/Unit",
                        type: "number",
                        inputClassName: "outlined-none py-3",
                      }}
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => arrayHelpers.remove(index)}
                      disabled={!!id} // Disable remove button in edit mode
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  onClick={() => arrayHelpers.push({ minWeight: 0, maxWeight: null, discountPerUnit: 0 })}
                  disabled={!!id} // Disable add slab button in edit mode
                >
                  Add Slab
                </Button>
              </>
            )}
          />
        </div>
      )}

      {/* Product Selection (disabled in edit mode) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Product IDs</label>
        <div className="flex space-x-2">
          <Button type="button" onClick={() => setIsModalOpen(true)} disabled={!!id}>
            Select Products
          </Button>
          <span className="text-gray-700">
            {selectedProducts.length > 0
              ? `${selectedProducts.length} product(s) selected`
              : "No products selected"}
          </span>
        </div>
      </div>

      {/* Submit Button */}
      <FormikSubmitButton
        className="bg-blue-500 hover:bg-blue-600 transition delay-100 ease-in-out text-white w-full py-3 rounded-md"
        text="Submit"
      />

      {/* Product Selection Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Select Products</DialogTitle>
            <DialogDescription>Choose products to associate with this promotion.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {products.length > 0 ? (
              <ul className="space-y-2">
                {products.map((product) => (
                  <li key={product.id} className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium">{product.name}</p>
                      <p className="text-xs text-gray-500">{product.description}</p>
                    </div>
                    {selectedProducts.includes(product.id) ? (
                      <div className="flex items-center space-x-2">
                        <span className="text-green-500 font-medium">Added</span>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => handleProductRemove(product.id)}
                          disabled={!!id}
                        >
                          Undo
                        </Button>
                      </div>
                    ) : (
                      <Button
                        type="button"
                        onClick={() => handleProductSelection(product.id)}
                        className="self-end"
                        disabled={!!id}
                      >
                        Add
                      </Button>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">No products available</p>
            )}
          </div>
          <DialogFooter>
            <Button type="button" onClick={() => setIsModalOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Form>
  );
}

import * as Yup from "yup";

// Enum for Promotion Types
export enum PromotionType {
  PERCENTAGE = "PERCENTAGE",
  FIXED = "FIXED",
  WEIGHTED = "WEIGHTED",
}

// Schema for Slabs (used in WEIGHTED promotions)
const SlabSchema = Yup.object({
  minWeight: Yup.number()
    .min(0, "Minimum weight must be non-negative")
    .required("Minimum weight is required"),
  maxWeight: Yup.number()
    .nullable()
    .test(
      "is-greater-than-minWeight",
      "Maximum weight must be greater than minimum weight",
      function (value) {
        const { minWeight } = this.parent;
        return value == null || value > minWeight;
      }
    ),
  discountPerUnit: Yup.number()
    .positive("Discount per unit must be positive")
    .required("Discount per unit is required"),
});

// Main Promotion Schema
export const PromotionSchema = Yup.object({
  title: Yup.string().required("Title is required"),
  startDate: Yup.date().required("Start date is required"),
  endDate: Yup.date()
    .min(Yup.ref("startDate"), "End date must be after the start date")
    .required("End date is required"),
  type: Yup.mixed<PromotionType>()
    .oneOf(Object.values(PromotionType), "Invalid promotion type")
    .required("Promotion type is required"),
  discount: Yup.number()
    .nullable()
    .positive("Discount must be positive")
    .optional(),

  slabs: Yup.array().of(SlabSchema).optional().nullable(),

  productIds: Yup.array()
    .of(Yup.string())
    .min(1, "At least one product ID is required"),
  enabled: Yup.boolean().optional(),
  description: Yup.string().optional(),
});

// Infer type from PromotionSchema
export type Promotion = Yup.InferType<typeof PromotionSchema>;

// Initial values for promotion creation
export const PromotionInitialValue: Promotion = {
  title: "",
  startDate: new Date(), // Defaults to today's date
  endDate: new Date(), // Defaults to today's date
  type: PromotionType.PERCENTAGE, // Default promotion type
  discount: undefined, // Default discount
  slabs: undefined, // Default slabs
  productIds: [], // No product IDs initially
  enabled: true, // Default to enabled
  description: "", // Empty description
};

// API Response Interface for Promotion
export interface PromotionCreateUpdateApiResponse {
  isSuccess?: boolean;
  statusCode?: number;
  status?: string;
  message?: string;
  data?: null;
}

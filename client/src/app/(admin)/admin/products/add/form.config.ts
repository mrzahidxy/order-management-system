import * as yup from "yup";

export const ProductSchema = yup.object().shape({
  name: yup.string().label("Product Name").min(1).max(50).required(),
  description: yup.string().label("Description").min(4).required(),
  price: yup.number().label("Price").min(1, 'Price must be greater than 0').required(),
  weight: yup.number().label("Weight").min(1, 'Weight must be greater than 0').required(),
});

export type ProductCreate = yup.InferType<typeof ProductSchema>;

export const InitialValue: ProductCreate = {
  name: "",
  description: "",
  price: 0,
  weight: 0,  
};

export interface ProductCreateUpdateApiResponse {
  isSuccess?: boolean;
  statusCode?: number;
  status?: string;
  message?: string;
  data?: null;
}

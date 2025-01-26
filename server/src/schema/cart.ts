import { z } from "zod";

export const AddToCartSchema = z.object({
    productId: z.string(),
    quantity: z.number(),
});

export const changeQuantitySchema = z.object({
    quantity: z.number(),
});
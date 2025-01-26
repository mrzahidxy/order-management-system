import { Router } from "express";

import { authMiddleware } from "../middleware/auth";
import { adminMiddleWare } from "../middleware/admin";
import { createProduct,  getProductById, getProducts, toggleProductStatus, updateProduct } from "../contrrollers/product";


const productRoutes: Router = Router();

// Create a product
productRoutes.post(
  "/",
  [authMiddleware, adminMiddleWare],
  createProduct
);

// Update a product
productRoutes.put(
  "/:id",
  [authMiddleware, adminMiddleWare],
  updateProduct
);

// Enable/Disable a product
productRoutes.patch(
  "/:id/status",
  [authMiddleware, adminMiddleWare],
  toggleProductStatus
);

// Get product by ID
productRoutes.get("/:id", getProductById);

// List all products (excluding disabled ones)
productRoutes.get("/", getProducts);

export default productRoutes;

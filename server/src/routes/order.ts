import { Router } from "express";
import { authMiddleware } from "../middleware/auth";

import { errorHandler } from "../exceptions/error-handler";
import { createOrder, getAllOrders, getOrderById, updateOrderStatus,  } from "../contrrollers/order";

const orderRoutes: Router = Router();

// User Routes
orderRoutes.post("/", [authMiddleware], errorHandler(createOrder));
orderRoutes.get("/", [authMiddleware], errorHandler(getAllOrders));
orderRoutes.get("/:id", [authMiddleware], errorHandler(getOrderById));
orderRoutes.put("/status/:id", [authMiddleware], errorHandler(updateOrderStatus));

export default orderRoutes;

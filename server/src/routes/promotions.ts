import { Router } from "express";
import { authMiddleware } from "../middleware/auth";

import { errorHandler } from "../exceptions/error-handler";
import { createPromotion, disablePromotion, getPromotionById, getPromotions, updatePromotion } from "../contrrollers/promotion";
import { adminMiddleWare } from "../middleware/admin";

const promotionRoutes: Router = Router();

// User Routes
promotionRoutes.post("/", [authMiddleware, adminMiddleWare], errorHandler(createPromotion));
promotionRoutes.put("/:id", [authMiddleware, adminMiddleWare], errorHandler(updatePromotion));
promotionRoutes.get("/", [authMiddleware], errorHandler(getPromotions));
promotionRoutes.get("/:id", [authMiddleware], errorHandler(getPromotionById));
promotionRoutes.patch("/:id/status", [authMiddleware, adminMiddleWare], errorHandler(disablePromotion));

export default promotionRoutes;
import { Router } from "express";
import authRoutes from "./auth";
import productRoutes from "./product";
import cartRoutes from "./cart";
import orderRoutes from "./order";
import promotionRoutes from "./promotions";


const rootRouter: Router = Router();

rootRouter.use("/auth", authRoutes);
rootRouter.use('/products', productRoutes)
rootRouter.use('/carts', cartRoutes)
rootRouter.use('/orders', orderRoutes)
rootRouter.use('/promotions', promotionRoutes)

export default rootRouter

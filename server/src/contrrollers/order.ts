import { Request, Response } from "express";
import prisma from "../connect";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCode } from "../exceptions/root";
import { HTTPSuccessResponse } from "../helpers/success-response";

// Types
interface Promotion {
  promotion: {
    type: string;
    discount: number;
    slabs?: string;
  };
}


const calculateDiscount = (price: number, promotions: Promotion[], weightInGrams: number): number => {
  let discount = 0;

  // console.log('promotions', promotions);

  promotions.forEach((promotion) => {
    if (promotion.promotion.type === "PERCENTAGE") {
      // Calculate percentage discount
      discount += price * (promotion.promotion.discount / 100);
    } else if (promotion.promotion.type === "FIXED") {
      // Apply fixed discount
      discount += promotion.promotion.discount;
    } else if (promotion.promotion.type === "WEIGHTED" && promotion.promotion.slabs) {
      // Handle WEIGHTED discount
      const slabs = JSON.parse(promotion.promotion.slabs);

      // Convert weight into 500 gm units
      const weightInUnits = Math.ceil(weightInGrams / 500);

      // Iterate through slabs to find applicable discount
      slabs.forEach((slab: { minWeight: number; maxWeight: number | null; discountPerUnit: number }) => {
        const slabMinUnits = slab.minWeight / 500;
        const slabMaxUnits = slab.maxWeight ? slab.maxWeight / 500 : Infinity;

        if (weightInUnits >= slabMinUnits && weightInUnits <= slabMaxUnits) {
          discount += weightInUnits * slab.discountPerUnit;
        }
      });
    }
  });

  return discount;
};


export const createOrder = async (req: Request, res: Response): Promise<void> => {
  await prisma.$transaction(async (tx) => {
    const userId = req.user?.id;

    const cartItems: any[] = await tx.cartItem.findMany({
      where: { userId, ordered: false },
      include: {
        product: {
          include: {
            PromotionProduct: {
              include: { promotion: true },
            },
          },
        },
      },
    });


    if (cartItems.length === 0) {
      res.status(400).json({ message: "Cart is empty" });
      return;
    }

    let subtotal = 0;
    let totalDiscount = 0;

    const orderProducts = cartItems.map((item) => {
      const price = item.quantity * item.product.price;
      const discount = calculateDiscount(price, item.product.PromotionProduct, item.product.weight);

      subtotal += price;
      totalDiscount += discount;

      return {
        productId: item.productId,
        quantity: item.quantity,
        discount,
      };
    });


    const grandTotal = subtotal - totalDiscount;

    const order = await tx.order.create({
      data: {
        userId: userId!,
        status: "PENDING",
        subtotal,
        totalDiscount,
        grandTotal,
        products: {
          create: orderProducts,
        },
      },
    });

    await tx.cartItem.updateMany({
      where: { userId, ordered: false },
      data: { ordered: true },
    });

    const response = new HTTPSuccessResponse("Order created successfully", 201, { order });
    res.status(response.statusCode).json(response);
  });
};

export const getOrderById = async (req: Request, res: Response): Promise<void> => {
  const order = await prisma.order.findFirstOrThrow({
    where: { id: req.params.id, userId: req.user?.id },
    include: {
      products: {
        include: {
          product: {
            include: {
              PromotionProduct: {
                include: { promotion: true },
              },
            },
          },
        },
      },
    },
  });

  const response = new HTTPSuccessResponse("Order fetched successfully", 200, order);
  res.status(response.statusCode).json(response);
};


export const updateOrderStatus = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.id;
  const isAdmin = req.user?.isAdmin;

  try {
    const order = await prisma.order.findFirstOrThrow({
      where: isAdmin ? { id: req.params.id } : { id: req.params.id, userId },
    });

    const updatedOrder = await prisma.order.update({
      where: { id: order.id },
      data: {
        status: req.body.status,
      },
    });

    const responseMessage = req.body.status === "CANCELLED"
      ? "Order cancelled successfully"
      : "Order status updated successfully";

    const response = new HTTPSuccessResponse(responseMessage, 200, updatedOrder);
    res.status(response.statusCode).json(response);
  } catch (error) {
    throw new NotFoundException("Order not found", ErrorCode.ORDER_NOT_FOUND);
  }
};


export const getOrders = async (req: Request, res: Response): Promise<void> => {
  const orders = await prisma.order.findMany({
    where: { userId: req.user?.id },
    include: {
      products: {
        include: {
          product: {
            include: {
              PromotionProduct: {
                include: { promotion: true },
              },
            },
          },
        },
      },
    },
  });

  const response = new HTTPSuccessResponse("Orders fetched successfully", 200, orders);
  res.status(response.statusCode).json(response);
};


export const getAllOrders = async (
  req: Request,
  res: Response
): Promise<void> => {
  // Extract pagination and filter parameters from the query string
  const page = parseInt(req.query.page as string) || 1; // Default to page 1 if not provided
  const limit = parseInt(req.query.limit as string) || 10; // Default to 10 items per page
  const userId = req.query.userId as string; // Optional filter for orders by userId

  // Calculate the offset
  const offset = (page - 1) * limit;

  // Build the `where` condition dynamically
  const whereCondition: Record<string, any> = {};
  if (userId) {
    whereCondition.userId = userId;
  }

  // Fetch the paginated orders and total count
  const [orders, totalCount] = await prisma.$transaction([
    prisma.order.findMany({
      where: whereCondition,
      skip: offset,
      take: limit,
      select: {
        id: true,
        userId: true,
        createdAt: true,
        updatedAt: true,
        status: true,
        grandTotal: true,
        totalDiscount: true,
        subtotal: true,
        user: {
          select: {
            id: true,
            email: true,
          },
        },
        products: {
          select: {
            id: true,
            quantity: true,
            product: {
              select: {
                id: true,
                name: true,
                price: true,

              },
            },
          },
        },
      },
    }),
    prisma.order.count({
      where: whereCondition,
    }),
  ]);

  // Calculate total pages
  const totalPages = Math.ceil(totalCount / limit);

  // Prepare the response data
  const responseData = {
    collections:orders,
    pagination: {
      totalItems: totalCount,
      totalPages,
      currentPage: page,
      itemsPerPage: limit,
    },
  };

  // Respond with the formatted success response
  const response = new HTTPSuccessResponse(
    "Orders fetched successfully",
    200,
    responseData
  );
  res.status(response.statusCode).json(response);
};

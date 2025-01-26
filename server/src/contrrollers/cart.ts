import prisma from "../connect";
import { AddToCartSchema, changeQuantitySchema } from "../schema/cart";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCode } from "../exceptions/root";
import { Request, Response } from "express";
import { HTTPSuccessResponse } from "../helpers/success-response";
import { Product } from "@prisma/client";
import { handleValidationError } from "../helpers/common-methods";

export const addToCart = async (req: Request, res: Response) => {
  const validateResult = AddToCartSchema.safeParse(req.body);

  if (!validateResult.success) {
    return handleValidationError(res, validateResult);
  }


  let product: Product;

  try {
    product = await prisma.product.findFirstOrThrow({
      where: { id: validateResult.data.productId, enabled: true },
    });
  } catch (error) {
    throw new NotFoundException(
      "Product not found",
      ErrorCode?.PRODUCT_NOT_FOUND
    );
  }

  const existingCartItem = await prisma.cartItem.findFirst({
    where: { productId: product.id, userId: req.user?.id, ordered: false },
  });

  const cartItem = existingCartItem
    ? await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: {
          quantity: existingCartItem.quantity + validateResult.data.quantity,
        },
      })
    : await prisma.cartItem.create({
        data: { productId: product.id, userId: req.user?.id!, quantity: validateResult.data.quantity },
      });

  res
    .status(201)
    .json(
      new HTTPSuccessResponse(
        "Product added to cart successfully",
        201,
        cartItem
      )
    );
};

export const deleteCartItem = async (req: Request, res: Response) => {
  const cartItemId = req.params.id;
  const userId = req.user?.id;

  await prisma.cartItem
    .delete({ where: { id: cartItemId, userId } })
    .catch(() => {
      throw new NotFoundException(
        "Cart item not found",
        ErrorCode.NO_AUTHORIZED
      );
    });

  res
    .status(204)
    .json(new HTTPSuccessResponse("Cart item deleted successfully", 204));
};

export const getCart = async (req: Request, res: Response) => {
  const userId = req.user?.id;

  // Fetch cart items for the user
  const cart = await prisma.cartItem.findMany({
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

  // Filter out disabled promotions in PromotionProduct
  const filteredCart = cart.map((item) => ({
    ...item,
    product: {
      ...item.product,
      PromotionProduct: item.product.PromotionProduct.filter(
        (promoProduct) => promoProduct.promotion.enabled
      ),
    },
  }));

  res
    .status(200)
    .json(new HTTPSuccessResponse("Cart fetched successfully", 200, filteredCart));
};

export const changeQuantity = async (req: Request, res: Response) => {
  const validateResult = changeQuantitySchema.safeParse(req.body);

  if (!validateResult.success) {
    return handleValidationError(res, validateResult);
  }

  const cartItemId = req.params.id;
  const userId = req.user?.id;

  const cartItem = await prisma.cartItem
    .findFirstOrThrow({
      where: { id: cartItemId, userId },
    })
    .catch(() => {
      throw new NotFoundException("Cart not found", ErrorCode.CART_NOT_FOUND);
    });

  await prisma.cartItem.update({
    where: { id: cartItem.id },
    data: { quantity: validateResult.data.quantity },
  });

  res
    .status(200)
    .json(new HTTPSuccessResponse("Quantity updated successfully", 200));
};

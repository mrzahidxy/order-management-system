import { NextFunction, Request, Response } from "express";
import prisma from "../connect";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCode } from "../exceptions/root";
import { HTTPSuccessResponse } from "../helpers/success-response";
import { PromotionSchema } from "../schema/promotion";
import { handleValidationError } from "../helpers/common-methods";

// Promotion CRUD Controllers

export const createPromotion = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validateResult = PromotionSchema.safeParse(req.body);

  if (!validateResult.success) {
    return handleValidationError(res, validateResult);
  }

  const {
    title,
    startDate,
    endDate,
    type,
    discount,
    slabs,
    enabled,
    productIds,
  } = validateResult.data;

  const promotion = await prisma.promotion.create({
    data: {
      title,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      type,
      discount,
      slabs: slabs ? JSON.stringify(slabs) : undefined,
      enabled: enabled ?? true,
      products: {
        create: productIds.map((productId: string) => ({ productId })),
      },
    },
  });

  const response = new HTTPSuccessResponse(
    "Promotion created successfully",
    201,
    promotion
  );
  res.status(response.statusCode).json(response);
};

// Get All Promotions
export const getPromotions = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { page = 1, limit = 10, enabled } = req.query;
  const skip = (Number(page) - 1) * Number(limit);
  const isEnabled =
    req.query.enabled === undefined ? undefined : enabled === "true"; // Handle optional enabled filter

  console.log("isEnabled", isEnabled);

  // Fetch promotions based on the `enabled` status
  const promotions = await prisma.promotion.findMany({
    skip,
    take: Number(limit),
    where: {
      endDate: {
        gte: new Date(), // Exclude expired promotions
      },
      enabled: isEnabled, // Use the converted boolean
    },
    include: {
      products: {
        include: {
          product: true,
        },
      },
    },
  });

  // Count total promotions based on the `enabled` status
  const totalPromotions = await prisma.promotion.count({
    where: {
      endDate: {
        gte: new Date(),
      },
      enabled: isEnabled, // Use the converted boolean
    },
  });

  // Calculate total pages
  const totalPages = Math.ceil(totalPromotions / Number(limit));

  // Prepare the response payload
  const response = new HTTPSuccessResponse(
    "Promotions fetched successfully",
    200,
    {
      collections: promotions,
      pagination: {
        currentPage: Number(page),
        totalPages,
        totalPromotions,
        limit: Number(limit),
      },
    }
  );

  // Send the response
  res.status(response.statusCode).json(response);
};

export const getPromotionById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  try {
    const promotion = await prisma.promotion.findFirstOrThrow({
      where: { id },
      include: {
        products: {
          include: {
            product: true,
          },
        },
      },
    });

    const response = new HTTPSuccessResponse(
      "Promotion fetched successfully",
      200,
      promotion
    );
    res.status(response.statusCode).json(response);
  } catch (error) {
    throw new NotFoundException("Promotion not found", ErrorCode.NOT_FOUND);
  }
};

export const updatePromotion = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const { title, startDate, endDate } = req.body;

  try {
    const promotion = await prisma.promotion.update({
      where: { id },
      data: {
        title,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
      },
      include: {
        products: true,
      },
    });

    const response = new HTTPSuccessResponse(
      "Promotion updated successfully",
      200,
      promotion
    );
    res.status(response.statusCode).json(response);
  } catch (error) {
    throw new NotFoundException("Something went wrong", ErrorCode.NOT_FOUND);
  }
};

export const deletePromotion = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  try {
    await prisma.promotion.delete({ where: { id } });

    const response = new HTTPSuccessResponse(
      "Promotion deleted successfully",
      200
    );
    res.status(response.statusCode).json(response);
  } catch (error) {
    throw new NotFoundException("Promotion not found", ErrorCode.NOT_FOUND);
  }
};

export const disablePromotion = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  console.log("id", id);

  try {
    const promotion = await prisma.promotion.update({
      where: { id },
      data: { enabled: false },
    });

    const response = new HTTPSuccessResponse(
      "Promotion disabled successfully",
      200,
      promotion
    );
    res.status(response.statusCode).json(response);
  } catch (error) {
    throw new NotFoundException("Promotion not found", ErrorCode.NOT_FOUND);
  }
};

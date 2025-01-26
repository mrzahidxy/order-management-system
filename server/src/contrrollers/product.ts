import { Request, Response } from "express";
import prisma from "../connect";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCode } from "../exceptions/root";
import { HTTPSuccessResponse } from "../helpers/success-response";

export const createProduct = async (req: Request, res: Response) => {
  const { name, description, price, weight } = req.body;

  const product = await prisma.product.create({
    data: {
      name,
      description,
      price: parseFloat(price),
      weight: parseFloat(weight),
      enabled: true,
    },
  });

  const response = new HTTPSuccessResponse(
    "Product created successfully",
    201,
    product
  );
  res.status(response.statusCode).json(response);
};

export const updateProduct = async (req: Request, res: Response) => {
  const { name, description, price, weight, enabled } = req.body;

  const product = await prisma.product.update({
    where: { id: req.params.id },
    data: {
      name,
      description,
      price: price ? parseFloat(price) : undefined,
      weight: weight ? parseFloat(weight) : undefined,
      enabled: typeof enabled === "boolean" ? enabled : undefined,
    },
  });

  const response = new HTTPSuccessResponse(
    "Product updated successfully",
    200,
    product
  );
  res.status(response.statusCode).json(response);
};

export const toggleProductStatus = async (req: Request, res: Response) => {
  const { enabled } = req.body;

  const product = await prisma.product.update({
    where: { id: req.params.id },
    data: {
      enabled: Boolean(enabled),
    },
  });

  const response = new HTTPSuccessResponse(
    `Product ${enabled ? "enabled" : "disabled"} successfully`,
    200,
    product
  );
  res.status(response.statusCode).json(response);
};

export const getProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  // Extract pagination and filter parameters from the query string
  const page = parseInt(req.query.page as string) || 1; // Default to page 1 if not provided
  const limit = parseInt(req.query.limit as string) || 10; // Default to 10 items per page
  const enabled =
    req.query.enabled === undefined ? undefined : req.query.enabled === "true"; // Handle optional enabled filter

  // Calculate the offset
  const offset = (page - 1) * limit;

  // Build the `where` condition dynamically
  const whereCondition: Record<string, any> = {};
  if (enabled !== undefined) {
    whereCondition.enabled = enabled;
  }

  // Fetch the paginated products and total count
  const [products, totalCount] = await prisma.$transaction([
    prisma.product.findMany({
      where: whereCondition,
      skip: offset,
      take: limit,
    }),
    prisma.product.count({
      where: whereCondition,
    }),
  ]);

  // Calculate total pages
  const totalPages = Math.ceil(totalCount / limit);

  // Prepare the response data
  const responseData = {
    collections: products,
    pagination: {
      totalItems: totalCount,
      totalPages,
      currentPage: page,
      itemsPerPage: limit,
    },
  };

  // Respond with the formatted success response
  const response = new HTTPSuccessResponse(
    "Products fetched successfully",
    200,
    responseData
  );
  res.status(response.statusCode).json(response);
};

export const getProductById = async (req: Request, res: Response) => {
  const product = await prisma.product.findUnique({
    where: { id: req.params.id },
  });

  if (!product) {
    throw new NotFoundException(
      "Product not found",
      ErrorCode.PRODUCT_NOT_FOUND
    );
  }

  const response = new HTTPSuccessResponse(
    "Product fetched successfully",
    200,
    product
  );
  res.status(response.statusCode).json(response);
};

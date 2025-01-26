import { NextFunction, Request, Response } from "express";
import { compareSync, hashSync } from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../connect";
import { BadRequestException } from "../exceptions/bad-request";
import { ErrorCode } from "../exceptions/root";
import { SignUpSchema } from "../schema/users";
import { NotFoundException } from "../exceptions/not-found";
import { JWT_SECRET } from "../secret";
import { HTTPSuccessResponse } from "../helpers/success-response";
import { handleValidationError } from "../helpers/common-methods";

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validateResult = SignUpSchema.safeParse(req.body);
  if (!validateResult.success) {
    return handleValidationError(res, validateResult);
  }

  const { email, password } = validateResult.data;

  let user = await prisma.user.findUnique({
    where: { email },
  });

  if (user) {
    return next(
      new BadRequestException(
        "User already exists",
        ErrorCode.USER_ALREADY_EXISTS
      )
    );
  }

  user = await prisma.user.create({
    data: {
      email,
      password: hashSync(password, 10),
    },
  });

  const { password: userPassword, ...rest } = user;

  const response = new HTTPSuccessResponse("Signup successfully", 201, rest);
  res.status(response.statusCode).json(response);
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return next(
      new NotFoundException("No user found", ErrorCode.USER_NOT_FOUND)
    );
  }

  if (!compareSync(password, user.password)) {
    return next(
      new BadRequestException("Wrong password", ErrorCode.INCORRECT_PASSWORD)
    );
  }

  const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1d" });

  const { password: userPassword, ...rest } = user;

  const response = new HTTPSuccessResponse("Login successfully", 201, {
    ...rest,
    token,
  });
  res.status(response.statusCode).json(response);
};

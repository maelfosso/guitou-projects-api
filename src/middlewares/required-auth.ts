import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { BadRequestError } from "../errors/bad-request-error";
import { NotAuthenticatedError } from "../errors/not-authenticated-error";

interface UserPayload {}

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}
const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader: string = <string>req.headers["Authorization"] ; 
  const token: string = authHeader && authHeader.split(" ")[1];

  if (!token) {
    throw new BadRequestError(`Authentication TOKEN required`);
  }

  let jwtPayload;
  const JWT_PUBLIC_KEY = process.env.JWT_PUBLIC_KEY;

  try {
    jwtPayload = jwt.verify(token, JWT_PUBLIC_KEY!) as UserPayload;
    req.currentUser = jwtPayload;
  } catch (error) {
    throw new Error(error.message);
  }

  if (!req.currentUser) {
    throw new NotAuthenticatedError();
  }

  next();
}

export { requireAuth };

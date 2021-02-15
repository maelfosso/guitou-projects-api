import { Request, Response, NextFunction } from "express";
// import { AuthenticationError } from "../errors/authentication-error";
// import { config } from '../config/config'

const AUTH_TOKEN = ''; // config.auth;

const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authorization = req.headers["authorization"] ; 

  if (authorization !== AUTH_TOKEN) {
    // throw new AuthenticationError();
    throw new Error(`Authentication required`);
  }

  next();
}

export { requireAuth };

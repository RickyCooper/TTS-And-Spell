import { Request, Response, NextFunction } from "express";

export const errorHandler = (err: Error, req: Request, res: Response, _next: NextFunction): void => {
  console.error(err);
  const isDev = process.env.NODE_ENV !== "production";
  res.status(500).json({
    message: "Internal server error",
    ...(isDev && { error: err.message, stack: err.stack }),
  });
}

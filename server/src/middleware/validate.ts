import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

export const validate = (schema: ZodSchema, source: "body" | "query" = "body") => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      res.status(400).json({ message: result.error.issues[0].message });
      return;
    }
    // req.query is read-only in Express 5, so parsed query values go on res.locals
    if (source === "body") req.body = result.data;
    else res.locals.query = result.data;
    next();
  };
}

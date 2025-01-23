import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { CustomRequest } from "../types/types";

const authCheckMiddleware = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer")) {
    res.status(401).json({
      success: false,
      message: "either token is empty or is not valid",
    });
    return;
  }

  const token = header.split(" ")[1];

  jwt.verify(token, process.env.SECRET_KEY, (error, decoded) => {
    if (error) {
      if (error.name === "TokenExpiredError") {
        res.status(401).json({ success: false, message: error.name });
      } else {
        res.status(403).json({ success: false, message: "Token is not valid" });
      }
      return;
    }

    // Приведение типа для req, чтобы указать TypeScript, что у него есть свойство user
    req.user = decoded;
    next();
  });
};

export default authCheckMiddleware;

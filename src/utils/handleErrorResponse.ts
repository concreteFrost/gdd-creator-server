import { Response } from "express";

export function handleErrorResponse(res: Response, error: any) {
  res.status(500).json({
    success: false,
    message: "Something went wrong",
    error,
  });
}

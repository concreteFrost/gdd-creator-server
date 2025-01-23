import { validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json(errors.array()); // Рекомендуется использовать 400 для ошибок валидации
    return;
  }
  next();
};

export default handleValidationErrors;

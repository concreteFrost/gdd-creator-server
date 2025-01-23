import { Router } from "express";
import { checkToken, login, register } from "../controllers/authController";
import { registrationValidator } from "../validators/validation";
import handleValidationErrors from "../utils/handleValidationErrors";
import authCheckMiddleware from "../middleware/authCheck";

const authRoutes: Router = Router();

authRoutes.post(
  "/auth/register",
  registrationValidator,
  handleValidationErrors,
  register
);

authRoutes.post("/auth/login", login);
authRoutes.get("/auth/checktoken", authCheckMiddleware, checkToken); // for testing

export default authRoutes;

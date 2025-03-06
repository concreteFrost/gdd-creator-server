import { Router } from "express";
import {
  changePassword,
  checkToken,
  deleteAccount,
  forgotPassword,
  login,
  register,
  resetPassword,
  validatePassResetToken,
} from "../controllers/authController";
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
authRoutes.get("/auth/checktoken", authCheckMiddleware, checkToken);
authRoutes.put("/auth/update-password", authCheckMiddleware, changePassword);
authRoutes.post("/auth/forgot-password", forgotPassword);
authRoutes.post("/auth/validate-token", validatePassResetToken);
authRoutes.post("/auth/reset-password", resetPassword);
authRoutes.delete("/auth/delete-user", authCheckMiddleware, deleteAccount);
export default authRoutes;

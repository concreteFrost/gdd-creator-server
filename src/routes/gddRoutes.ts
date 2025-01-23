import { Router } from "express";
import handleValidationErrors from "../utils/handleValidationErrors";
import {
  createGDD,
  deleteGDD,
  editGDD,
  getAllGDD,
  getGDDById,
} from "../controllers/gddController";
import authCheckMiddleware from "../middleware/authCheck";
import { gddCreateValidator, gddEditValidator } from "../validators/validation";

const gddRoutes: Router = Router();

gddRoutes.post(
  "/gdd/create",
  gddCreateValidator,
  handleValidationErrors,
  authCheckMiddleware,
  createGDD
);

gddRoutes.put(
  "/gdd/update",
  gddEditValidator,
  handleValidationErrors,
  authCheckMiddleware,
  editGDD
);

gddRoutes.get("/gdd/get/:id", authCheckMiddleware, getGDDById);
gddRoutes.get("/gdd/get-all", authCheckMiddleware, getAllGDD);
gddRoutes.delete("/gdd/delete/:id", authCheckMiddleware, deleteGDD);

export default gddRoutes;

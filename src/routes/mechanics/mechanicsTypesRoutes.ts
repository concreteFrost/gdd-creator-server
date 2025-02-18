import { Router } from "express";
import handleValidationErrors from "../../utils/handleValidationErrors";
import authCheckMiddleware from "../../middleware/authCheck";
import {
  createType,
  deleteType,
  getAllTypes,
  getType,
  updateType,
} from "../../controllers/mechanics/mechanicsTypesController";
import {
  createTypeValidator,
  updateTypeValidator,
} from "../../validators/validation";

const mechanicTypeRoutes: Router = Router();

mechanicTypeRoutes.post(
  "/type/create",
  createTypeValidator,
  handleValidationErrors,
  authCheckMiddleware,
  createType
);
mechanicTypeRoutes.put(
  "/type/update",
  updateTypeValidator,
  handleValidationErrors,
  authCheckMiddleware,
  updateType
);
mechanicTypeRoutes.delete("/type/delete/:id", authCheckMiddleware, deleteType);
mechanicTypeRoutes.get("/type/get/:id", authCheckMiddleware, getType);
mechanicTypeRoutes.get("/type/get-all/:id", authCheckMiddleware, getAllTypes);

export default mechanicTypeRoutes;

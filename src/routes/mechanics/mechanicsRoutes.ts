import { Router } from "express";
import handleValidationErrors from "../../utils/handleValidationErrors";
import authCheckMiddleware from "../../middleware/authCheck";
import {
  createMechanic,
  deleteMechanic,
  getAllMechanicByGDD,
  getMechanic,
  updateMechanic,
} from "../../controllers/mechanics/mechanicsController";

const mechanicRoutes: Router = Router();

mechanicRoutes.post("/mechanic/create", authCheckMiddleware, createMechanic);
mechanicRoutes.put("/mechanic/update", authCheckMiddleware, updateMechanic);
mechanicRoutes.delete(
  "/mechanic/delete/:id",
  authCheckMiddleware,
  deleteMechanic
);
mechanicRoutes.get("/mechanic/get/:id", authCheckMiddleware, getMechanic);
mechanicRoutes.get(
  "/mechanic/get-all/:id",
  authCheckMiddleware,
  getAllMechanicByGDD
);

export default mechanicRoutes;

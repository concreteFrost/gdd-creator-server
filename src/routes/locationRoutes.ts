import { Router } from "express";
import { upload } from "../multer/multer";
import authCheckMiddleware from "../middleware/authCheck";
import {
  createLocation,
  deleteAllLocations,
  deleteLocation,
  getAllLocations,
  getLocation,
  updateLocation,
} from "../controllers/locationsController";

const locationRoutes = Router();

locationRoutes.post(
  "/location/create",
  authCheckMiddleware,
  upload.single("location"),
  createLocation
);

locationRoutes.put(
  "/location/update",
  authCheckMiddleware,
  upload.single("location"),
  updateLocation
);

locationRoutes.get("/location/get/:id", authCheckMiddleware, getLocation);
locationRoutes.get(
  "/location/get-all/:id",
  authCheckMiddleware,
  getAllLocations
);

locationRoutes.delete(
  "/location/delete/:id",
  authCheckMiddleware,
  deleteLocation
);
locationRoutes.delete(
  "/location/delete-all/:id",
  authCheckMiddleware,
  deleteAllLocations
);

export default locationRoutes;

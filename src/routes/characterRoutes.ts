import { Router } from "express";
import { upload } from "../multer/multer";
import {
  createCharacter,
  deleteAllCharacters,
  deleteCharacter,
  getAllCharacters,
  getCharacter,
  updateCharacter,
} from "../controllers/charactersController";
import authCheckMiddleware from "../middleware/authCheck";
import {
  createCharaccterValidator,
  updateCharacterValidator,
} from "../validators/validation";
import handleValidationErrors from "../utils/handleValidationErrors";

const characterRoutes = Router();

characterRoutes.post(
  "/character/create",
  authCheckMiddleware,
  upload.single("character"),
  createCharaccterValidator,
  handleValidationErrors,
  createCharacter
);

characterRoutes.put(
  "/character/update",
  upload.single("character"),
  updateCharacterValidator,
  handleValidationErrors,
  authCheckMiddleware,
  updateCharacter
);

characterRoutes.delete(
  "/character/delete",
  authCheckMiddleware,
  deleteCharacter
);

characterRoutes.delete(
  "/character/delete-all/:id",
  authCheckMiddleware,
  deleteAllCharacters
);

characterRoutes.get(
  "/character/get-all/:id",
  authCheckMiddleware,
  getAllCharacters
);

characterRoutes.get("/character/get/:id", authCheckMiddleware, getCharacter);

export default characterRoutes;

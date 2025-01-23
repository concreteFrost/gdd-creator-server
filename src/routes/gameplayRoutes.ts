import { Router } from "express";
import authCheckMiddleware from "../middleware/authCheck";
import { gameplayCreateValidator } from "../validators/validation";
import { editGameplay, getGameplay } from "../controllers/gameplayController";
import handleValidationErrors from "../utils/handleValidationErrors";

const gameplayRoutes: Router = Router();

// gameplayRoutes.post("/gameplay/create", authCheckMiddleware, createGameplay);
gameplayRoutes.put(
  "/gameplay/update",
  gameplayCreateValidator,
  handleValidationErrors,
  authCheckMiddleware,
  editGameplay
);
gameplayRoutes.get("/gameplay/get/:id", authCheckMiddleware, getGameplay);

export default gameplayRoutes;

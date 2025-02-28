import { body } from "express-validator";
import { GameView, GamePlatform } from "../models/gddModel";

export const registrationValidator = [
  body("password_hash", "your password is not secure enough").isLength({
    min: 8,
  }),
  body("username", "name cant be blank").isLength({ min: 1 }),
  body("email", "please provide correct email address").isEmail(),
];

export const passResetValidator = [
  body("email", "email cant be blank").isString().isEmpty(),
  body("email", "please provide correct email address").isEmail(),
];

export const gddCreateValidator = [
  body("title", "Title is required and must be a valid string")
    .isString()
    .notEmpty(),
  body("genre", "Genre is required and must be a valid string")
    .isString()
    .notEmpty(),

  body("view", "View is required and must be one of the valid options")
    .isString()
    .notEmpty()
    .custom((value) => Object.values(GameView).includes(value))
    .withMessage(
      `View must be one of the following: ${Object.values(GameView).join(", ")}`
    ),

  body("platform", "Platform is required and must be one of the valid options")
    .isString()
    .notEmpty()
    .custom((value) => Object.values(GamePlatform).includes(value))
    .withMessage(
      `Platform must be one of the following: ${Object.values(
        GamePlatform
      ).join(", ")}`
    ),
];

export const gddEditValidator = [
  body("id", "Id for this gdd was not provided").isString().notEmpty(),
  body("title", "Title is required and must be a valid string")
    .isString()
    .notEmpty(),
  body("genre", "Genre is required and must be a valid string")
    .isString()
    .notEmpty(),

  body("view", "View is required and must be one of the valid options")
    .isString()
    .notEmpty()
    .custom((value) => Object.values(GameView).includes(value))
    .withMessage(
      `View must be one of the following: ${Object.values(GameView).join(", ")}`
    ),

  body("platform", "Platform is required and must be one of the valid options")
    .isString()
    .notEmpty()
    .custom((value) => Object.values(GamePlatform).includes(value))
    .withMessage(
      `Platform must be one of the following: ${Object.values(
        GamePlatform
      ).join(", ")}`
    ),
];

export const gameplayCreateValidator = [
  // body("gdd_id", "gdd_id cannot be null").isEmpty(),
  body("difficulty", "difficulty length cannot exceed 255 symbols").isLength({
    min: 0, // или 0, если пустое поле допустимо
    max: 255,
  }),
];

//create mechanics type
export const createTypeValidator = [
  body("gdd_id", "gdd_id cant be null").isString().notEmpty(),
  body("type", "type name cant be null").isString().notEmpty(),
];

//update mechanics type
export const updateTypeValidator = [
  ...createTypeValidator,
  body("type", "type name cant be null").isString().notEmpty(),
];

//create character
export const createCharaccterValidator = [
  body("name", "name cant be blank").isString().notEmpty(),
  body("gdd_id", "gdd id signature is invalid")
    .isUUID("4")
    .withMessage("Invalid UUID format"),
];

export const updateCharacterValidator = [
  ...createCharaccterValidator,
  body("id", "id cant be blank").isString().notEmpty(),
];

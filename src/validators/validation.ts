import { body } from "express-validator";
import { GameView, GamePlatform } from "../models/gddModel";

export const registrationValidator = [
  body("password_hash", "your password is not secure enough").isLength({
    min: 4,
  }),
  body("username", "name cant be blank").isLength({ min: 1 }),
  body("email", "please provide correct email address").isEmail(),
];

// Валидатор для создания GddStructure
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

// Валидатор для создания GddStructure
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

export const cretateTypeValidator = [
  body("gdd_id", "gdd_id cant be null").isString().notEmpty(),
  body("type", "type name cant be null").isString().notEmpty(),
];

export const updateTypeValidator = [
  body("id", "id cant be null").isString().notEmpty(),
  body("gdd_id", "gdd_id cant be null").isString().notEmpty(),
  body("type", "type name cant be null").isString().notEmpty(),
];

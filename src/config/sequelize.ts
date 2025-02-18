import { Sequelize } from "sequelize-typescript";
import dotenv from "dotenv";
import UserModel from "../models/userModel";
import GDDModel from "../models/gddModel";
import GameplayModel from "../models/gameplayModel";
import GameplayObjectiveModel from "../models/gameplayObjectiveModel";
import GameplayProgressionModel from "../models/gameplayProgressionModel";
import MechanicModel from "../models/mechanics/mechanicModel";
import MechanicTypeModel from "../models/mechanics/mechanicTypeModel";
import CharacterModel from "../models/characterModel";
import LocationModel from "../models/locationModel";
import LocationsCharactersModel from "../models/locationsUsersModel";

dotenv.config();

const sequelize = new Sequelize({
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  dialect: "mysql",
  models: [
    UserModel,
    GDDModel,
    GameplayModel,
    GameplayObjectiveModel,
    GameplayProgressionModel,
    MechanicModel,
    MechanicTypeModel,
    CharacterModel,
    LocationModel,
    LocationsCharactersModel,
  ],
  logging: false,
  pool: {
    min: 0,
    max: 100,
    idle: 10000,
    acquire: 30000,
  },
});

export default sequelize;

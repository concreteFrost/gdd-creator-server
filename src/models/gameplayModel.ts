import { ForeignKey } from "sequelize-typescript";
import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
} from "sequelize-typescript";
import GDDModel from "./gddModel";

// Gameplay Interface
export interface GameplayStructure {
  id: string;
  story: string; // Brief story or narrative of the game
  difficulty: string; // Difficulty settings (e.g., Easy, Hard)
  pacing: string; // Game pacing (e.g., fast-paced, slow-building)
  player_experience: string; // Type of experience expected for the player (e.g., strategic, fast reflexes)
  gdd_id: string;
  objectives?: string[] | string;
  progressions?: string[] | string;
  created_at: Date;
  updated_at?: Date;
}

@Table({ tableName: "gameplay", timestamps: true })
class GameplayModel
  extends Model<GameplayStructure>
  implements GameplayStructure
{
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
    primaryKey: true,
  })
  declare id: string;

  @Column({
    type: DataType.TEXT,
  })
  declare story: string;

  @Column({
    type: DataType.STRING,
  })
  declare difficulty: string;

  @Column({
    type: DataType.TEXT,
  })
  declare pacing: string;

  @Column({
    type: DataType.TEXT,
  })
  declare player_experience: string;

  @Column({
    type: DataType.JSON, // Используем тип JSON для примеров
    allowNull: true, // Может быть null, если примеры не переданы
  })
  declare objectives?: string[]; // Массив строк или строка

  @Column({
    type: DataType.JSON, // Используем тип JSON для примеров
    allowNull: true, // Может быть null, если примеры не переданы
  })
  declare progressions?: string[]; // Массив строк или строка

  @ForeignKey(() => GDDModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare gdd_id: string;

  @CreatedAt
  @Column({
    type: DataType.DATE,
  })
  declare created_at: Date;

  @UpdatedAt
  @Column({
    type: DataType.DATE,
  })
  declare updated_at: Date;
}

export default GameplayModel;

import { ForeignKey } from "sequelize-typescript";
import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
} from "sequelize-typescript";
import GameplayModel from "./gameplayModel";

export interface GameplayProgressionStructure {
  id: string;
  gameplay_id: string;
  progression: string;
  created_at: Date;
  updated_at?: Date;
}

@Table({ tableName: "gameplay_progressions", timestamps: true })
class GameplayProgressionModel
  extends Model<GameplayProgressionStructure>
  implements GameplayProgressionStructure
{
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
    primaryKey: true,
  })
  declare id;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare progression: string;

  @ForeignKey(() => GameplayModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare gameplay_id: string;

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

export default GameplayProgressionModel;

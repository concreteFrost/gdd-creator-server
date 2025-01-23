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

export interface GameplayObjectiveStructure {
  id: string;
  gameplay_id: string;
  objective: string;
  created_at: Date;
  updated_at?: Date;
}

@Table({ tableName: "gameplay_objectives", timestamps: true })
class GameplayObjectiveModel
  extends Model<GameplayObjectiveStructure>
  implements GameplayObjectiveStructure
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
  declare objective: string;

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

export default GameplayObjectiveModel;

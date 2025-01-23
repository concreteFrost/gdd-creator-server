import {
  Model,
  Table,
  Column,
  ForeignKey,
  DataType,
  CreatedAt,
  UpdatedAt,
  AllowNull,
} from "sequelize-typescript";
import GDDModel from "../gddModel";
import MechanicTypeModel from "./mechanicTypeModel";

export interface MechanicStructure {
  id: string;
  name: string;
  gdd_id: string;
  type_id: string;
  description: string;
  examples?: string[] | string; // Это поле теперь будет хранить массив или строку
  created_at: Date;
  updated_at?: Date;
}

@Table({ tableName: "mechanics", timestamps: true })
class MechanicModel
  extends Model<MechanicStructure>
  implements MechanicStructure
{
  @Column({
    type: DataType.UUIDV4,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
    primaryKey: true,
  })
  declare id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare name: string;

  @Column({
    type: DataType.TEXT,
  })
  declare description: string;

  @ForeignKey(() => GDDModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare gdd_id: string;

  @ForeignKey(() => MechanicTypeModel)
  @Column({
    type: DataType.UUID,
  })
  declare type_id: string;

  @Column({
    type: DataType.JSON, // Используем тип JSON для примеров
    allowNull: true, // Может быть null, если примеры не переданы
  })
  declare examples?: string[]; // Массив строк или строка

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

export default MechanicModel;

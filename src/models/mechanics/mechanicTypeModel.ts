import {
  Model,
  Table,
  Column,
  ForeignKey,
  DataType,
  CreatedAt,
  UpdatedAt,
} from "sequelize-typescript";
import GDDModel from "../gddModel";

export interface MechanicTypeStructure {
  id: string;
  gdd_id: string;
  type: string;
  created_at: Date;
  updated_at?: Date;
}

@Table({ tableName: "mechanics_types", timestamps: true })
class MechanicTypeModel
  extends Model<MechanicTypeStructure>
  implements MechanicTypeStructure
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
  })
  declare type: string;

  @ForeignKey(() => GDDModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare gdd_id: string;

  //insert mechanic_type id

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

export default MechanicTypeModel;

import {
  Column,
  Model,
  DataType,
  Table,
  ForeignKey,
  PrimaryKey,
} from "sequelize-typescript";
import GDDModel from "./gddModel";

export interface LocationStructure {
  id: string;
  name: string;
  description: string;
  environment: string;
  img?: string | null;
  gdd_id: string;
}

@Table({ tableName: "locations", timestamps: false })
class LocationModel
  extends Model<LocationStructure>
  implements LocationStructure
{
  @PrimaryKey
  @Column({
    type: DataType.UUIDV4,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
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

  @Column({
    type: DataType.STRING,
  })
  declare environment: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare img: string | null;

  @ForeignKey(() => GDDModel)
  @Column({
    type: DataType.UUIDV4,
    allowNull: false,
  })
  declare gdd_id: string;
}

export default LocationModel;

import {
  Column,
  Model,
  DataType,
  Table,
  ForeignKey,
  PrimaryKey,
} from "sequelize-typescript";
import GDDModel from "./gddModel";

export interface CharacterStructure {
  id: string;
  name: string;
  role: string;
  backstory: string;
  abilities: string;
  traits: string;
  img?: string | null;
  gdd_id: string;
}

@Table({ tableName: "characters", timestamps: false })
class CharacterModel
  extends Model<CharacterStructure>
  implements CharacterStructure
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
    type: DataType.STRING,
  })
  declare role: string;

  @Column({
    type: DataType.TEXT,
  })
  declare backstory: string;

  @Column({
    type: DataType.JSON,
  })
  declare abilities: string;

  @Column({
    type: DataType.JSON,
  })
  declare traits: string;

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

export default CharacterModel;

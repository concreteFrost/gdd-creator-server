import { ForeignKey } from "sequelize-typescript";
import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
} from "sequelize-typescript";
import UserModel from "./userModel";

// Enums for View and Platform
export enum GameView {
  FirstPerson = "First Person",
  ThirdPerson = "Third Person",
  TopDown = "Top Down",
  SideScroller = "Side Scroller",
  Isometric = "Isometric",
  TwoD = "2D",
  ThreeD = "3D",
}

export enum GamePlatform {
  PC = "PC",
  PlayStation = "PlayStation",
  Xbox = "Xbox",
  NintendoSwitch = "Nintendo Switch",
  Mobile = "Mobile",
  Web = "Web",
  VR = "VR",
  AR = "AR",
  Miltiplatform = "Multiplatform",
}

interface GddStructure {
  id: string;
  title: string;
  genre: string;
  view: GameView;
  platform: GamePlatform;
  user_id: string;
  created_at: Date;
  updated_at?: Date;
}

@Table({ tableName: "gdd" })
class GDDModel extends Model<GddStructure> implements GddStructure {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare title: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare genre: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare view;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare platform;

  @ForeignKey(() => UserModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    unique: true,
  })
  user_id: string;

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

export default GDDModel;

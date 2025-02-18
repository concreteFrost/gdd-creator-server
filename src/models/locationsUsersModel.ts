import {
  Table,
  Column,
  ForeignKey,
  Model,
  BelongsTo,
  PrimaryKey,
} from "sequelize-typescript";
import CharacterModel from "./characterModel";
import LocationModel from "./locationModel";

@Table({ tableName: "locations_characters", timestamps: false })
export default class LocationsCharactersModel extends Model {
  @PrimaryKey
  @ForeignKey(() => LocationModel)
  @Column
  location_id!: string;

  @PrimaryKey
  @ForeignKey(() => CharacterModel)
  @Column
  character_id!: string;

  // Устанавливаем связь с CharacterModel
  @BelongsTo(() => CharacterModel, { foreignKey: "character_id" })
  character!: CharacterModel;

  // Устанавливаем связь с LocationModel
  @BelongsTo(() => LocationModel, { foreignKey: "location_id" })
  location!: LocationModel;
}

import { Transaction } from "sequelize";
import CharacterModel from "../models/characterModel";
import LocationsCharactersModel from "../models/locationsUsersModel";

export async function addCharactersToLocation(
  locationId: string,
  characters: string[], // 💡 Сделали массивом
  transaction: Transaction
): Promise<{ success: boolean; message: string; characterIds: string[] }> {
  // Удаляем старые связи
  console.log(locationId);
  const deletedCount = await LocationsCharactersModel.destroy({
    where: { location_id: locationId },
    transaction,
  });

  console.log(`Deleted ${deletedCount} old records for location ${locationId}`);

  if (characters.length === 0) {
    return {
      success: true,
      message: "No characters provided",
      characterIds: [],
    };
  }

  // Проверяем, какие персонажи реально существуют в БД
  const dbCharacters = await CharacterModel.findAll({
    where: { id: characters },
    transaction,
  });

  if (dbCharacters.length === 0) {
    return {
      success: false,
      message: "No valid characters found",
      characterIds: [],
    };
  }

  // Создаём новые связи
  const locationCharacters = dbCharacters.map((character) => ({
    location_id: locationId,
    character_id: character.id,
  }));

  await LocationsCharactersModel.bulkCreate(locationCharacters, {
    transaction,
  });

  return {
    success: true,
    message: "Characters successfully linked to location",
    characterIds: locationCharacters.map((c) => c.character_id), // 💡 Возвращаем только ID
  };
}

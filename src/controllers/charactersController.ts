import { v4 as uuidv4 } from "uuid";
import { CustomRequest, CustomeFile } from "../types/types";
import { Response } from "express";
import GDDModel from "../models/gddModel";
import CharacterModel, { CharacterStructure } from "../models/characterModel";
import {
  deleteFile,
  getFullImageUrl,
  handleFileOverwrite,
} from "../utils/fileHandlers";
import { handleErrorResponse } from "../utils/handleErrorResponse";
import { s3 } from "../s3/s3";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";

export const createCharacter = async (req: CustomRequest, res: Response) => {
  const { gdd_id, name, abilities, traits, role, backstory } = req.body;

  try {
    const isGddValid = await GDDModel.findOne({ where: { id: gdd_id } });

    if (!isGddValid) {
      res.status(403).json({
        success: false,
        message: "GDD not found. Cannot save character.",
      });

      return;
    }

    let img: string | null = null;

    //use s3 key if file was attached
    //that contains full file path
    if (req.file) {
      const customFile = req.file as CustomeFile;
      img = customFile.key;
    }

    // Parse the abilities and traits if they are strings containing JSON arrays
    const parsedAbilities = JSON.parse(abilities);
    const parsedTraits = JSON.parse(traits);

    const payload: CharacterStructure = {
      id: uuidv4(),
      name,
      role,
      traits: parsedTraits, // Store parsed array
      abilities: parsedAbilities, // Store parsed array
      backstory,
      img,
      gdd_id,
    };

    const newCharacter = await CharacterModel.create(payload);

    res.status(201).json({
      success: true,
      message: "Character has been created",
      character: {
        ...newCharacter.dataValues,
        img: getFullImageUrl(newCharacter.img), // generate full url before sending to client
      },
    });
  } catch (error) {
    console.log(error);
    handleErrorResponse(res, error);
  }
};

export const updateCharacter = async (req: CustomRequest, res: Response) => {
  const { gdd_id, name, abilities, traits, role, id, backstory, imagePath } =
    req.body;

  try {
    const [isGddValid, toEdit] = await Promise.all([
      GDDModel.findByPk(gdd_id),
      CharacterModel.findByPk(id),
    ]);

    if (!isGddValid) {
      res.status(404).json({ success: false, message: "GDD not found." });
      return;
    }
    if (!toEdit) {
      res
        .status(404)
        .json({ success: false, message: "Character does not exist." });
      return;
    }

    // Преобразуем данные способностей и черт
    const parsedAbilities = JSON.parse(abilities);
    const parsedTraits = JSON.parse(traits);

    let img = await handleFileOverwrite(req, toEdit.img);

    // Обновляем данные персонажа
    Object.assign(toEdit, {
      name,
      role,
      backstory,
      abilities: parsedAbilities,
      traits: parsedTraits,
      img: img, // Если нового изображения нет, оставляем старое
    });
    await toEdit.save();

    // Отправляем успешный ответ с обновленным персонажем
    res.status(201).json({
      success: true,
      character: {
        ...toEdit.dataValues,
        img: getFullImageUrl(toEdit.img), // Формируем полный путь к изображению
      },
    });
  } catch (error) {
    console.log(error);
    handleErrorResponse(res, error);
  }
};

export const deleteCharacter = async (req: CustomRequest, res: Response) => {
  try {
    const toDelete = await CharacterModel.findByPk(req.body.id);

    if (!toDelete) {
      res.status(403).json({
        success: false,
        message: "no character has been found",
      });
      return;
    }

    //delete character`s image if image is not null
    if (toDelete.img) {
      const deleteParams = {
        Bucket: process.env.BUCKET_NAME,
        Key: toDelete.img,
      };

      const deleteCommand = new DeleteObjectCommand(deleteParams);

      await s3.send(deleteCommand);
    }

    await toDelete.destroy();

    res
      .status(201)
      .json({ success: true, message: "the character has been deleted" });
  } catch (error) {
    console.log(error);
    handleErrorResponse(res, error);
  }
};

//not in use
export const deleteAllCharacters = async (
  req: CustomRequest,
  res: Response
) => {
  try {
    const toDelete = await CharacterModel.findAll({
      where: { gdd_id: req.params.id },
    });

    if (toDelete.length === 0) {
      res.status(403).json({ success: true, message: "no characters found" });
      return;
    }

    for (const character of toDelete) {
      await deleteFile(character.img);
    }

    await CharacterModel.destroy({ where: { gdd_id: req.params.id } });

    res.status(201).json({ success: true });
  } catch (error) {
    handleErrorResponse(res, error);
  }
};

export const getAllCharacters = async (req: CustomRequest, res: Response) => {
  const { id } = req.params;
  try {
    const allCharacters = await CharacterModel.findAll({
      where: { gdd_id: id },
    });

    if (allCharacters.length === 0) {
      res.status(201).json({ success: true, characters: [] });
      return;
    }

    const charactersWithPath = allCharacters.map(
      (character: CharacterModel) => {
        return {
          ...character.dataValues,
          img: getFullImageUrl(character.img),
          traits: JSON.parse(character.traits),
          abilities: JSON.parse(character.abilities),
        };
      }
    );

    res.status(201).json({ success: true, characters: charactersWithPath });
  } catch (error) {
    console.log(error);
    handleErrorResponse(res, error);
  }
};

export const getCharacter = async (req: CustomRequest, res: Response) => {
  const { id } = req.params;
  try {
    const character = await CharacterModel.findByPk(id);

    if (!character) {
      res
        .status(403)
        .json({ success: false, characters: "no character with this id" });
      return;
    }

    res.status(201).json({
      success: true,
      character: {
        ...character.dataValues,
        img: getFullImageUrl(character.img),
      },
    });
  } catch (error) {
    handleErrorResponse(res, error);
  }
};

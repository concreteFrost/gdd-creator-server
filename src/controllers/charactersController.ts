import { v4 as uuidv4 } from "uuid";
import { CustomRequest } from "../types/types";
import { Response } from "express";
import GDDModel from "../models/gddModel";
import CharacterModel, { CharacterStructure } from "../models/characterModel";
import {
  getFullFilePath,
  getFullImageUrl,
  getShortFilePath,
} from "../utils/fileHandlers";
import fs from "fs";
import path from "path";
import { handleErrorResponse } from "../utils/handleErrorResponse";

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

    //if file was attached then get his shorten path to save in db
    if (req.file) {
      img = getShortFilePath(req);
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
        img: getFullImageUrl(req, newCharacter.img), // generate full url before sending to client
      },
    });
  } catch (error) {
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

    const oldImageFullPath = getFullImageUrl(req, toEdit.img);

    if (oldImageFullPath)
      if (imagePath !== oldImageFullPath) {
        // if no image path provided or new image path does not match with old image path
        const oldImagePath = path.join(process.cwd(), toEdit.img);
        if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath); // delete old image
      }

    // if new image was not provided return old (or null)
    const img = req.file ? getShortFilePath(req) : imagePath;

    const parsedAbilities = JSON.parse(abilities);
    const parsedTraits = JSON.parse(traits);

    Object.assign(toEdit, {
      name,
      role,
      backstory,
      abilities: parsedAbilities,
      traits: parsedTraits,
      img: img,
    });
    await toEdit.save();

    res.status(201).json({
      success: true,
      character: {
        ...toEdit.dataValues,
        img: getFullImageUrl(req, toEdit.img),
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
    if (toDelete.img !== null) {
      const imagePath = path.join(process.cwd(), toDelete.img);

      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await toDelete.destroy();

    res
      .status(201)
      .json({ success: true, message: "the character has been deleted" });
  } catch (error) {
    handleErrorResponse(res, error);
  }
};

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

    await CharacterModel.destroy({ where: { gdd_id: req.params.id } });

    const folderToCheck = getFullFilePath(req.params.id, "character");

    //delete 'character' folder
    if (fs.existsSync(folderToCheck)) {
      fs.rmSync(folderToCheck, { recursive: true, force: true });
    }

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
        if (character.img !== null) {
          character.img = getFullImageUrl(req, character.img);
        }
        return {
          ...character.dataValues,
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
        img: getFullImageUrl(req, character.img),
      },
    });
  } catch (error) {
    handleErrorResponse(res, error);
  }
};

import { v4 as uuidv4 } from "uuid";
import { CustomRequest } from "../types/types";
import { Response } from "express";
import GDDModel from "../models/gddModel";
import CharacterModel from "../models/characterModel";
import {
  getFullFilePath,
  getFullImageUrl,
  getShortFilePath,
} from "../utils/fileHandlers";

import { handleErrorResponse } from "../utils/handleErrorResponse";
import sequelize from "../config/sequelize";
import LocationModel from "../models/locationModel";
import LocationsCharactersModel from "../models/locationsUsersModel";
import fs from "fs";
import path from "path";
import { addCharactersToLocation } from "../utils/locationUtils";

export const createLocation = async (req: CustomRequest, res: Response) => {
  const { gdd_id, name, description, environment, characters } = req.body;

  const transaction = await sequelize.transaction();
  try {
    let img: string | null = null;

    //if file was attached then get his shorten path to save in db
    if (req.file) {
      img = getShortFilePath(req);
    }

    const newLocation = await LocationModel.create(
      {
        id: uuidv4(),
        name: name,
        description: description,
        environment: environment,
        img: img,
        gdd_id: gdd_id,
      },
      { transaction }
    );

    //if request has at least one character id
    const newCharactersResult = await addCharactersToLocation(
      newLocation.id,
      JSON.parse(characters),
      transaction
    );

    if (newCharactersResult.success === false) {
      await transaction.rollback();
      res
        .status(404)
        .json({ success: false, message: newCharactersResult.message });

      return;
    }

    await transaction.commit();

    res.status(201).json({
      success: true,
      message: "location has been created successfully",
      newLocation: {
        ...newLocation.dataValues,
        img: getFullImageUrl(req, newLocation.img),
        characters: newCharactersResult.characterIds,
      },
    });
  } catch (error) {
    await transaction.rollback();
    console.log(error);
    handleErrorResponse(res, error);
  }
};

export const updateLocation = async (req: CustomRequest, res: Response) => {
  const { id, gdd_id, name, description, environment, characters } = req.body;
  const transaction = await sequelize.transaction();

  try {
    const [isValidGDD, toEdit] = await Promise.all([
      GDDModel.findByPk(gdd_id),
      LocationModel.findByPk(id),
    ]);

    if (!isValidGDD) {
      await transaction.rollback();
      res.status(404).json({ success: false, message: "GDD not found." });
      return;
    }

    if (!toEdit) {
      await transaction.rollback();
      res.status(404).json({ success: false, message: "Location not found." });
      return;
    }

    // if record had previous image then delete it
    if (toEdit.img) {
      const oldImagePath = path.join(process.cwd(), toEdit.img);
      if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
    }

    const img = req.file ? getShortFilePath(req) : null;

    const newCharactersResult = await addCharactersToLocation(
      id,
      JSON.parse(characters),
      transaction
    );

    if (newCharactersResult.success === false) {
      await transaction.rollback();
      res
        .status(404)
        .json({ success: false, message: newCharactersResult.message });

      return;
    }

    toEdit.name = name;
    toEdit.description = description;
    toEdit.environment = environment;

    // Обновляем поля локации
    await toEdit.update(
      { name, description, environment, img },
      { transaction }
    );

    transaction.commit();

    res.status(201).json({
      success: true,
      location: {
        ...toEdit.dataValues,
        img: getFullImageUrl(req, img),
        characters: newCharactersResult.characterIds,
      },
    });
  } catch (error) {
    handleErrorResponse(res, error);
  }
};

export const getLocation = async (req: CustomRequest, res: Response) => {
  const { id } = req.params;
  try {
    const location = await LocationModel.findByPk(id);

    if (!location) {
      res
        .status(403)
        .json({ success: false, characters: "no location with this id" });
      return;
    }

    const locationCharacters = await LocationsCharactersModel.findAll({
      where: { location_id: id },
      attributes: ["character_id"],
      // include: {
      //   model: CharacterModel,
      //   attributes: ["name", "role", "img"],
      // },
    });

    res.status(201).json({
      success: true,
      character: {
        ...location.dataValues,
        img: getFullImageUrl(req, location.img),
        characters: locationCharacters.map((ch) => ch.character_id),
      },
    });
  } catch (error) {
    handleErrorResponse(res, error);
  }
};

export const getAllLocations = async (req: CustomRequest, res: Response) => {
  const { id } = req.params;
  try {
    const locations = await LocationModel.findAll({ where: { gdd_id: id } });

    // getting characters for each location
    const locationsWithCharacters = await Promise.all(
      locations.map(async (location) => {
        const locationCharacters = await LocationsCharactersModel.findAll({
          where: { location_id: location.id },
          attributes: ["character_id"],
        });

        // creating an array of character id strings
        const characterIds = locationCharacters.map(
          (item) => item.character_id
        );

        return {
          ...location.dataValues,
          characters: characterIds,
        };
      })
    );

    res.status(200).json({
      success: true,
      locations: locationsWithCharacters,
    });
  } catch (error) {
    handleErrorResponse(res, error);
  }
};

export const deleteLocation = async (req: CustomRequest, res: Response) => {
  try {
    const toDelete = await LocationModel.findByPk(req.params.id);

    if (!toDelete) {
      res.status(403).json({
        success: false,
        message: "no location has been found",
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

export const deleteAllLocations = async (req: CustomRequest, res: Response) => {
  try {
    const toDelete = await LocationModel.findAll({
      where: { gdd_id: req.params.id },
    });

    if (toDelete.length === 0) {
      res.status(403).json({ success: true, message: "no locations found" });
      return;
    }

    await LocationModel.destroy({ where: { gdd_id: req.params.id } });

    const folderToCheck = getFullFilePath(req.params.id, "location");
    console.log(folderToCheck);

    //delete 'location' folder
    if (fs.existsSync(folderToCheck)) {
      fs.rmSync(folderToCheck, { recursive: true, force: true });
    }

    res.status(201).json({ success: true });
  } catch (error) {
    handleErrorResponse(res, error);
  }
};

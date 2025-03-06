import { v4 as uuidv4 } from "uuid";
import GDDModel from "../models/gddModel";
import { CustomRequest } from "../types/types";
import { Response } from "express";
import UserModel from "../models/userModel";
import { Op } from "sequelize";
import sequelize from "../config/sequelize";
import GameplayModel from "../models/gameplayModel";
import path from "path";
import fs from "fs";
import LocationModel from "../models/locationModel";
import CharacterModel from "../models/characterModel";
import { deleteFile } from "../utils/fileHandlers";

export const createGDD = async (req: CustomRequest, res: Response) => {
  const { title, genre, view, platform } = req.body;

  const transaction = await sequelize.transaction();
  try {
    const existingName = await GDDModel.findOne({ where: { title: title } });
    const existingUser = await UserModel.findOne({
      where: { id: req.user?.id },
    });

    if (!existingUser) {
      res.status(403).json({
        success: "false",
        message: "no user found",
      });
      return;
    }

    if (existingName) {
      res.status(401).json({
        success: "false",
        message: "document with this aname already exists",
      });
      return;
    }

    const newGDD = await GDDModel.create(
      {
        id: uuidv4(),
        title: title,
        genre: genre,
        view: view,
        platform: platform,
        user_id: req.user?.id,
      },
      { transaction }
    );

    const newGameplay = await GameplayModel.create(
      {
        id: uuidv4(),
        gdd_id: newGDD.id,
        story: "",
        difficulty: "",
        pacing: "",
        player_experience: "",
        objectives: [],
        progressions: [],
      },
      { transaction }
    );

    await transaction.commit();

    res.status(201).json({ success: true, gdd: newGDD });
  } catch (error) {
    await transaction.rollback();
    res
      .status(500)
      .json({ success: false, message: "something went wrong", error: error });
  }
};

export const editGDD = async (req: CustomRequest, res: Response) => {
  const { id, title, genre, view, platform } = req.body;

  try {
    const gddToEdit = await GDDModel.findOne({
      where: { id: id, user_id: req.user?.id },
    });

    if (!gddToEdit) {
      res
        .status(403)
        .json({ success: false, message: "gdd with this id does not exists" });
      return;
    }

    const existingName = await GDDModel.findOne({
      where: {
        title: title,
        id: { [Op.not]: id },
      },
    });

    if (existingName) {
      res.status(401).json({
        success: "false",
        message: "document with this aname already exists",
      });
      return;
    }

    gddToEdit.title = title;
    gddToEdit.genre = genre;
    gddToEdit.view = view;
    gddToEdit.platform = platform;
    await gddToEdit.save();

    res.status(201).json({ success: true, gdd: gddToEdit });
  } catch (error) {}
};

export const getGDDById = async (req: CustomRequest, res: Response) => {
  const { id } = req.params; // Получаем ID из параметра URL
  try {
    const gdd = await GDDModel.findOne({
      where: { id: id, user_id: req.user?.id },
    });
    if (!gdd) {
      res.status(404).json({ message: "GDD not found" });
      return;
    }
    res.status(201).json({ success: true, gdd });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
};

export const getAllGDD = async (req: CustomRequest, res: Response) => {
  try {
    const gdd = await GDDModel.findAll({
      where: { user_id: req.user?.id },
    });
    if (!gdd) {
      res.status(404).json({ success: false, message: "GDD not found" });
      return;
    }
    res.status(201).json({ success: true, gdd });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
};

export const deleteGDD = async (req: CustomRequest, res: Response) => {
  const { id } = req.params; // Получаем ID из параметра URL
  try {
    const gdd = await GDDModel.findOne({
      where: { id: id, user_id: req.user?.id },
    });
    if (!gdd) {
      res.status(404).json({ success: false, message: "GDD not found" });
      return;
    }

    const allLocations = await LocationModel.findAll({ where: { gdd_id: id } });
    const allCharacters = await CharacterModel.findAll({
      where: { gdd_id: id },
    });

    for (const location of allLocations) {
      await deleteFile(location.img);
    }

    for (const character of allCharacters) {
      await deleteFile(character.img);
    }

    await gdd.destroy();

    res.status(201).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
};

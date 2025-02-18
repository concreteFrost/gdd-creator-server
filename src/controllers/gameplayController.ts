import { v4 as uuidv4 } from "uuid";
import GameplayModel, { GameplayStructure } from "../models/gameplayModel";
import { CustomRequest } from "../types/types";
import { Response } from "express";
import GDDModel from "../models/gddModel";

export const editGameplay = async (req: CustomRequest, res: Response) => {
  const {
    story,
    difficulty,
    objectives,
    progressions,
    pacing,
    player_experience,
    gdd_id,
  } = req.body;

  try {
    const isGddValid = await GDDModel.findOne({ where: { id: gdd_id } });

    if (!isGddValid) {
      res.status(403).json({
        success: "false",
        message: "gdd not found",
      });
      return;
    }

    const gameplayToEdit = await GameplayModel.findOne({
      where: { gdd_id: gdd_id },
    });

    if (!gameplayToEdit) {
      res.status(403).json({
        success: "false",
        message: "gameplay not found",
      });
      return;
    }

    gameplayToEdit.story = story;
    gameplayToEdit.difficulty = difficulty;
    gameplayToEdit.pacing = pacing;
    gameplayToEdit.player_experience = player_experience;
    gameplayToEdit.objectives = objectives;
    gameplayToEdit.progressions = progressions;

    await gameplayToEdit.save();

    res.status(201).json({
      success: true,
      gameplay: gameplayToEdit,
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
};

export const getGameplay = async (req: CustomRequest, res: Response) => {
  const { id } = req.params;

  try {
    const gameplay = await GameplayModel.findOne({ where: { gdd_id: id } });

    if (!gameplay) {
      res.status(403).json({ success: false, message: "gameplay not exists" });
      return;
    }

    res.status(201).json({ success: true, gameplay });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
};

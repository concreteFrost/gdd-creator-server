import { v4 as uuidv4 } from "uuid";
import GameplayModel, { GameplayStructure } from "../models/gameplayModel";
import { CustomRequest } from "../types/types";
import { Response } from "express";
import GDDModel from "../models/gddModel";

// export const createGameplay = async (req: CustomRequest, res: Response) => {
//   const { gdd_id } = req.body;

//   try {
//     // Проверка, существует ли GDD
//     const isGddValid = await GDDModel.findOne({ where: { id: gdd_id } });

//     if (!isGddValid) {
//       res.status(403).json({
//         success: "false",
//         message: "GDD not found. Cannot save gameplay.",
//       });
//       return;
//     }

//     // Проверка, существует ли уже gameplay с этим gdd_id
//     const existingGameplay = await GameplayModel.findOne({
//       where: { gdd_id: gdd_id },
//     });

//     if (existingGameplay) {
//       res.status(400).json({
//         success: "false",
//         message: "A gameplay already exists for this GDD.",
//       });
//       return;
//     }

//     // Данные для создания или обновления Gameplay
//     const gameplayData: Omit<GameplayStructure, "created_at"> = {
//       id: uuidv4(), // Можно генерировать новый ID для нового Gameplay, если хотите
//       story: "",
//       difficulty: "",
//       pacing: "",
//       player_experience: "",
//       objectives: [],
//       progressions: [],
//       gdd_id: gdd_id,
//     };

//     await GameplayModel.create(gameplayData);
//     // Возвращаем ответ с результатом
//     res.status(200).json({
//       success: true,
//       gameplay: gameplayData,
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Something went wrong", error });
//   }
// };

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

    res.status(200).json({
      success: true,
      gameplayToEdit,
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

    res.status(200).json({ success: true, gameplay });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
};

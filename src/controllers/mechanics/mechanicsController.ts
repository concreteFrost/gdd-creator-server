import { Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { CustomRequest } from "../../types/types";
import GDDModel from "../../models/gddModel";
import MechanicModel, {
  MechanicStructure,
} from "../../models/mechanics/mechanicModel";

export const createMechanic = async (req: CustomRequest, res: Response) => {
  const { gdd_id, name, type_id, description, examples } = req.body;

  try {
    const isGddValid = await GDDModel.findOne({ where: { id: gdd_id } });

    if (!isGddValid) {
      res.status(403).json({
        success: false,
        message: "GDD not found. Cannot save gameplay.",
      });
      return;
    }

    const newMechanic: Omit<MechanicStructure, "created_at"> = {
      id: uuidv4(),
      name: name,
      gdd_id: gdd_id,
      type_id: type_id,
      description: description,
      examples: examples,
    };

    const mechanic = await MechanicModel.create(newMechanic);

    res.status(201).json({
      success: true,
      mechanic,
      examples: examples,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
};

export const updateMechanic = async (req: CustomRequest, res: Response) => {
  const { id, name, gdd_id, type_id, description, examples } = req.body;

  try {
    const isGddValid = await GDDModel.findOne({ where: { id: gdd_id } });

    if (!isGddValid) {
      res.status(403).json({
        success: "false",
        message: "GDD not found. Cannot save gameplay.",
      });
      return;
    }

    const mechanicToEdit = await MechanicModel.findByPk(id);

    if (!mechanicToEdit) {
      res.status(403).json({
        success: "false",
        message: "Mechanic does not exists",
      });
      return;
    }

    mechanicToEdit.name = name;
    mechanicToEdit.type_id = type_id;
    mechanicToEdit.description = description;
    mechanicToEdit.examples = examples;

    await mechanicToEdit.save();

    res.status(201).json({
      success: true,
      mechanic: mechanicToEdit,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
};

export const deleteMechanic = async (req: CustomRequest, res: Response) => {
  const { id } = req.params;
  try {
    const toDelete = await MechanicModel.findByPk(id);

    if (!toDelete) {
      res.status(403).json({
        success: false,
        message: "no mechanic with the id provided was found",
      });
      return;
    }

    await toDelete.destroy();

    res.status(201).json({ success: true });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
};

export const getMechanic = async (req: CustomRequest, res: Response) => {
  const { id } = req.params;
  try {
    const mechanic = await MechanicModel.findByPk(id);

    if (!mechanic) {
      res.status(403).json({ success: false, message: "mechanic not found" });
      return;
    }

    res.status(201).json({ success: true, mechanic });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
};

export const getAllMechanicByGDD = async (
  req: CustomRequest,
  res: Response
) => {
  const { id } = req.params;
  try {
    const mechanics = await MechanicModel.findAll({ where: { gdd_id: id } });

    res.status(201).json({ success: true, mechanics });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
};

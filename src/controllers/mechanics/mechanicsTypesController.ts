import { Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { CustomRequest } from "../../types/types";
import GDDModel from "../../models/gddModel";
import MechanicTypeModel, {
  MechanicTypeStructure,
} from "../../models/mechanics/mechanicTypeModel";

export const createType = async (req: CustomRequest, res: Response) => {
  const { gdd_id, type } = req.body;
  try {
    const isGddValid = await GDDModel.findOne({ where: { id: gdd_id } });

    if (!isGddValid) {
      res.status(403).json({
        success: "false",
        message: "GDD not found. Cannot save gameplay.",
      });
      return;
    }

    const mecanicTypeToAdd: Omit<MechanicTypeStructure, "created_at"> = {
      id: uuidv4(),
      type: type,
      gdd_id: gdd_id,
    };

    const newType = await MechanicTypeModel.create(mecanicTypeToAdd);

    res.status(200).json({ success: true, newType });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
};

export const updateType = async (req: CustomRequest, res: Response) => {
  const { gdd_id, id, type } = req.body;

  try {
    const isGddValid = await GDDModel.findOne({ where: { id: gdd_id } });

    if (!isGddValid) {
      res.status(403).json({
        success: "false",
        message: "GDD not found. Cannot save gameplay.",
      });
      return;
    }

    const typeToEdit = await MechanicTypeModel.findByPk(id);

    if (!typeToEdit) {
      res.status(403).json({
        success: "false",
        message: "Mechanic type does not exists",
      });
      return;
    }

    typeToEdit.type = type;

    await typeToEdit.save();

    res.status(200).json({ success: true, typeToEdit });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
};

export const deleteType = async (req: CustomRequest, res: Response) => {
  const { id } = req.params;
  try {
    const toDelete = await MechanicTypeModel.findByPk(id);

    if (!toDelete) {
      res.status(403).json({
        success: "false",
        message: "no mechanictype  with the id provided was found",
      });
      return;
    }

    await toDelete.destroy();

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
};

export const getType = async (req: CustomRequest, res: Response) => {
  const { id } = req.params;
  try {
    const type = await MechanicTypeModel.findByPk(id);

    if (!type) {
      res.status(403).json({
        success: "false",
        message: "no mechanictype  with the id provided was found",
      });
      return;
    }

    res.status(200).json({ success: true, type });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
};

export const getAllTypes = async (req: CustomRequest, res: Response) => {
  const { id } = req.params;
  console.log(id);
  try {
    const allTypes = await MechanicTypeModel.findAll({
      where: { gdd_id: id },
    });

    res.status(200).json({ success: true, mechanics: allTypes });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
};

import multer from "multer";
import path from "path";
import fs from "fs";
import { getFullFilePath } from "../utils/fileHandlers";

const storage = multer.diskStorage({
  destination(req, file, callback) {
    const uploadPath = getFullFilePath(req.body.gdd_id, file.fieldname);

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    callback(null, uploadPath);
  },
  filename(req, file, callback) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    callback(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

const types = ["image/jpeg", "image/png", "image/webp", "image/jpg"];

export const fileFilter = (req, file: Express.Multer.File, callback) => {
  if (!types.includes(file.mimetype)) {
    return callback(new Error("wrong file format"), false);
  }

  return callback(null, true);
};

const MAX_SIZE = 8 * 1024 * 1024;

export const upload = multer({
  storage,
  limits: { fieldSize: MAX_SIZE },
  fileFilter,
});

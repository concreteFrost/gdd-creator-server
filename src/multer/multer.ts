import multer from "multer";
import path from "path";
import { S3Client } from "@aws-sdk/client-s3";
import multerS3 from "multer-s3";
import { s3, getS3FilePath } from "../s3/s3";

// Настройка Multer для S3 без использования ACL
const storage = multerS3({
  s3: s3,
  bucket: process.env.BUCKET_NAME,
  metadata: (req, file, cb) => {
    cb(null, { fieldName: file.fieldname });
  },
  key: (req, file, cb) => {
    const s3Path = getS3FilePath(
      req.body.gdd_id,
      file.fieldname,
      file.originalname
    );
    cb(null, s3Path);
  },
  // Убираем параметр ACL
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

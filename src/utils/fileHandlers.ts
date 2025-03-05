import path from "path";
import { CustomRequest } from "../types/types";
import fs from "fs";
import { CustomeFile } from "../types/types";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../multer/multer";
import CharacterModel from "../models/characterModel";
import LocationModel from "../models/locationModel";

export enum FolderType {
  character = "character",
  location = "location",
}

export function getFullImageUrl(imagePath: string | null): string | null {
  if (!imagePath) return null;

  const bucketName = process.env.BUCKET_NAME;
  const region = process.env.BUCKET_REGION;

  // Проверка на наличие необходимых переменных окружения
  if (!bucketName || !region) {
    console.error("Missing AWS bucket name or region in environment variables");
    return null;
  }

  // Формируем полный URL
  return `https://${bucketName}.s3.${region}.amazonaws.com/${imagePath}`;
}

//to get short relative path to save in DB
export function getShortFilePath(req: CustomRequest): string {
  return `/uploads/${req.file.destination}/${req.file.filename}`.replace(
    /\\/g,
    "/"
  );
}

//get full file path to save in correct directory
export function getFullFilePath(gdd_id: string, fieldname: string) {
  const rootPath = process.cwd(); // root

  const uploads = "uploads";

  const gddId = gdd_id || "default"; // Префикс папки

  const uploadType = fieldname; // Тип загрузки (locations, characters)

  return path.join(rootPath, uploads, gddId, uploadType).replace(/\\/g, "/"); // example f:/server/uploads/12345/character/
}

export function handleCheckFolderFilesCount(
  gdd_id: string,
  folderType: FolderType
) {
  const folderToCheck = path.join(
    process.cwd(),
    "uploads",
    gdd_id,
    folderType.toString()
  );

  const files = fs.readdirSync(folderToCheck);

  if (files.length === 0) {
    fs.rmdirSync(folderToCheck);
  }
}

export async function handleFileOverwrite(
  req: CustomRequest,
  existingImage: string
): Promise<string | null> {
  let img: string | null = null;

  // Если новое изображение прикреплено, получаем путь S3
  if (req.file) {
    const customFile = req.file as CustomeFile;
    img = customFile.key; // req.file.key хранит путь файла в S3
  }

  const oldImagePath = req.body.imagePath; // Новый путь, переданный с формы

  // Если `imagePath` отсутствует, значит, пользователь удалил изображение
  if (!oldImagePath && existingImage) {
    await deleteFile(existingImage);
    return null;
  }

  // Если пользователь загрузил новое изображение, удаляем старое
  if (img && img !== existingImage) {
    if (existingImage) await deleteFile(existingImage);
  }

  return img ?? existingImage; // Если изображение не менялось, оставляем старый путь
}
async function deleteFile(img: string) {
  if (!img) return;

  const deleteParams = {
    Bucket: process.env.BUCKET_NAME,
    Key: img, // Старая картинка
  };
  const deleteCommand = new DeleteObjectCommand(deleteParams);
  await s3.send(deleteCommand);
}

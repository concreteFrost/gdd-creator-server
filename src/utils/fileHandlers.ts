import path from "path";
import { CustomRequest } from "../types/types";
import fs from "fs";

export enum FolderType {
  character = "character",
  location = "location",
}

//for getting images path
export function getFullImageUrl(
  req: CustomRequest,
  imagePath: string | null
): string | null {
  if (!imagePath) return null;

  const baseUrl = `${req.protocol}://${req.get("host")}`; // Получаем `http://localhost:3000`
  return new URL(imagePath, baseUrl).href; // Собираем полный URL
}

//to get short relative path to save in DB
export function getShortFilePath(req: CustomRequest): string {
  const relativePath = path.relative("uploads", req.file.destination);
  return `/uploads/${relativePath}/${req.file.filename}`.replace(/\\/g, "/");
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

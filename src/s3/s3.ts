import { S3Client } from "@aws-sdk/client-s3";
import path from "path";

export const s3 = new S3Client({
  region: process.env.BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.BUCKET_ACCESS_KEY,
    secretAccessKey: process.env.BUCKET_SECRET_KEY,
  },
});

/**
 *
 * @param {string}  fieldname - form type {character,location}
 * @param {string}  originalname - original file name
 *
 */

export const getS3FilePath = (gdd_id, fieldname, originalname) => {
  const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
  const ext = path.extname(originalname);
  return `uploads/${gdd_id}/${fieldname}/${uniqueSuffix}${ext}`;
};

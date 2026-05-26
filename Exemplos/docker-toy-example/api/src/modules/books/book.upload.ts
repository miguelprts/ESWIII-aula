// Editar `api/src/modules/book.upload.ts`

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { NextFunction, Request, Response } from "express";
import multer from "multer";
import { env } from "../../config/env";

const allowedMimeTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const allowedExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);

const storage = multer.diskStorage({
  destination: (_request, _file, callback) => {
    fs.mkdirSync(env.storageUploadDir, { recursive: true });
    callback(null, env.storageUploadDir);
  },
  filename: (_request, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    callback(null, `${crypto.randomUUID()}${extension}`);
  },
});

export const uploadBookImage = multer({
  storage,
  fileFilter: (_request, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();

    if (!allowedMimeTypes.has(file.mimetype) || !allowedExtensions.has(extension)) {
      callback(new Error("File image must be jpg, jpeg, png, webp or gif."));
      return;
    }

    callback(null, true);
  },
});

export const handleBookImageUploadError = (
  error: Error,
  _request: Request,
  response: Response,
  _next: NextFunction,
): void => {
  if (error instanceof multer.MulterError && error.code === "LIMIT_UNEXPECTED_FILE") {
    response.status(400).json({
      message: "Unexpected file field. Use a single file field named image.",
    });
    return;
  }

  response.status(400).json({ message: error.message });
};

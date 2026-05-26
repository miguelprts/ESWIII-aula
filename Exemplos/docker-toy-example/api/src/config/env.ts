import dotenv from "dotenv";

dotenv.config({ path: ".env.dev" });

const requiredEnv = (name: string): string => {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
};

export const env = {
  port: Number(process.env.PORT ?? 3000),
  frontendUrl: process.env.FRONTEND_URL ?? "http://localhost:5173",
  mongodbUri: requiredEnv("MONGODB_URI"),
  storageUploadDir: process.env.STORAGE_UPLOAD_DIR ?? "uploads",
  storagePublicUrl: process.env.STORAGE_PUBLIC_URL ?? "http://localhost:8080/uploads",
};

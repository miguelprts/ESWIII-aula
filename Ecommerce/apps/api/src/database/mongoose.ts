import mongoose from "mongoose";

let connectionPromise: Promise<typeof mongoose> | null = null;

function getMongoUri(): string {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("Variavel de ambiente MONGODB_URI nao foi definida");
  }

  return uri;
}

function getMongoDatabase(): string {
  return process.env.MONGODB_DATABASE || "ecommerce_dev";
}

export async function connectDatabase(): Promise<typeof mongoose> {
  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }

  if (connectionPromise) {
    return connectionPromise;
  }

  connectionPromise = mongoose
    .connect(getMongoUri(), {
      dbName: getMongoDatabase(),
    })
    .catch((error: unknown) => {
      connectionPromise = null;
      throw error;
    });

  return connectionPromise;
}

export async function disconnectDatabase(): Promise<void> {
  connectionPromise = null;

  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
}

export function getDatabaseName(): string {
  return getMongoDatabase();
}

import cors from "cors";
import express from "express";
import { env } from "./config/env";
import { bookRoutes } from "./modules/books/book.routes";

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: env.frontendUrl,
  }),
);

app.get("/health", (_request, response) => {
  response.status(200).json({ status: "ok" });
});

app.use("/books", bookRoutes);

export { app };
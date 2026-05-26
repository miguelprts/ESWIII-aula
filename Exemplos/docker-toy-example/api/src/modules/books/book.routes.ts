import { Router } from "express";
import { getBooks, postBook } from "./book.controller";
import { handleBookImageUploadError, uploadBookImage } from "./book.upload";

const bookRoutes = Router();

bookRoutes.get("/", getBooks);
bookRoutes.post(
  "/",
  uploadBookImage.single("image"),
  handleBookImageUploadError,
  postBook,
);

export { bookRoutes };

import { Request, Response } from "express";
import { createBook, listBooks } from "./book.service";

type CreateBookBody = {
  title: string;
  authors: string[];
  year: number;
  imageUrl: string;
};

type UnknownCreateBookBody = Partial<Record<keyof CreateBookBody, unknown>>;

const validateCreateBookBody = (body: UnknownCreateBookBody): string | null => {
  if (typeof body.title !== "string" || body.title.trim().length === 0) {
    return "Field title is required and must be a non-empty string.";
  }

  if (
    !Array.isArray(body.authors) ||
    body.authors.length === 0 ||
    !body.authors.every(
      (author) => typeof author === "string" && author.trim().length > 0,
    )
  ) {
    return "Field authors is required and must be a non-empty array of strings.";
  }

  if (typeof body.year !== "number" || !Number.isInteger(body.year)) {
    return "Field year is required and must be an integer.";
  }

  if (typeof body.imageUrl !== "string" || body.imageUrl.trim().length === 0) {
    return "Field imageUrl is required and must be a non-empty string.";
  }

  return null;
};

export const getBooks = async (
  _request: Request,
  response: Response,
): Promise<void> => {
  try {
    const books = await listBooks();
    response.status(200).json(books);
  } catch (error) {
    console.error("Could not list books:", error);
    response.status(500).json({ message: "Could not list books." });
  }
};

export const postBook = async (
  request: Request<unknown, unknown, UnknownCreateBookBody>,
  response: Response,
): Promise<void> => {
  const validationError = validateCreateBookBody(request.body);

  if (validationError) {
    response.status(400).json({ message: validationError });
    return;
  }

  const body = request.body as CreateBookBody;

  try {
    const book = await createBook({
      title: body.title.trim(),
      authors: body.authors.map((author) => author.trim()),
      year: body.year,
      imageUrl: body.imageUrl.trim(),
    });

    response.status(201).json(book);
  } catch (error) {
    console.error("Could not create book:", error);
    response.status(500).json({ message: "Could not create book." });
  }
};
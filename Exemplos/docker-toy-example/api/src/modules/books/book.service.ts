import { Book, BookModel } from "./book.model";

type CreateBookInput = Pick<Book, "title" | "authors" | "year" | "imageUrl">;

export const listBooks = async (): Promise<Book[]> => {
  return BookModel.find().sort({ createdAt: -1 });
};

export const createBook = async (book: CreateBookInput): Promise<Book> => {
  return BookModel.create(book);
};
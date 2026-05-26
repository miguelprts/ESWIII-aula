import { Schema, model } from "mongoose";

export interface Book {
  title: string;
  authors: string[];
  year: number;
  imageUrl: string;
}

const bookSchema = new Schema<Book>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    authors: {
      type: [String],
      required: true,
      validate: {
        validator: (authors: string[]) => authors.length > 0,
        message: "Book must have at least one author.",
      },
    },
    year: {
      type: Number,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

export const BookModel = model<Book>("Book", bookSchema);

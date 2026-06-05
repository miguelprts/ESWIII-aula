import { HydratedDocument, Model, Schema, model, models } from "mongoose";
import { Categoria } from "../../model/categoria";

export type CategoriaDocument = Categoria;

const categoriaSchema = new Schema<CategoriaDocument>(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
      index: true,
    },
    categoria: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
  },
  {
    collection: "categorias",
    id: false,
    timestamps: true,
    versionKey: false,
  },
);

export const CategoriaMongooseModel: Model<CategoriaDocument> =
  (models.Categoria as Model<CategoriaDocument> | undefined) ??
  model<CategoriaDocument>("Categoria", categoriaSchema);

export type CategoriaHydratedDocument = HydratedDocument<CategoriaDocument>;

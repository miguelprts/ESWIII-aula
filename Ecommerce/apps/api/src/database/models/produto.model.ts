import { HydratedDocument, Model, Schema, model, models } from "mongoose";
import { Produto } from "../../model/produto";

export type ProdutoDocument = Produto;

const produtoSchema = new Schema<ProdutoDocument>(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
      index: true,
    },
    nome: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    preco: {
      type: Number,
      required: true,
      min: 0,
    },
    estoque: {
      type: Number,
      required: true,
      min: 0,
      index: true,
    },
    categoria: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    destaque: {
      type: Boolean,
      default: false,
      index: true,
    },
    promocao: {
      type: Boolean,
      default: false,
      index: true,
    },
    novidade: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    collection: "produtos",
    id: false,
    timestamps: true,
    versionKey: false,
  },
);

export const ProdutoMongooseModel: Model<ProdutoDocument> =
  (models.Produto as Model<ProdutoDocument> | undefined) ??
  model<ProdutoDocument>("Produto", produtoSchema);

export type ProdutoHydratedDocument = HydratedDocument<ProdutoDocument>;

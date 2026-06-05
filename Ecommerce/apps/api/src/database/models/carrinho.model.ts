import { HydratedDocument, Model, Schema, model, models } from "mongoose";
import { Carrinho, ItemCarrinho } from "../../model/carrinho";

export type CarrinhoDocument = Carrinho;

const itemCarrinhoSchema = new Schema<ItemCarrinho>(
  {
    id: {
      type: Number,
      required: true,
    },
    nome: {
      type: String,
      required: true,
      trim: true,
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
    },
    categoria: {
      type: String,
      required: true,
      trim: true,
    },
    destaque: {
      type: Boolean,
      default: false,
    },
    promocao: {
      type: Boolean,
      default: false,
    },
    novidade: {
      type: Boolean,
      default: false,
    },
    quantidade: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  {
    _id: false,
    id: false,
  },
);

const carrinhoSchema = new Schema<CarrinhoDocument>(
  {
    itens: {
      type: [itemCarrinhoSchema],
      required: true,
      default: [],
    },
  },
  {
    collection: "carrinhos",
    id: false,
    timestamps: true,
    versionKey: false,
  },
);

export const CarrinhoMongooseModel: Model<CarrinhoDocument> =
  (models.Carrinho as Model<CarrinhoDocument> | undefined) ??
  model<CarrinhoDocument>("Carrinho", carrinhoSchema);

export type CarrinhoHydratedDocument = HydratedDocument<CarrinhoDocument>;

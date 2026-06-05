import { HydratedDocument, Model, Schema, model, models } from "mongoose";
import { Usuario } from "../../model/usuario";

export type UsuarioDocument = Usuario;

const usuarioSchema = new Schema<UsuarioDocument>(
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
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
  },
  {
    collection: "usuarios",
    id: false,
    timestamps: true,
    versionKey: false,
  },
);

export const UsuarioMongooseModel: Model<UsuarioDocument> =
  (models.Usuario as Model<UsuarioDocument> | undefined) ??
  model<UsuarioDocument>("Usuario", usuarioSchema);

export type UsuarioHydratedDocument = HydratedDocument<UsuarioDocument>;

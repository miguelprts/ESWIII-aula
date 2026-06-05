import {
  UsuarioDocument,
  UsuarioHydratedDocument,
  UsuarioMongooseModel,
} from "../database/models/usuario.model";
import { Usuario } from "../model/usuario";

export interface UsuarioRepository {
  list(): Promise<Usuario[]>;
  findById(id: number): Promise<Usuario | undefined>;
  replaceAll(usuarios: Usuario[]): Promise<void>;
  clear(): Promise<void>;
}

function toDomain(document: UsuarioHydratedDocument): Usuario {
  const usuario = document.toObject();

  return {
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
  };
}

function toPersistence(usuario: Usuario): UsuarioDocument {
  return {
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
  };
}

export class MongooseUsuarioRepository implements UsuarioRepository {
  async list(): Promise<Usuario[]> {
    const usuarios = await UsuarioMongooseModel.find({}).sort({ id: 1 }).exec();

    return usuarios.map(toDomain);
  }

  async findById(id: number): Promise<Usuario | undefined> {
    const usuario = await UsuarioMongooseModel.findOne({ id }).exec();
    return usuario ? toDomain(usuario) : undefined;
  }

  async replaceAll(usuarios: Usuario[]): Promise<void> {
    await UsuarioMongooseModel.deleteMany({}).exec();

    if (usuarios.length > 0) {
      await UsuarioMongooseModel.insertMany(usuarios.map(toPersistence));
    }
  }

  async clear(): Promise<void> {
    await UsuarioMongooseModel.deleteMany({}).exec();
  }
}

export const usuarioRepository: UsuarioRepository =
  new MongooseUsuarioRepository();

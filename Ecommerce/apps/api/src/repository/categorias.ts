import {
  CategoriaDocument,
  CategoriaHydratedDocument,
  CategoriaMongooseModel,
} from "../database/models/categoria.model";
import { Categoria } from "../model/categoria";

export interface CategoriaRepository {
  list(): Promise<Categoria[]>;
  replaceAll(categorias: Categoria[]): Promise<void>;
  clear(): Promise<void>;
}

function toDomain(document: CategoriaHydratedDocument): Categoria {
  const categoria = document.toObject();

  return {
    id: categoria.id,
    categoria: categoria.categoria,
  };
}

function toPersistence(categoria: Categoria): CategoriaDocument {
  return {
    id: categoria.id,
    categoria: categoria.categoria,
  };
}

export class MongooseCategoriaRepository implements CategoriaRepository {
  async list(): Promise<Categoria[]> {
    const categorias = await CategoriaMongooseModel.find({})
      .sort({ id: 1 })
      .exec();

    return categorias.map(toDomain);
  }

  async replaceAll(categorias: Categoria[]): Promise<void> {
    await CategoriaMongooseModel.deleteMany({}).exec();

    if (categorias.length > 0) {
      await CategoriaMongooseModel.insertMany(categorias.map(toPersistence));
    }
  }

  async clear(): Promise<void> {
    await CategoriaMongooseModel.deleteMany({}).exec();
  }
}

export const categoriaRepository: CategoriaRepository =
  new MongooseCategoriaRepository();

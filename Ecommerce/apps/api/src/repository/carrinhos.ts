import {
  CarrinhoDocument,
  CarrinhoHydratedDocument,
  CarrinhoMongooseModel,
} from "../database/models/carrinho.model";
import { Carrinho } from "../model/carrinho";

export interface CarrinhoRepository {
  list(): Promise<Carrinho[]>;
  replaceAll(carrinhos: Carrinho[]): Promise<void>;
  clear(): Promise<void>;
}

function toDomain(document: CarrinhoHydratedDocument): Carrinho {
  const carrinho = document.toObject();

  return {
    itens: carrinho.itens.map((item) => ({
      id: item.id,
      nome: item.nome,
      preco: item.preco,
      estoque: item.estoque,
      categoria: item.categoria,
      destaque: item.destaque ?? false,
      promocao: item.promocao ?? false,
      novidade: item.novidade ?? false,
      quantidade: item.quantidade,
    })),
  };
}

function toPersistence(carrinho: Carrinho): CarrinhoDocument {
  return {
    itens: carrinho.itens.map((item) => ({
      id: item.id,
      nome: item.nome,
      preco: item.preco,
      estoque: item.estoque,
      categoria: item.categoria,
      destaque: item.destaque ?? false,
      promocao: item.promocao ?? false,
      novidade: item.novidade ?? false,
      quantidade: item.quantidade,
    })),
  };
}

export class MongooseCarrinhoRepository implements CarrinhoRepository {
  async list(): Promise<Carrinho[]> {
    const carrinhos = await CarrinhoMongooseModel.find({}).exec();
    return carrinhos.map(toDomain);
  }

  async replaceAll(carrinhos: Carrinho[]): Promise<void> {
    await CarrinhoMongooseModel.deleteMany({}).exec();

    if (carrinhos.length > 0) {
      await CarrinhoMongooseModel.insertMany(carrinhos.map(toPersistence));
    }
  }

  async clear(): Promise<void> {
    await CarrinhoMongooseModel.deleteMany({}).exec();
  }
}

export const carrinhoRepository: CarrinhoRepository =
  new MongooseCarrinhoRepository();

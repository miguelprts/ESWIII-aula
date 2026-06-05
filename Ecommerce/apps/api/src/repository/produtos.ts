import {
  ProdutoDocument,
  ProdutoHydratedDocument,
  ProdutoMongooseModel,
} from "../database/models/produto.model";
import { Produto } from "../model/produto";

export type ProdutoFilters = {
  categoria?: string;
  nome?: string;
  disponivel?: boolean;
  destaque?: boolean;
  promocao?: boolean;
  novidade?: boolean;
};

export interface ProdutoRepository {
  list(filters?: ProdutoFilters): Promise<Produto[]>;
  findById(id: number): Promise<Produto | undefined>;
  replaceAll(produtos: Produto[]): Promise<void>;
  clear(): Promise<void>;
}

function toDomain(document: ProdutoHydratedDocument): Produto {
  const produto = document.toObject();

  return {
    id: produto.id,
    nome: produto.nome,
    preco: produto.preco,
    estoque: produto.estoque,
    categoria: produto.categoria,
    destaque: produto.destaque ?? false,
    promocao: produto.promocao ?? false,
    novidade: produto.novidade ?? false,
  };
}

function toPersistence(produto: Produto): ProdutoDocument {
  return {
    id: produto.id,
    nome: produto.nome,
    preco: produto.preco,
    estoque: produto.estoque,
    categoria: produto.categoria,
    destaque: produto.destaque ?? false,
    promocao: produto.promocao ?? false,
    novidade: produto.novidade ?? false,
  };
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export class MongooseProdutoRepository implements ProdutoRepository {
  async list(filters: ProdutoFilters = {}): Promise<Produto[]> {
    const query: Record<string, unknown> = {};

    if (filters.categoria) {
      query.categoria = new RegExp(`^${escapeRegExp(filters.categoria)}$`, "i");
    }

    if (filters.nome) {
      query.nome = new RegExp(escapeRegExp(filters.nome), "i");
    }

    if (filters.disponivel) {
      query.estoque = { $gt: 0 };
    }

    if (filters.destaque !== undefined) {
      query.destaque = filters.destaque;
    }

    if (filters.promocao !== undefined) {
      query.promocao = filters.promocao;
    }

    if (filters.novidade !== undefined) {
      query.novidade = filters.novidade;
    }

    const produtos = await ProdutoMongooseModel.find(query)
      .sort({ id: 1 })
      .exec();

    return produtos.map(toDomain);
  }

  async findById(id: number): Promise<Produto | undefined> {
    const produto = await ProdutoMongooseModel.findOne({ id }).exec();
    return produto ? toDomain(produto) : undefined;
  }

  async replaceAll(produtos: Produto[]): Promise<void> {
    await ProdutoMongooseModel.deleteMany({}).exec();

    if (produtos.length > 0) {
      await ProdutoMongooseModel.insertMany(produtos.map(toPersistence));
    }
  }

  async clear(): Promise<void> {
    await ProdutoMongooseModel.deleteMany({}).exec();
  }
}

export const produtoRepository: ProdutoRepository =
  new MongooseProdutoRepository();

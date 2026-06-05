import { Request, Response } from "express";
import {
  ProdutoFilters,
  ProdutoRepository,
  produtoRepository,
} from "../repository/produtos";

export class ProdutoController {
  constructor(
    private readonly repository: ProdutoRepository = produtoRepository,
  ) {}

  // GET /produtos?categoria=...&nome=...&disponivel=...
  async index(req: Request, res: Response): Promise<void> {
    const { categoria, nome, disponivel } = req.query;

    const filters: ProdutoFilters = {};

    if (categoria) {
      filters.categoria = String(categoria);
    }

    if (nome) {
      filters.nome = String(nome);
    }

    if (disponivel === "true") {
      filters.disponivel = true;
    }

    const produtos = await this.repository.list(filters);

    res.status(200).json(produtos);
  }

  // GET /produtos/:id
  async show(req: Request, res: Response): Promise<void> {
    const id = Number(req.params.id);

    const produto = await this.repository.findById(id);

    if (!produto) {
      res.status(404).json({ message: "Produto não encontrado" });
      return;
    }

    res.status(200).json(produto);
  }

  // GET /produtos/destaques
  async destaques(req: Request, res: Response): Promise<void> {
    const produtosEmDestaque = await this.repository.list({ destaque: true });

    res.status(200).json(produtosEmDestaque);
  }

  // GET /produtos/novidades
  async novidades(req: Request, res: Response): Promise<void> {
    const produtosEmNovidades = await this.repository.list({ novidade: true });

    res.status(200).json(produtosEmNovidades);
  }

  async promocoes(req: Request, res: Response): Promise<void> {
    const produtosEmPromocoes = await this.repository.list({ promocao: true });

    res.status(200).json(produtosEmPromocoes);
  }

  // GET /categorias
  async categorias(req: Request, res: Response): Promise<void> {
    const produtos = await this.repository.list();

    const categorias = [
      ...new Set(produtos.map((produto) => produto.categoria)),
    ];

    res.status(200).json(categorias);
  }
}

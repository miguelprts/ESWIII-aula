import { Request, Response } from "express";
import {
    CategoriaRepository,
    categoriaRepository,
} from "../repository/categorias";

export class CategoriaController {
    constructor(
        private readonly repository: CategoriaRepository = categoriaRepository,
    ) {}

    // GET /categorias
    async index(req: Request, res: Response): Promise<void> {
        const categorias = await this.repository.list();
        res.status(200).json(categorias);
    }
}

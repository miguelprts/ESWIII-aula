import { Request, Response } from "express";
import {
  UsuarioRepository,
  usuarioRepository,
} from "../repository/usuarios";

export class UsuarioController {
  constructor(
    private readonly repository: UsuarioRepository = usuarioRepository,
  ) {}

  // GET /usuarios
  async index(req: Request, res: Response): Promise<void> {
    const usuarios = await this.repository.list();

    res.status(200).json(usuarios);
  }

  // GET /usuarios/:id
  async show(req: Request, res: Response): Promise<void> {
    const id = Number(req.params.id);
    const usuario = await this.repository.findById(id);

    if (!usuario) {
      res.status(404).json({ message: "Usuário não encontrado" });
      return;
    }

    res.status(200).json(usuario);
  }
}

import { Request, Response } from "express";
import { getUsuarioById, getUsuarios } from "../data/usuario.memory";

export class UsuarioController {
  // GET /usuarios
  index(req: Request, res: Response) {
    const usuarios = getUsuarios();

    return res.status(200).json(usuarios);
  }

  // GET /usuarios/:id
  show(req: Request, res: Response) {
    const id = Number(req.params.id);
    const usuario = getUsuarioById(id);

    if (!usuario) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    return res.status(200).json(usuario);
  }
}
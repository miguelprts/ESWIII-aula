import { Router } from "express";
import { UsuarioController } from "../controller/usuarios";

const router = Router();
const usuarioController = new UsuarioController();

router.get("/usuarios", (req, res) => usuarioController.index(req, res));
router.get("/usuarios/:id", (req, res) => usuarioController.show(req, res));

export default router;

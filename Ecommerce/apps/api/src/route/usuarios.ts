import { Router } from "express";
import { UsuarioController } from "../controller/usuarios";

const router = Router();
const usuarioController = new UsuarioController();

router.get("/usuarios", (req, res, next) => {
  usuarioController.index(req, res).catch(next);
});
router.get("/usuarios/:id", (req, res, next) => {
  usuarioController.show(req, res).catch(next);
});

export default router;

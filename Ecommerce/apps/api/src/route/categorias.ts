import { Router } from "express";
import { CategoriaController } from "../controller/categorias";

const router = Router();
const categoriaController = new CategoriaController();

router.get("/categorias", (req, res, next) => {
  categoriaController.index(req, res).catch(next);
});

export default router;

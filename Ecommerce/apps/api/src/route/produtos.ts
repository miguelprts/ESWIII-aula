import { Router } from "express";
import { ProdutoController } from "../controller/produtos";

const router = Router();
const produtoController = new ProdutoController();

router.get("/produtos", (req, res, next) => {
  produtoController.index(req, res).catch(next);
});
router.get("/produtos/destaques", (req, res, next) => {
  produtoController.destaques(req, res).catch(next);
});
router.get("/produtos/novidades", (req, res, next) => {
  produtoController.novidades(req, res).catch(next);
});
router.get("/produtos/promocoes", (req, res, next) => {
  produtoController.promocoes(req, res).catch(next);
});
router.get("/produtos/categorias", (req, res, next) => {
  produtoController.categorias(req, res).catch(next);
});
router.get("/produtos/:id", (req, res, next) => {
  produtoController.show(req, res).catch(next);
});

export default router;

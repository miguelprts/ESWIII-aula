import { Given } from "@cucumber/cucumber";
import {
  categoriasIniciais,
  produtosIniciais,
} from "../../../src/database/seeds/dados-iniciais";
import { categoriaRepository } from "../../../src/repository/categorias";
import { produtoRepository } from "../../../src/repository/produtos";

Given("existem os seguintes produtos cadastrados", async function () {
  await produtoRepository.replaceAll(produtosIniciais);
  await categoriaRepository.replaceAll(categoriasIniciais);
});

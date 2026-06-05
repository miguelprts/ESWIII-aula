import {
  AfterAll,
  Before,
  BeforeAll,
  setDefaultTimeout,
} from "@cucumber/cucumber";
import {
  connectDatabase,
  disconnectDatabase,
} from "../../../src/database/mongoose";
import { carrinhoRepository } from "../../../src/repository/carrinhos";
import { categoriaRepository } from "../../../src/repository/categorias";
import { produtoRepository } from "../../../src/repository/produtos";
import { usuarioRepository } from "../../../src/repository/usuarios";

setDefaultTimeout(15000);

BeforeAll(async function () {
  process.env.MONGODB_URI =
    process.env.MONGODB_TEST_URI ||
    "mongodb://127.0.0.1:27277";
  process.env.MONGODB_DATABASE =
    process.env.MONGODB_TEST_DATABASE || "ecommerce_test";

  await connectDatabase();
});

Before(async function () {
  await produtoRepository.clear();
  await categoriaRepository.clear();
  await usuarioRepository.clear();
  await carrinhoRepository.clear();
});

AfterAll(async function () {
  await disconnectDatabase();
});

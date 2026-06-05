import dotenv from "dotenv";
import { connectDatabase, disconnectDatabase } from "./mongoose";
import { syncDatabaseIndexes } from "./migrate";
import {
  carrinhosIniciais,
  categoriasIniciais,
  produtosIniciais,
  usuariosIniciais,
} from "./seeds/dados-iniciais";
import { carrinhoRepository } from "../repository/carrinhos";
import { categoriaRepository } from "../repository/categorias";
import { produtoRepository } from "../repository/produtos";
import { usuarioRepository } from "../repository/usuarios";

dotenv.config({ path: ".env.dev", quiet: true });
dotenv.config({ quiet: true });

export async function seedDatabase(): Promise<void> {
  await syncDatabaseIndexes();
  await produtoRepository.replaceAll(produtosIniciais);
  await categoriaRepository.replaceAll(categoriasIniciais);
  await usuarioRepository.replaceAll(usuariosIniciais);
  await carrinhoRepository.replaceAll(carrinhosIniciais);
}

if (require.main === module) {
  connectDatabase()
    .then(seedDatabase)
    .then(() => {
      console.log("Dados iniciais inseridos no MongoDB");
    })
    .catch((error: unknown) => {
      console.error("Erro ao inserir dados iniciais no MongoDB", error);
      process.exitCode = 1;
    })
    .finally(() => {
      disconnectDatabase().catch((error: unknown) => {
        console.error("Erro ao fechar conexao com MongoDB", error);
        process.exitCode = 1;
      });
    });
}

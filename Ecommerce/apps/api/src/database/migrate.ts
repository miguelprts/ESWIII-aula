import dotenv from "dotenv";
import { connectDatabase, disconnectDatabase } from "./mongoose";
import {
  CarrinhoMongooseModel,
  CategoriaMongooseModel,
  ProdutoMongooseModel,
  UsuarioMongooseModel,
} from "./models";

dotenv.config({ path: ".env.dev", quiet: true });
dotenv.config({ quiet: true });

export async function syncDatabaseIndexes(): Promise<void> {
  await ProdutoMongooseModel.syncIndexes();
  await CategoriaMongooseModel.syncIndexes();
  await UsuarioMongooseModel.syncIndexes();
  await CarrinhoMongooseModel.syncIndexes();
}

if (require.main === module) {
  connectDatabase()
    .then(syncDatabaseIndexes)
    .then(() => {
      console.log("Indices do MongoDB sincronizados");
    })
    .catch((error: unknown) => {
      console.error("Erro ao sincronizar indices do MongoDB", error);
      process.exitCode = 1;
    })
    .finally(() => {
      disconnectDatabase().catch((error: unknown) => {
        console.error("Erro ao fechar conexao com MongoDB", error);
        process.exitCode = 1;
      });
    });
}

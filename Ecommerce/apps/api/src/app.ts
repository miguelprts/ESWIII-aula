import express, { Request, Response } from "express";

// Importando as rotas dos produtos
import listarprodutos from "./route/produtos";
import destaquesprodutos from "./route/produtos";
import novidadesprodutos from "./route/produtos";
import promocoesprodutos from "./route/produtos";
import detalhesproduto from "./route/produtos";

// Importando a rota de categorias de produtos
import cateogoriasprodutos from "./route/categorias";

// Importar a roda de usuários
import usuarios from "./route/usuarios";

const app = express();

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Hello World" });
});

// Configurando as rotas dos produtos
app.use(listarprodutos);
app.use(destaquesprodutos);
app.use(novidadesprodutos);
app.use(promocoesprodutos);
app.use(detalhesproduto);

// Configurando a rota de categorias de produtos
app.use(cateogoriasprodutos);

// Configurando a rota de usuários
app.use(usuarios);

export default app;

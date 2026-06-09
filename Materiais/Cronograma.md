<!-- ltex: language=pt-BR -->

# Cronograma

## Semana 1 (3/3/2026): Apresentação do programa analítico da disciplina

Apresentar aos estudantes o programa analítico da disciplina, explicitando objetivos, conteúdos, metodologia, critérios de avaliação e expectativas de desempenho ao longo do semestre.

## Semana 2 (10/3/2026): Introdução ao desenvolvimento ágil de software

Compreender os fundamentos do desenvolvimento ágil de software, com ênfase no Manifesto Ágil e nas práticas do Extreme Programming (XP), aplicando esses conceitos na definição inicial de histórias de usuário e na estimativa de esforço para o projeto de e-commerce da disciplina.

## Semana 3 (17/3/2026): Scrum e Kanban

Compreender os fundamentos de Scrum e Kanban como métodos ágeis para gerenciamento e organização do trabalho em projetos de software, aplicando esses conceitos em uma atividade prática de simulação do desenvolvimento de funcionalidades para o projeto de e-commerce da disciplina.

## Semana 4 (24/3/2026): BDD

**Estrutura de pastas**

- apps/
  - api (backend Node/Nest/Express)
  - web (frontend React/Next)
- docs/ (documentação, evidências, etc.)
- infra/ (docker-compose, scripts, etc.)

**Criar .gitignore**

- Criar pelo site https://www.toptal.com/developers/gitignore
- Criar por meio de plugin do VSCode: https://marketplace.visualstudio.com/items?itemName=piotrpalarz.vscode-gitignore-generator

**Criação de Repositório**

- Criação de conta no GitHub
- [Configuração do github na máquina](https://www.webdevdrops.com/en/git-no-windows-github)
  - [Para múltiplas contas](https://docs.google.com/presentation/d/1dP0ShOLKSDLRdYLy3qi099rHpvZcbhBHvjhr-8q_BOE/edit?usp=sharing)
- Criação do repositório do projeto. Sugestão de nome: `appecommerce`

**Preparação da base do projeto**

- Preparação da base da api

```bash
# Ir para a raiz do repositório (monorepo)
cd <PASTA_RAIZ_DO_SEU_REPO>

# Criar a pasta do backend
mkdir -p apps/api
cd apps/api

# Inicializar o projeto Node
npm init -y

# Instalar dependências de produção
npm i express cors dotenv

# Instalar dependências de desenvolvimento (TypeScript + types + dev server)
npm i -D typescript ts-node-dev ts-node @types/node @types/express @types/cors

# Inicializar o TypeScript (gera tsconfig.json)
npx tsc --init

# Criar pasta src
mkdir src

# Criar estrutura mínima de pastas e arquivos
touch src/app.ts src/server.ts

# Criar arquivos de ambiente (exemplo + local)
touch .env
```

- Configurar arquivo `tsconfig.ts`

  - abrir arquivo
  - Descomentar linhas 5 e 6
    ```TypeScript
    "rootDir": "./src",
    "outDir": "./dist",
    ```
  - substituir `"verbatimModuleSyntax": true,` por `"verbatimModuleSyntax": false,`
- Editar `./src/app.ts`

```typescript
import express, { Request, Response } from "express";

const app = express();

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Hello World" });
});

export default app;
```

- Editar `server.ts`

```typescript
import app from "./app";
import dotenv from "dotenv";

dotenv.config();

const PORT: number = Number(process.env.PORT) || 3001;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
```

- Editar `package.json`

```json
  "scripts": {
    "dev": "ts-node-dev --respawn --transpile-only src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js"
  },
```

- Verificar se está tudo ok

```bash
npm run dev
```

**Commit**

```bash
#  Primeiro commit (se o repo já estiver configurado)
git add .
git commit -m "chore(api): base do projeto"
```

## Semana 5 (31/3/2026)

## [Behavior-Driven Development (BDD)](./BDD.md)

## Semana 6 (7/4/2026): BDD

**Preparação do BDD**

- Instalar pacotes

```bash
npm i -D @cucumber/cucumber supertest @types/supertest chai @types/chai
```

- Configurar pastas

```bash
mkdir -p features
mkdir -p features/step-definitions
```

- Editar `package.json`

```json
"scripts": {
  "bdd": "cucumber-js --require-module ts-node/register --require features/step-definitions/**/*.ts features/**/*.feature"
}
```

**Testando o BDD**

- Editar o arquivo `features/hello.feature`

```text
Feature: Hello API

  Scenario: Acessar endpoint raiz
    When eu envio uma requisição GET para "/"
    Then o status da resposta deve der 200
```

- Editar o arquivo `features/step-definitions/hello.steps.ts`

```typescript
import { When, Then } from "@cucumber/cucumber";
import request from "supertest";
import { expect } from "chai";

import app from "../../src/app";

let response: request.Response;

When(
  "eu envio uma requisição GET para {string}",
  async function (endpoint: string) {
    response = await request(app).get(endpoint);
  },
);

Then("o status da resposta deve ser {int}", function (statusCode: number) {
  expect(response.status).to.equal(statusCode);
});
```

- Executar `npm run bdd`

## [Principais códigos de status HTTP](./StatusHTTP.md)

**Exercício**: crie um cenário em `hello.feature` para tratar acesso a endpoints que não existem.

**Resposta** (com o cenário _Acessar endpoint inexistente_ é o mesmo do existente, a implementação é mantida):

```typescript
import { When, Then } from "@cucumber/cucumber";
import { expect } from "chai";
import request from "supertest";
import app from "../../src/app";

let response: request.Response;

// Scenarios:
// Acessar endpoint raiz
// Acessar endpoint inexistente
When(
  "eu envio uma requisição GET para {string}",
  async function (endpoint: string) {
    // objeto de resposta da requisição GET
    response = await request(app).get(endpoint);
  },
);

Then("o status da resposta deve ser {int}", function (status: number) {
  expect(response.status).to.equal(status);
});
```

**Commit**

```bash
chore(bdd): setup inicial do BDD
```

**Criação dos principais cenários**

- Possíveis features
  - catálogo de produtos
  - carrinho de compras
  - checkout
  - conta e autenticação
  - pagamento
  - pedido
  - cupons e descontos
  - regras de negócios críticas

**Criar cenários para _Catálogo de produtos_**

- Editar o arquivo `api/features/catalogo.feature`

```gherkin
Feature: Catálogo de produtos
    Como visitante do e-commerce
    Quero visualizar e consultar os produtos
    Para decidir o que comprar

    Scenario: Visualizar lista de produtos
        When eu envio uma requisição GET "/produtos" para listar os produtos
        Then os produtos são listados e o status da resposta deve ser 200
```

**Implementar GET "/produtos"**

- Editar `.src/controller/produto.ts`

```typescript
import { Request, Response } from "express";

const products = [
  {
    nome: "Camiseta Básica",
    preco: 59,
    estoque: 20,
    categoria: "Camisetas",
  },
  {
    nome: "Calça Jeans Slim",
    preco: 149,
    estoque: 5,
    categoria: "Calças",
  },
];

export class ProductController {
  index(req: Request, res: Response) {
    return res.status(200).json(products);
  }
}
```

- Editar `./src/route/produto.ts`

```typescript
import { Router } from "express";
import { ProductController } from "../controller/produto";

const router = Router();
const productController = new ProductController();

router.get("/produtos", (req, res) => productController.index(req, res));

export default router;
```

- Editar `./src/app.ts`

```typescript
import express, { Request, Response } from "express";
import listarprodutos from "./route/produto";

const app = express();

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Hello World" });
});

app.use(listarprodutos);

export default app;
```

**Implementar GET "/produtos/:id"**

- Editar `.src/features/catalogo.feature`

```gherkin
Scenario: Consultar detalhes de um produto
    Given que existem produtos cadastrados
    When eu envio uma requisição GET "/produtos/1" para consultar os detalhes do produto
    Then os detalhes do produto são retornados e o status da resposta deve ser 200
```

- Editar `src./feratures/step-definitions/catalogo.steps.ts`

```typescript
// Scenario: Consultar detalhes de um produto
// Given que existe um produto com id "1"
Given("que existem produtos cadastrados", function () {
  // Assumimos que há produtos cadastrados no sistema
});

// When eu envio uma requisição GET "/produtos/1" para consultar os detalhes do produto
When(
  "eu envio uma requisição GET {string} para consultar os detalhes do produto",
  async (endpoint: string) => {
    response = await request(app).get(endpoint);
  },
);

// Then os detalhes do produto são retornados e o status da resposta deve ser 200
Then(
  "os detalhes do produto são retornados e o status da resposta deve ser {int}",
  function (status: number) {
    expect(response.status).to.equal(status);
  },
);
```

- Editar `.src/controller/produto.ts`

```typescript
import { Request, Response } from "express";

const products = [
  {
    id: 1,
    // ...
  },
  {
    id: 2,
    // ...
  },
];

export class ProductController {
  // ...

  // Mostrar detalhes de um produto específico
  show(req: Request, res: Response) {
    const id = Number(req.params.id);

    const product = products.find((p) => p.id === id);

    if (!product) {
      return res.status(404).json({ message: "Produto não encontrado" });
    }

    return res.status(200).json(product);
  }
}
```

- Editar `./src/route/produto.ts`

```typescript
// ...
router.get("/produtos/:id", (req, res) => productController.show(req, res));
// ...
```

- Editar `./src/app.ts`

```typescript
// ...
import detalhesproduto from "./route/produto";

// ...

app.use(detalhesproduto);

// ...
```

**Implementar outros cenários**

```gherkin
  Scenario: Tentar visualizar produto inexistente
    When eu envio uma requisição GET para "/produtos/Produto Inexistente"
    Then o status da resposta deve ser 404

  Scenario: Filtrar produtos por categoria
    Given há produtos cadastrados por categoria
    When eu envio uma requisição GET "/produtos?categoria=Camisetas" para obter produtos de uma categoria
    Then os produtos da categoria são mostrados e o status da resposta deve ser 200

  Scenario: Verificar produto sem estoque
    Given há produtos cadastrados
    And estão com o estoque zerado
    When eu envio uma requisição GET "/produtos/id" de um produto com estoque zerado
    Then o produto é exibido e o status da resposta deve ser 200
```

## Semana 7 (14/4/2026): TDD

**[Alunos devem atualizar o repositório para prosseguir](https://github.com/filipefernandesphd/ESWIII/tree/main)**

Testes de software são fundamentais para garantir qualidade, confiabilidade e evolução segura do sistema.

Eles permitem:

- detectar erros cedo
- evitar regressões, ou seja, mudanças não quebram o que já funciona
- facilitar manutenção
- documentar comportamento

Em projetos reais, software sem testes tende a se tornar difícil de manter e arriscado de evoluir.

O **TDD** é uma prática que usa testes como guia para o desenvolvimento.

Ciclo do TDD

`Red -> Green -> Refactor`

- Red: escrever um teste que falha
- Green: implementar o mínimo para passar
- Refactor: melhorar o código mantendo os testes

A pirâmide de testes define como distribuir os tipos de testes em um sistema.

<img src="./Imagens/piramide-testes.png" width="400">

- **Teste de unidade**: testa uma pequena parte isolada do sistema (ex: função ou método), sem dependências externas.
- **Teste de integração**: testa a interação entre componentes do sistema (ex: controller + service + dados).
- **Teste de sistema**: testa o sistema completo do ponto de vista do usuário, validando o **comportamento** real (ex: API via BDD).

---

### Refatorar projeto

**Produto**

- Editar `./app/api/data/produtos.memory.ts`

```ts
// Mudar
export type Produto = {
  id: number;
  nome: string;
  preco: number;
  estoque: number;
  categoria: string;
  destaque?: boolean;
  promocao?: boolean;
  novidade?: boolean;
};

// Para
import { Produto } from "../model/produto";
```

- Editar `./app/api/src/model/produto.ts`

```ts
export type Produto = {
  id: number;
  nome: string;
  preco: number;
  estoque: number;
  categoria: string;
  destaque?: boolean;
  promocao?: boolean;
  novidade?: boolean;
};
```

**Categoria**

- Editar `./app/api/data/categorias.memory.ts`

```ts
// Mudar
export type Categoria = {
  id: number;
  categoria: string;
};

// Para
import { Categoria } from "../model/categoria";
```

- Editar `./app/api/model/categoria.ts`

```ts
export type Categoria = {
  id: number;
  categoria: string;
};
```

### Preparando o ambiente

- Instalar pacote: `npm i -D jest ts-jest @types/jest`
- Editar `apps/api/jest.config.js`

```js
/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: "node",
  roots: ["<rootDir>/src"],
  testMatch: ["**/*.spec.ts"],
  clearMocks: true,
  moduleFileExtensions: ["ts", "js", "json"],
  transform: {
    "^.+\\.ts$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.spec.json",
      },
    ],
  },
};
```

- Editar `apps/api/package.json`

```json
// Linha 11
"test:unit": "jest --runInBand",    // executa os testes de forma sequencial (um por vez)
"test:unit:watch": "jest --watch"   // sempre que salva um arquivo, os testes são executados automaticamente
```

- Editar `apps/api/tsconfig.spec.json`

```js
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "rootDir": ".",
    "types": ["node", "jest"]
  },
  "include": ["src/**/*.ts"]
}
```

- Editar `apps/api/tsconfig.json`

```typescript
// Linha 12
"types": ["node"],

// Linha 43
  },
  "include": ["src/**/*.ts"],
  "exclude": ["src/**/*.spec.ts"]
}
```

### Criar modelo do Carrinho

- Editar `./apps/api/src/model/carrinho.ts`

```ts
import { Produto } from "./produto";

// O ItemCarrinho é uma extensão do Produto, adicionando a quantidade do produto no carrinho
// Ele representa um item específico que o cliente deseja comprar, incluindo a quantidade desejada
// ItemCarrinho é tudo que Produto tem + um novo campo quantidade”
export type ItemCarrinho = Produto & {
  quantidade: number;
};

export type Carrinho = {
  itens: ItemCarrinho[];
};
```

### Escrevendo os testes

- Editar `./apps/api/src/service/carrinho.spec.ts`

```ts
import { CarrinhoService } from "./carrinho";
import { Produto } from "../model/produto";
import { Carrinho } from "../model/carrinho";

describe("CarrinhoService", () => {
  let service: CarrinhoService;

  const produto1: Produto = {
    id: 1,
    nome: "Camiseta Básica",
    preco: 59,
    estoque: 20,
    categoria: "Camisetas",
    destaque: true,
    promocao: false,
    novidade: true,
  };

  const produto2: Produto = {
    id: 2,
    nome: "Calça Jeans Slim",
    preco: 149,
    estoque: 5,
    categoria: "Calças",
    destaque: false,
    promocao: true,
    novidade: false,
  };

  const produto3: Produto = {
    id: 3,
    nome: "Jaqueta de Couro",
    preco: 399,
    estoque: 0,
    categoria: "Jaquetas",
    destaque: true,
    promocao: false,
    novidade: false,
  };

  beforeEach(() => {
    service = new CarrinhoService();
  });

  describe("criar", () => {
    test("deve criar um carrinho vazio", () => {
      const carrinho = service.criar();

      expect(carrinho).toEqual({ itens: [] });
      expect(carrinho.itens).toHaveLength(0);
    });
  });

  describe("adicionarItem", () => {
    test("deve adicionar um novo item ao carrinho", () => {
      const carrinho = service.criar();

      service.adicionarItem(carrinho, produto1, 2);

      expect(carrinho.itens).toHaveLength(1);
      expect(carrinho.itens[0]).toEqual({
        ...produto1,
        quantidade: 2,
      });
    });

    test("deve lançar erro se a quantidade for menor ou igual a zero", () => {
      const carrinho = service.criar();

      expect(() => {
        service.adicionarItem(carrinho, produto1, 0);
      }).toThrow("A quantidade deve ser maior que zero");

      expect(() => {
        service.adicionarItem(carrinho, produto1, -1);
      }).toThrow("A quantidade deve ser maior que zero");
    });

    test("deve somar a quantidade quando o produto já existir no carrinho", () => {
      const carrinho = service.criar();

      service.adicionarItem(carrinho, produto1, 2);
      service.adicionarItem(carrinho, produto1, 3);

      expect(carrinho.itens).toHaveLength(1);
      expect(carrinho.itens[0].quantidade).toBe(5);
    });
  });

  describe("quantidadeDeItens", () => {
    test("deve retornar zero para um carrinho vazio", () => {
      const carrinho = service.criar();

      const total = service.quantidadeDeItens(carrinho);

      expect(total).toBe(0);
    });

    test("deve retornar a soma das quantidades dos itens", () => {
      const carrinho: Carrinho = {
        itens: [
          { ...produto1, quantidade: 2 },
          { ...produto2, quantidade: 3 },
        ],
      };

      const total = service.quantidadeDeItens(carrinho);

      expect(total).toBe(5);
    });
  });

  describe("calcularTotal", () => {
    test("deve retornar zero para um carrinho vazio", () => {
      const carrinho = service.criar();

      const total = service.calcularTotal(carrinho);

      expect(total).toBe(0);
    });

    test("deve calcular o valor total do carrinho", () => {
      const carrinho: Carrinho = {
        itens: [
          { ...produto1, quantidade: 2 }, // 59 * 2 = 118
          { ...produto2, quantidade: 1 }, // 149 * 1 = 149
        ],
      };

      const total = service.calcularTotal(carrinho);

      expect(total).toBe(267);
    });
  });

  describe("cenários integrando múltiplos métodos", () => {
    test("deve criar carrinho, adicionar itens e calcular quantidade total", () => {
      const carrinho = service.criar();

      service.adicionarItem(carrinho, produto1, 2);
      service.adicionarItem(carrinho, produto2, 1);

      const quantidade = service.quantidadeDeItens(carrinho);

      expect(quantidade).toBe(3);
    });

    test("deve criar carrinho, adicionar itens e calcular o total da compra", () => {
      const carrinho = service.criar();

      service.adicionarItem(carrinho, produto1, 2); // 118
      service.adicionarItem(carrinho, produto2, 1); // 149

      const total = service.calcularTotal(carrinho);

      expect(total).toBe(267);
    });

    test("deve acumular quantidade do mesmo produto e refletir nos cálculos", () => {
      const carrinho = service.criar();

      service.adicionarItem(carrinho, produto1, 1);
      service.adicionarItem(carrinho, produto1, 2);

      expect(service.quantidadeDeItens(carrinho)).toBe(3);
      expect(service.calcularTotal(carrinho)).toBe(177); // 59 * 3
    });

    test("deve adicionar três produtos diferentes e calcular quantidade e total corretamente", () => {
      const carrinho = service.criar();

      service.adicionarItem(carrinho, produto1, 1); // 59
      service.adicionarItem(carrinho, produto2, 2); // 298
      service.adicionarItem(carrinho, produto3, 1); // 399

      expect(service.quantidadeDeItens(carrinho)).toBe(4);
      expect(service.calcularTotal(carrinho)).toBe(756);
    });
  });
});
```

- Executar `npm run teset:unit` e o teste deve falhar
- Editar `./apps/api/src/service/carrinho.ts`

```js
import { Carrinho, ItemCarrinho } from "../model/carrinho";
import { Produto } from "../model/produto";

export class CarrinhoService {
  criar(): Carrinho {
    return { itens: [] };
  }

  adicionarItem(
    carrinho: Carrinho,
    produto: Produto,
    quantidade: number,
  ): void {
    if (quantidade <= 0) {
      throw new Error("A quantidade deve ser maior que zero");
    }

    const itemExistente = carrinho.itens.find(
      (item) => item.id === produto.id,
    );

    if (itemExistente) {
      itemExistente.quantidade += quantidade;
      return;
    }

    const novoItem: ItemCarrinho = {
      ...produto,
      quantidade,
    };

    carrinho.itens.push(novoItem);
  }

  quantidadeDeItens(carrinho: Carrinho): number {
    return carrinho.itens.reduce(
      (total, item) => total + item.quantidade,
      0,
    );
  }

  calcularTotal(carrinho: Carrinho): number {
    return carrinho.itens.reduce(
      (total, item) => total + item.preco * item.quantidade,
      0,
    );
  }
}
```

- Executar `npm run teset:unit` e o teste deve passar

### Exercício

Escreva o BDD para o carrinho com a implementação da API.

Considere o arquivo `./apps/api/src/data/carrinho.memory.ts`

```ts
import { Carrinho } from "../model/carrinho";

let carrinhos: Carrinho[] = [
  {
    itens: [
      {
        id: 1,
        nome: "Camiseta Básica",
        preco: 59,
        estoque: 20,
        categoria: "Camisetas",
        destaque: true,
        promocao: false,
        novidade: true,
        quantidade: 2,
      },
      {
        id: 2,
        nome: "Calça Jeans Slim",
        preco: 149,
        estoque: 5,
        categoria: "Calças",
        destaque: false,
        promocao: true,
        novidade: false,
        quantidade: 1,
      },
    ],
  },
  {
    itens: [
      {
        id: 3,
        nome: "Jaqueta de Couro",
        preco: 399,
        estoque: 0,
        categoria: "Jaquetas",
        destaque: true,
        promocao: false,
        novidade: false,
        quantidade: 1,
      },
    ],
  },
];

export function setCarrinhos(newCarrinhos: Carrinho[]): void {
  carrinhos = newCarrinhos;
}

export function getCarrinhos(): Carrinho[] {
  return carrinhos;
}

export function clearCarrinhos(): void {
  carrinhos = [];
}
```

## Semana 8 (28/4/2026) - Introdução à IA para ES (AI4SE)

## Semana 9 (5/5/2026) - AV1

## Semana 10 (12/5/2026) - DevOps: CI/CD

**Criar BDDs de usuários para falharem**

- Criar diretório `./apps/features/usuarios`
- Criar diretório `./apps/features/step-definitions/usuarios`
- Editar arquivo `./apps/src/model/usuario.ts`

```ts
export type Usuario = {
  id: number;
  nome: string;
  email: string;
};
```

- Editar arquivo `./apps/src/data/usuario.memory.ts`

```ts
import { Usuario } from "../model/usuario";

export const usuariosCadastrados: Usuario[] = [
  {
    id: 1,
    nome: "Alice Silva",
    email: "alice.silva@example.com",
  },
  {
    id: 2,
    nome: "Bob Costa",
    email: "bob.costa@example.com",
  },
];

let usuarios: Usuario[] = [...usuariosCadastrados];

export function setUsuarios(newUsuarios: Usuario[]): void {
  usuarios = newUsuarios;
}

export function getUsuarios(): Usuario[] {
  return usuarios;
}

export function getUsuarioById(id: number): Usuario | undefined {
  return usuarios.find((usuario) => usuario.id === id);
}

export function resetUsuarios(): void {
  usuarios = [...usuariosCadastrados];
}

export function clearUsuarios(): void {
  usuarios = [];
}
```

- Editar arquivo `./apps/features/usuarios/listagem.feature`

```gherkin
Feature: Listagem de Usuários

  Como cliente da API do e-commerce
  Quero visualizar os usuários cadastrados
  Para consultar os cadastros disponíveis no sistema

  Scenario: Visualizar lista de usuários cadastrados
    Given existem usuários cadastrados
    When eu envio uma requisição GET de listagem de usuários para "/usuarios"
    Then o status da resposta da listagem de usuários deve ser 200
    And a resposta da listagem de usuários deve conter os usuários cadastrados

  Scenario: Visualizar lista vazia de usuários
    Given não existem usuários cadastrados
    When eu envio uma requisição GET de listagem de usuários para "/usuarios"
    Then o status da resposta da listagem de usuários deve ser 200
    And a resposta da listagem de usuários deve ser uma lista vazia

```

- Editar arquivo `./apps/features/usuarios/detalhes.feature`

```gherkin
Feature: Consulta de Usuário por Id

  Como cliente da API do e-commerce
  Quero consultar um usuário específico pelo identificador
  Para verificar os dados de cadastro

  Scenario: Visualizar detalhes de um usuário existente
    Given existe um usuário cadastrado com id 1
    When eu envio uma requisição GET de detalhe de usuário para "/usuarios/1"
    Then o status da resposta de detalhe de usuário deve ser 200
    And a resposta de detalhe de usuário deve conter os dados do usuário 1

  Scenario: Retornar erro ao buscar usuário inexistente
    Given não existe usuário cadastrado com id 999
    When eu envio uma requisição GET de detalhe de usuário para "/usuarios/999"
    Then o status da resposta de detalhe de usuário deve ser 404
    And a resposta deve informar que o usuário não foi encontrado
```

- Editar arquivo `./apps/features/step-definitions/usuarios/listagem.steps.ts`

```ts
import { Given, Then, When } from "@cucumber/cucumber";
import { expect } from "chai";
import request from "supertest";

import app from "../../../src/app";
import {
  clearUsuarios,
  getUsuarios,
  resetUsuarios,
} from "../../../src/data/usuario.memory";
import { Usuario } from "../../../src/model/usuario";

let response: request.Response;

Given("existem usuários cadastrados", function () {
  resetUsuarios();
});

Given("não existem usuários cadastrados", function () {
  clearUsuarios();
});

When(
  "eu envio uma requisição GET de listagem de usuários para {string}",
  async function (endpoint: string) {
    response = await request(app).get(endpoint);
  },
);

Then(
  "o status da resposta da listagem de usuários deve ser {int}",
  function (statusCode: number) {
    expect(response.status).to.equal(statusCode);
  },
);

Then(
  "a resposta da listagem de usuários deve conter os usuários cadastrados",
  function () {
    expect(response.body).to.be.an("array");

    const usuariosRecebidos = response.body as Usuario[];

    for (const usuarioEsperado of getUsuarios()) {
      const usuarioRecebido = usuariosRecebidos.find(
        (usuario) => usuario.id === usuarioEsperado.id,
      );

      expect(usuarioRecebido).to.include(usuarioEsperado);
    }
  },
);

Then(
  "a resposta da listagem de usuários deve ser uma lista vazia",
  function () {
    expect(response.body).to.deep.equal([]);
  },
);
```

- Editar arquivo `./apps/features/step-definitions/usuarios/detalhes.steps.ts`

```ts
import { Given, Then, When } from "@cucumber/cucumber";
import { expect } from "chai";
import request from "supertest";

import app from "../../../src/app";
import {
  getUsuarioById,
  setUsuarios,
  usuariosCadastrados,
} from "../../../src/data/usuario.memory";

let response: request.Response;

Given("existe um usuário cadastrado com id {int}", function (id: number) {
  const usuario = usuariosCadastrados.find(
    (usuarioCadastrado) => usuarioCadastrado.id === id,
  );

  if (!usuario) {
    throw new Error(`Usuário de teste com id ${id} não foi definido`);
  }

  setUsuarios([usuario]);
});

Given("não existe usuário cadastrado com id {int}", function (id: number) {
  setUsuarios(usuariosCadastrados.filter((usuario) => usuario.id !== id));
});

When(
  "eu envio uma requisição GET de detalhe de usuário para {string}",
  async function (endpoint: string) {
    response = await request(app).get(endpoint);
  },
);

Then(
  "o status da resposta de detalhe de usuário deve ser {int}",
  function (statusCode: number) {
    expect(response.status).to.equal(statusCode);
  },
);

Then(
  "a resposta de detalhe de usuário deve conter os dados do usuário {int}",
  function (id: number) {
    const usuarioEsperado = getUsuarioById(id);

    if (!usuarioEsperado) {
      throw new Error(
        `Usuário esperado com id ${id} não foi definido no Given`,
      );
    }

    expect(response.body).to.include(usuarioEsperado);
  },
);

Then("a resposta deve informar que o usuário não foi encontrado", function () {
  expect(response.body).to.deep.equal({
    message: "Usuário não encontrado",
  });
});
```

- Executar `npm run test:bdd` e os testes irão falhar.

**Preparar ambiente para CI/CD com GitHub**

- Criar os diretórios na raiz do projeto `./github/workflows`
- Editar arquivo `./github/workflows/ci-testes.yml`

```yml
# Nome exibido na aba "Actions" do GitHub
name: CI - Testes da API

# Gatilhos: o workflow roda em pushes e pull requests de qualquer branch
on:
  push:
    branches:
      - "**"
  pull_request:
    branches:
      - "**"

# Como o package.json da API está em Ecommerce/apps/api, os comandos npm devem rodar nesse diretório
defaults:
  run:
    working-directory: Ecommerce/apps/api

# Conjunto de etapas executadas na máquina virtual
jobs:
  # Nome do job apresentado
  tests:
    # O que será mostrado no GitHub Actions
    name: Build e testes automatizados

    # Ambiente virtual usado pelo GitHub Actions
    runs-on: ubuntu-latest

    # Variaveis usadas pelos cenarios BDD para conectar no MongoDB do job
    env:
      MONGODB_TEST_URI: mongodb://127.0.0.1:27017
      MONGODB_TEST_DATABASE: ecommerce_test_ci

    # Banco MongoDB usado pelos testes BDD da API
    services:
      mongodb:
        image: mongo:7
        ports:
          - 27017:27017
        options: >-
          --health-cmd "mongosh --quiet --eval 'db.adminCommand(\"ping\").ok'"
          --health-interval 5s
          --health-timeout 5s
          --health-retries 10
          --health-start-period 10s

    steps:
      # Baixa o código do repositório para dentro da máquina virtual do GitHub Actions
      - name: Baixar código do repositório
        uses: actions/checkout@v4

      # Instala e configura a versão do Node.js usada pela pipeline (o cache do npm acelera execuções futuras reaproveitando dependências já baixadas)
      - name: Configurar Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
          cache-dependency-path: Ecommerce/apps/api/package-lock.json

      # Instala as dependências exatamente como descritas no package-lock.json
      # `npm ci` é recomendado em CI por se rápido, consistente e automatizado
      - name: Instalar dependências
        run: npm ci

      # Compila o projeto TypeScript antes dos testes
      - name: Verificar compilação TypeScript
        run: npm run build

      # Executa os testes unitários da API
      - name: Executar testes unitários
        run: npm run test:unit

      # Executa os testes de aceitação(BDD) da API
      - name: Executar testes BDD
        run: npm run test:bdd
```

- Acesse o repositório remoto (GitHub) e clique na aba `Actions`
- Volte para o projeto, execute os comandos abaixo e retorne para a aba `Actions` do GitHub.

```shell
git add . && git commit -m "ci: workflow do github actions para testes automatizados"
```

**Implementação da feature usuários para que o BDD passe**

- Editar arquivo `./apps/api/src/controller/usuarios.ts`

```ts
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
```

- Editar arquivo `./apps/api/src/route/usuarios.ts`

```ts
import { Router } from "express";
import { UsuarioController } from "../controller/usuarios";

const router = Router();
const usuarioController = new UsuarioController();

router.get("/usuarios", (req, res) => usuarioController.index(req, res));
router.get("/usuarios/:id", (req, res) => usuarioController.show(req, res));

export default router;
```

- Editar arquivo `./apps/api/src/app.ts`

```ts
...
// Importando as rotas dos usuários
import usuarios from "./route/usuarios";
...
// Configurando as rotas dos usuários
app.use(usuarios);
...
```

- Acesse o repositório remoto (GitHub) e clique na aba `Actions`
- Volte para o projeto, execute os comandos abaixo e retorne para a aba `Actions` do GitHub.

```shell
git add . && git commit -m "feat: endpoints para usuarios"
```

## Semana 11 (19/5/2026) - DevOps: Docker

### Iniciando com o Docker

#### Verificar instalação do Docker

Verifica se o Docker está instalado e disponível no terminal.

```bash
docker --version
```

- `docker`: executa o cliente Docker.
- `--version`: mostra a versão instalada do Docker.

Exemplo:

```bash
docker --version
```

---

#### Verificar informações do ambiente Docker

Mostra informações gerais sobre o Docker instalado, incluindo containers, imagens, volumes, redes e configurações do sistema.

```bash
docker info
```

- `docker info`: exibe detalhes completos do ambiente Docker.

Exemplo:

```bash
docker info
```

---

#### Testar funcionamento do Docker

Executa um container de teste para verificar se o Docker está funcionando corretamente.

```bash
docker run [imagem]
```

- `docker run`: cria e executa um novo container.
- `[imagem]`: imagem usada para criar o container.

Exemplo:

```bash
docker run hello-world
```

Se tudo der certo deverá ver a mensagem:

```bash
Hello from Docker!
This message shows that your installation appears to be working correctly.
```

---

#### Buscar imagem no Docker Hub

Pesquisa imagens disponíveis no Docker Hub diretamente pelo terminal.

```bash
docker search [nome-da-imagem]
```

- `docker search`: pesquisa imagens em um registry.
- `[nome-da-imagem]`: nome da imagem que será pesquisada.

Exemplo:

```bash
docker search nginx
```

---

#### Baixar imagem

Baixa uma imagem Docker para a máquina local sem executar um container.

```bash
docker pull [imagem]:[tag]
```

- `docker pull`: baixa uma imagem.
- `[imagem]`: nome da imagem.
- `[tag]`: versão da imagem. Quando omitida, geralmente usa `latest`.

Exemplo:

```bash
docker pull nginx:latest
```

---

#### Listar imagens

Lista as imagens Docker disponíveis localmente na máquina.

```bash
docker images
```

- `docker images`: mostra as imagens baixadas localmente.

Exemplo:

```bash
docker images
```

---

#### Executar container

Executa um novo container a partir de uma imagem Docker.

```bash
docker run [opções] [imagem] [comando]
```

- `docker run`: cria e executa um novo container.
- `[opções]`: define configurações como nome, portas, volumes e modo de execução.
- `[imagem]`: imagem usada para criar o container.
- `[comando]`: comando opcional executado dentro do container.

Exemplo:

```bash
docker run -d --name meu-nginx -p 8080:80 nginx
```

Sendo:

- `-d`: executa o container em segundo plano.
- `--name meu-nginx`: define o nome do container.
- `-p 8080:80`: mapeia a porta `8080` do host para a porta `80` do container.
- `nginx`: imagem usada para criar o container.

---

#### Executar container interativo

Executa um container em modo interativo, permitindo acessar o terminal interno do container.

```bash
docker run -it [imagem] [shell]
```

- `docker run`: cria e executa um novo container.
- `-it`: ativa o modo interativo com terminal.
- `[imagem]`: imagem usada.
- `[shell]`: shell que será aberto dentro do container.

Exemplo:

```bash
docker run -it ubuntu bash
```

Sendo:

- `ubuntu`: imagem usada para criar o container.
- `bash`: shell executado dentro do container.

---

#### Executar container removendo após finalizar

Executa um container temporário e remove automaticamente após sua finalização.

```bash
docker run --rm [imagem] [comando]
```

- `--rm`: remove o container automaticamente após ele parar.
- `[imagem]`: imagem usada.
- `[comando]`: comando opcional executado dentro do container.

Exemplo:

```bash
docker run --rm ubuntu echo "Olá, Docker"
```

---

#### Listar containers em execução

Lista apenas os containers que estão em execução no momento.

```bash
docker ps
```

- `docker ps`: mostra os containers ativos.

Exemplo:

```bash
docker ps
```

---

#### Listar todos os containers

Lista todos os containers, incluindo os que estão parados.

```bash
docker ps -a
```

- `docker ps`: lista containers.
- `-a`: inclui containers parados.

Exemplo:

```bash
docker ps -a
```

---

#### Iniciar container parado

Inicia um container que já existe, mas está parado.

```bash
docker start [container]
```

- `docker start`: inicia um container existente.
- `[container]`: nome ou ID do container.

Exemplo:

```bash
docker start meu-nginx
```

---

#### Parar container

Para um container em execução de forma controlada.

```bash
docker stop [container]
```

- `docker stop`: solicita a parada do container.
- `[container]`: nome ou ID do container.

Exemplo:

```bash
docker stop meu-nginx
```

---

#### Reiniciar container

Reinicia um container em execução ou parado.

```bash
docker restart [container]
```

- `docker restart`: para e inicia novamente o container.
- `[container]`: nome ou ID do container.

Exemplo:

```bash
docker restart meu-nginx
```

---

#### Remover container

Remove um container existente. O container precisa estar parado, a menos que seja usado `-f`.

```bash
docker rm [container]
```

- `docker rm`: remove um container.
- `[container]`: nome ou ID do container.

Exemplo:

```bash
docker rm meu-nginx
```

---

#### Remover container forçadamente

Remove um container mesmo que ele esteja em execução.

```bash
docker rm -f [container]
```

- `docker rm`: remove um container.
- `-f`: força a remoção.
- `[container]`: nome ou ID do container.

Exemplo:

```bash
docker rm -f meu-nginx
```

---

#### Ver logs do container

Mostra os logs gerados por um container.

```bash
docker logs [opções] [container]
```

- `docker logs`: exibe os logs do container.
- `[opções]`: configura a forma de visualização dos logs.
- `[container]`: nome ou ID do container.

Exemplo:

```bash
docker logs -f meu-nginx
```

Sendo:

- `-f`: acompanha os logs em tempo real.

---

#### Inspecionar container

Mostra informações detalhadas de um container, imagem, volume ou rede.

```bash
docker inspect [recurso]
```

- `docker inspect`: exibe informações detalhadas em formato JSON.
- `[recurso]`: nome ou ID do container, imagem, volume ou rede.

Exemplo:

```bash
docker inspect meu-nginx
```

---

#### Executar comando dentro de container

Executa um comando dentro de um container que já está em execução.

```bash
docker exec [opções] [container] [comando]
```

- `docker exec`: executa comando dentro de um container ativo.
- `[opções]`: configura o modo de execução.
- `[container]`: nome ou ID do container.
- `[comando]`: comando que será executado.

Exemplo:

```bash
docker exec -it meu-nginx bash
```

Sendo:

- `-it`: abre o modo interativo com terminal.
- `meu-nginx`: container onde o comando será executado.
- `bash`: shell aberto dentro do container.

---

#### Copiar arquivo para container

Copia arquivos ou diretórios da máquina host para dentro de um container.

```bash
docker cp [origem] [container]:[destino]
```

- `docker cp`: copia arquivos entre host e container.
- `[origem]`: caminho do arquivo ou diretório no host.
- `[container]`: nome ou ID do container.
- `[destino]`: caminho dentro do container.

Exemplo:

```bash
docker cp ./arquivo.txt meu-nginx:/tmp/arquivo.txt
```

---

#### Copiar arquivo do container

Copia arquivos ou diretórios de dentro do container para a máquina host.

```bash
docker cp [container]:[origem] [destino]
```

- `docker cp`: copia arquivos entre container e host.
- `[container]`: nome ou ID do container.
- `[origem]`: caminho dentro do container.
- `[destino]`: caminho na máquina host.

Exemplo:

```bash
docker cp meu-nginx:/tmp/arquivo.txt ./arquivo.txt
```

---

#### Renomear container

Altera o nome de um container existente.

```bash
docker rename [nome-atual] [novo-nome]
```

- `docker rename`: renomeia um container.
- `[nome-atual]`: nome atual do container.
- `[novo-nome]`: novo nome do container.

Exemplo:

```bash
docker rename meu-nginx nginx-web
```

---

#### Atualizar configurações do container

Atualiza algumas configurações de um container existente, como limites de CPU e memória.

```bash
docker update [opções] [container]
```

- `docker update`: altera configurações de um container.
- `[opções]`: novas configurações aplicadas.
- `[container]`: nome ou ID do container.

Exemplo:

```bash
docker update --memory 512m --cpus 1 meu-nginx
```

Sendo:

- `--memory 512m`: limita o container a 512 MB de memória.
- `--cpus 1`: limita o container a 1 CPU.

---

#### Remover imagem

Remove uma imagem Docker da máquina local.

```bash
docker rmi [imagem]
```

- `docker rmi`: remove uma imagem local.
- `[imagem]`: nome ou ID da imagem.

Exemplo:

```bash
docker rmi nginx
```

---

#### Criar imagem a partir de Dockerfile

Constrói uma imagem Docker usando um arquivo `Dockerfile`.

```bash
docker build -t [nome-da-imagem]:[tag] [caminho]
```

- `docker build`: constrói uma imagem.
- `-t`: define nome e tag da imagem.
- `[nome-da-imagem]`: nome da imagem criada.
- `[tag]`: versão ou identificação da imagem.
- `[caminho]`: diretório onde está o `Dockerfile`.

Exemplo:

```bash
docker build -t minha-api:1.0 .
```

Sendo:

- `minha-api:1.0`: nome e versão da imagem.
- `.`: usa o diretório atual como contexto de build.

---

#### Listar volumes

Lista os volumes Docker existentes na máquina.

```bash
docker volume ls
```

- `docker volume`: gerencia volumes.
- `ls`: lista os volumes existentes.

Exemplo:

```bash
docker volume ls
```

---

#### Criar volume

Cria um volume Docker para persistir dados fora do ciclo de vida do container.

```bash
docker volume create [nome-do-volume]
```

- `docker volume create`: cria um novo volume.
- `[nome-do-volume]`: nome do volume.

Exemplo:

```bash
docker volume create mongo_data
```

---

#### Inspecionar volume

Mostra informações detalhadas de um volume Docker.

```bash
docker volume inspect [volume]
```

- `docker volume inspect`: exibe detalhes do volume.
- `[volume]`: nome do volume.

Exemplo:

```bash
docker volume inspect mongo_data
```

---

#### Remover volume

Remove um volume Docker existente.

```bash
docker volume rm [volume]
```

- `docker volume rm`: remove um volume.
- `[volume]`: nome do volume.

Exemplo:

```bash
docker volume rm mongo_data
```

---

#### Listar redes

Lista as redes Docker disponíveis na máquina.

```bash
docker network ls
```

- `docker network`: gerencia redes Docker.
- `ls`: lista redes existentes.

Exemplo:

```bash
docker network ls
```

---

#### Criar rede

Cria uma rede Docker para permitir comunicação entre containers.

```bash
docker network create [nome-da-rede]
```

- `docker network create`: cria uma nova rede.
- `[nome-da-rede]`: nome da rede.

Exemplo:

```bash
docker network create ecommerce-network
```

---

#### Conectar container a uma rede

Conecta um container existente a uma rede Docker.

```bash
docker network connect [rede] [container]
```

- `docker network connect`: conecta um container a uma rede.
- `[rede]`: nome da rede.
- `[container]`: nome ou ID do container.

Exemplo:

```bash
docker network connect ecommerce-network meu-nginx
```

---

#### Desconectar container de uma rede

Remove um container de uma rede Docker.

```bash
docker network disconnect [rede] [container]
```

- `docker network disconnect`: desconecta um container de uma rede.
- `[rede]`: nome da rede.
- `[container]`: nome ou ID do container.

Exemplo:

```bash
docker network disconnect ecommerce-network meu-nginx
```

---

#### Remover rede

Remove uma rede Docker existente.

```bash
docker network rm [rede]
```

- `docker network rm`: remove uma rede.
- `[rede]`: nome ou ID da rede.

Exemplo:

```bash
docker network rm ecommerce-network
```

---

#### Ver uso de recursos dos containers

Mostra o consumo de CPU, memória, rede e I/O dos containers em execução.

```bash
docker stats
```

- `docker stats`: mostra estatísticas de uso de recursos em tempo real.

Exemplo:

```bash
docker stats
```

---

#### Ver processos do container

Mostra os processos que estão sendo executados dentro de um container.

```bash
docker top [container]
```

- `docker top`: lista processos internos do container.
- `[container]`: nome ou ID do container.

Exemplo:

```bash
docker top meu-nginx
```

---

#### Parar todos os containers

Para todos os containers em execução.

```bash
docker stop $(docker ps -q)
```

- `docker stop`: para containers.
- `$(docker ps -q)`: retorna apenas os IDs dos containers em execução.

Exemplo:

```bash
docker stop $(docker ps -q)
```

---

#### Remover todos os containers parados

Remove todos os containers que estão parados.

```bash
docker container prune
```

- `docker container prune`: remove containers parados.

Exemplo:

```bash
docker container prune
```

---

#### Remover imagens não utilizadas

Remove imagens que não estão sendo usadas por containers.

```bash
docker image prune
```

- `docker image prune`: remove imagens não utilizadas.

Exemplo:

```bash
docker image prune
```

---

#### Remover volumes não utilizados

Remove volumes que não estão associados a nenhum container.

```bash
docker volume prune
```

- `docker volume prune`: remove volumes não utilizados.

Exemplo:

```bash
docker volume prune
```

---

#### Remover redes não utilizadas

Remove redes que não estão sendo usadas por containers.

```bash
docker network prune
```

- `docker network prune`: remove redes não utilizadas.

Exemplo:

```bash
docker network prune
```

---

#### Fazer limpeza geral do Docker

Remove containers parados, redes não utilizadas, imagens pendentes e cache de build.

```bash
docker system prune
```

- `docker system prune`: limpa recursos Docker não utilizados.

Exemplo:

```bash
docker system prune
```

---

#### Fazer limpeza geral incluindo volumes

Remove recursos Docker não utilizados, incluindo volumes.

```bash
docker system prune --volumes
```

- `docker system prune`: limpa recursos Docker não utilizados.
- `--volumes`: inclui volumes na limpeza.

Exemplo:

```bash
docker system prune --volumes
```

---

#### Subir serviços com Docker Compose

Cria e executa os serviços definidos em um arquivo `docker-compose.yml` ou `compose.yml`.

```bash
docker compose up [opções]
```

- `docker compose up`: sobe os serviços definidos no Compose.
- `[opções]`: configura a execução dos serviços.

Exemplo:

```bash
docker compose up -d
```

Sendo:

- `-d`: executa os serviços em segundo plano.

---

#### Parar serviços com Docker Compose

Para e remove os containers criados pelo Docker Compose.

```bash
docker compose down
```

- `docker compose down`: para e remove os serviços do Compose.

Exemplo:

```bash
docker compose down
```

---

#### Parar serviços e remover volumes com Docker Compose

Para os serviços do Docker Compose e remove também os volumes associados.

```bash
docker compose down -v
```

- `docker compose down`: para e remove serviços.
- `-v`: remove os volumes criados pelo Compose.

Exemplo:

```bash
docker compose down -v
```

---

#### Listar serviços do Docker Compose

Lista os containers criados e gerenciados pelo Docker Compose.

```bash
docker compose ps
```

- `docker compose ps`: lista os serviços do Compose.

Exemplo:

```bash
docker compose ps
```

---

#### Ver logs com Docker Compose

Mostra os logs dos serviços definidos no Docker Compose.

```bash
docker compose logs [opções] [serviço]
```

- `docker compose logs`: exibe logs dos serviços.
- `[opções]`: configura a visualização dos logs.
- `[serviço]`: serviço específico, quando informado.

Exemplo:

```bash
docker compose logs -f api
```

Sendo:

- `-f`: acompanha os logs em tempo real.
- `api`: nome do serviço no arquivo Compose.

---

#### Executar comando em serviço do Docker Compose

Executa um comando dentro de um serviço gerenciado pelo Docker Compose.

```bash
docker compose exec [serviço] [comando]
```

- `docker compose exec`: executa comando dentro de um serviço ativo.
- `[serviço]`: nome do serviço no Compose.
- `[comando]`: comando executado dentro do container.

Exemplo:

```bash
docker compose exec api npm test
```

---

#### Construir imagens com Docker Compose

Constrói ou reconstrói as imagens dos serviços definidos no Docker Compose.

```bash
docker compose build [serviço]
```

- `docker compose build`: constrói imagens dos serviços.
- `[serviço]`: serviço específico, quando informado.

Exemplo:

```bash
docker compose build api
```

---

#### Recriar serviços com Docker Compose

Recria os serviços após alterações em imagem, Dockerfile ou configuração.

```bash
docker compose up -d --build
```

- `docker compose up`: sobe os serviços.
- `-d`: executa em segundo plano.
- `--build`: reconstrói as imagens antes de subir os serviços.

Exemplo:

```bash
docker compose up -d --build
```

## Semana 12 (26/5/2026) Docker Toy Example

[Uso do Docker em um app simples](/Exemplos/docker-toy-example/)

## Semana 13 (2/6/2026) Docker Toy Example (continuação)

[Uso do Docker em um app simples](/Exemplos/docker-toy-example/)

## Semana 14 (9/6/2026) Deploy

### >>> IMPORTANTE <<<

Para evitar atrasos na aula, as implementações a partir do tópico [Uso do MongoDB no Projeto](uso-do-mongodb-no-projeto) já foram realizadas na branch `main` no commit `feat: initialize web application with React, Vite, and TypeScript` do repositório [https://github.com/filipefernandesphd/ESWIII/](https://github.com/filipefernandesphd/ESWIII/).

Portanto, atualize o repositório local e faça as configurações do **Docker** e das **variáveis de ambiente** abaixo.

### Configuração do Docker no Projeto E-commerce

- Editar o arquivo `/apps/api/.env.dev`

```env
NODE_ENV=development
PORT=3001
PORT_MONGODB=27277
PORT_MONGODB_EXPRESS=8081
MONGODB_URI=mongodb://127.0.0.1:${PORT_MONGODB}
MONGODB_DATABASE=ecommerce_dev
```

- Editar arquivo `/apps/api/Dockerfile`

```yml
# Etapa de build: instala dependencias e transpila o TypeScript.
FROM node:22-alpine AS build

# Define a pasta de trabalho dentro do container.
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# Etapa final: executa somente os arquivos transpilados.
FROM node:22-alpine AS production

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=build /app/dist ./dist

CMD ["node", "dist/server.js"]
```

- Editar o arquivo `apps/web/.env.dev`

```env
PORT=3001
WEB_PORT=3002
VITE_API_URL=http://localhost:${PORT}
```

- Editar o arquivo `apps/web/Dockerfile`

```yml
# Etapa de build: instala dependencias e gera os arquivos estaticos.
FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json vite.config.ts index.html .env.dev ./
COPY src ./src

RUN npm run build

# Etapa final: serve somente os arquivos gerados pelo build.
FROM nginx:1.27-alpine AS production

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
```

- Editar o arquivo `./Ecommerce/.env.dev`

```env
# Variáveis de ambiente para desenvolvimento do backend
PORT=3001
PORT_MONGODB=27277
PORT_MONGODB_EXPRESS=8081
MONGODB_URI=mongodb://127.0.0.1:${PORT_MONGODB}
MONGODB_DATABASE=ecommerce_dev

# Variáveis de ambiente para desenvolvimento do frontend
# PORT=3001 --- IGNORE --- ('PORT' já está definido para o backend)
WEB_PORT=3002
VITE_API_URL=http://localhost:${PORT}
```

- Editar o arquivo `./Ecommerce/docker-compose.yml`

```yml
services:
  # Banco de dados MongoDB para desenvolvimento local.
  mongodb:
    # Usa a imagem oficial do MongoDB.
    image: mongo:7
    container_name: ecommerce_mongodb

    # Permite acessar o MongoDB tambem pelo host, se necessario.
    ports:
      - "${PORT_MONGODB:-27277}:27017"

    # Persiste os dados do MongoDB entre reinicializacoes dos containers.
    volumes:
      - ecommerce_mongodb_data:/data/db

    # Aguarda o MongoDB aceitar conexoes antes dos scripts da API.
    # O comando healthcheck usa mongosh para verificar se o banco esta responsivo.
    # Ou seja, informa ao Docker se o MongoDB está healthy ou não.
    # Na prática, o comando faz um ping no MongoDB. Quando ele passa, o Docker marca o container como saudável.
    # Os tipos de condições que o Docker Compose suporta para controlar a ordem de inicialização dos serviços com base na saúde ou status dos containers são:
    # "service_healthy": garantir que outros serviços só iniciem depois que o MongoDB estiver pronto
    # "service_started": serviço iniciado assim que o container é criado, sem esperar pela saúde
    # "service_completed_successfully": espera o container terminar sua execução com sucesso, mas não é adequada para o MongoDB, que deve permanecer em execução.
    healthcheck:
      test:
        ["CMD", "mongosh", "--quiet", "--eval", "db.adminCommand('ping').ok"]
      interval: 5s
      timeout: 5s
      retries: 10
      start_period: 10s

  # Interface web para visualizar o MongoDB em desenvolvimento.
  mongo-express:
    # Usa a imagem oficial do Mongo Express.
    image: mongo-express:1.0.2-20-alpine3.19
    container_name: ecommerce_mongo_express

    # Disponibiliza a interface web em http://localhost:8081.
    ports:
      - "${PORT_MONGODB_EXPRESS:-8081}:8081"

    # Conecta ao MongoDB pela rede interna do Docker Compose.
    environment:
      ME_CONFIG_MONGODB_URL: mongodb://mongodb:27017
      ME_CONFIG_BASICAUTH: "false"

    # Inicia o MongoDB antes do Mongo Express.
    depends_on:
      mongodb:
        condition: service_healthy

  # Executa migracoes e dados iniciais antes da API subir.
  api-setup:
    build:
      context: ./apps/api
      dockerfile: Dockerfile
      target: build
    container_name: ecommerce_api_setup

    # Dentro do Docker, os scripts acessam o MongoDB pelo nome do servico.
    environment:
      MONGODB_URI: mongodb://mongodb:27017
      MONGODB_DATABASE: ${MONGODB_DATABASE}

    command: sh -c "npm run db:migrate && npm run db:seed"

    depends_on:
      mongodb:
        condition: service_healthy

  # API Node.js/Express em modo de desenvolvimento.
  api:
    # Usa o Dockerfile simples localizado em apps/api.
    build:
      context: ./apps/api
      dockerfile: Dockerfile
    container_name: ecommerce_api

    # Dentro do Docker, a API acessa o MongoDB pelo nome do servico.
    environment:
      MONGODB_URI: mongodb://mongodb:27017

    # Mapeia a porta do host definida no .env para a porta 3001 do container.
    ports:
      - "${PORT:-3001}:3001"

    # Inicia a API depois que o banco foi preparado.
    depends_on:
      mongodb:
        condition: service_healthy
      api-setup:
        condition: service_completed_successfully

  # Frontend React/Vite servido com Nginx em modo de producao.
  web:
    build:
      context: ./apps/web
      dockerfile: Dockerfile
    container_name: ecommerce_web

    # Disponibiliza o frontend em http://localhost:PORT.
    ports:
      - "${WEB_PORT:-3002}:80"

    # Inicia a API antes do frontend.
    depends_on:
      - api

# Volumes gerenciados pelo Docker.
volumes:
  # Dados persistentes do MongoDB.
  ecommerce_mongodb_data:
```

- Executar os comandos para criar os containers, considerando o `.env.dev`

```bash
cd Ecommerce
docker compose --env-file .env.dev up -d --build
```

No comando acima, se colocar `--build` no final, vai atualizar as imagens e depois inicia/criar o container.

- Verificar se está tudo certo

```bash
curl http://localhost:3001/
docker exec -it ecommerce_mongodb mongosh
```

### Uso do MongoDB no Projeto

- Executar `npm i mongoose`

#### Atualizar o BDD usando o MongoDB

**Criar repositorios Mongoose em `Ecommerce/apps/api/src/repository`**

- `repository/carrinhos.ts`

```ts
import {
  CarrinhoDocument,
  CarrinhoHydratedDocument,
  CarrinhoMongooseModel,
} from "../database/models/carrinho.model";
import { Carrinho } from "../model/carrinho";

export interface CarrinhoRepository {
  list(): Promise<Carrinho[]>;
  replaceAll(carrinhos: Carrinho[]): Promise<void>;
  clear(): Promise<void>;
}

function toDomain(document: CarrinhoHydratedDocument): Carrinho {
  const carrinho = document.toObject();

  return {
    itens: carrinho.itens.map((item) => ({
      id: item.id,
      nome: item.nome,
      preco: item.preco,
      estoque: item.estoque,
      categoria: item.categoria,
      destaque: item.destaque ?? false,
      promocao: item.promocao ?? false,
      novidade: item.novidade ?? false,
      quantidade: item.quantidade,
    })),
  };
}

function toPersistence(carrinho: Carrinho): CarrinhoDocument {
  return {
    itens: carrinho.itens.map((item) => ({
      id: item.id,
      nome: item.nome,
      preco: item.preco,
      estoque: item.estoque,
      categoria: item.categoria,
      destaque: item.destaque ?? false,
      promocao: item.promocao ?? false,
      novidade: item.novidade ?? false,
      quantidade: item.quantidade,
    })),
  };
}

export class MongooseCarrinhoRepository implements CarrinhoRepository {
  async list(): Promise<Carrinho[]> {
    const carrinhos = await CarrinhoMongooseModel.find({}).exec();
    return carrinhos.map(toDomain);
  }

  async replaceAll(carrinhos: Carrinho[]): Promise<void> {
    await CarrinhoMongooseModel.deleteMany({}).exec();

    if (carrinhos.length > 0) {
      await CarrinhoMongooseModel.insertMany(carrinhos.map(toPersistence));
    }
  }

  async clear(): Promise<void> {
    await CarrinhoMongooseModel.deleteMany({}).exec();
  }
}

export const carrinhoRepository: CarrinhoRepository =
  new MongooseCarrinhoRepository();
```

- `repository/categorias.ts`

```ts
import {
  CategoriaDocument,
  CategoriaHydratedDocument,
  CategoriaMongooseModel,
} from "../database/models/categoria.model";
import { Categoria } from "../model/categoria";

export interface CategoriaRepository {
  list(): Promise<Categoria[]>;
  replaceAll(categorias: Categoria[]): Promise<void>;
  clear(): Promise<void>;
}

function toDomain(document: CategoriaHydratedDocument): Categoria {
  const categoria = document.toObject();

  return {
    id: categoria.id,
    categoria: categoria.categoria,
  };
}

function toPersistence(categoria: Categoria): CategoriaDocument {
  return {
    id: categoria.id,
    categoria: categoria.categoria,
  };
}

export class MongooseCategoriaRepository implements CategoriaRepository {
  async list(): Promise<Categoria[]> {
    const categorias = await CategoriaMongooseModel.find({})
      .sort({ id: 1 })
      .exec();

    return categorias.map(toDomain);
  }

  async replaceAll(categorias: Categoria[]): Promise<void> {
    await CategoriaMongooseModel.deleteMany({}).exec();

    if (categorias.length > 0) {
      await CategoriaMongooseModel.insertMany(categorias.map(toPersistence));
    }
  }

  async clear(): Promise<void> {
    await CategoriaMongooseModel.deleteMany({}).exec();
  }
}

export const categoriaRepository: CategoriaRepository =
  new MongooseCategoriaRepository();
```

- `repository/index.ts`

```ts
export { carrinhoRepository } from "./carrinhos";
export { categoriaRepository } from "./categorias";
export { produtoRepository } from "./produtos";
export { usuarioRepository } from "./usuarios";
```

- `repository/produtos.ts`

```ts
import {
  ProdutoDocument,
  ProdutoHydratedDocument,
  ProdutoMongooseModel,
} from "../database/models/produto.model";
import { Produto } from "../model/produto";

export type ProdutoFilters = {
  categoria?: string;
  nome?: string;
  disponivel?: boolean;
  destaque?: boolean;
  promocao?: boolean;
  novidade?: boolean;
};

export interface ProdutoRepository {
  list(filters?: ProdutoFilters): Promise<Produto[]>;
  findById(id: number): Promise<Produto | undefined>;
  replaceAll(produtos: Produto[]): Promise<void>;
  clear(): Promise<void>;
}

function toDomain(document: ProdutoHydratedDocument): Produto {
  const produto = document.toObject();

  return {
    id: produto.id,
    nome: produto.nome,
    preco: produto.preco,
    estoque: produto.estoque,
    categoria: produto.categoria,
    destaque: produto.destaque ?? false,
    promocao: produto.promocao ?? false,
    novidade: produto.novidade ?? false,
  };
}

function toPersistence(produto: Produto): ProdutoDocument {
  return {
    id: produto.id,
    nome: produto.nome,
    preco: produto.preco,
    estoque: produto.estoque,
    categoria: produto.categoria,
    destaque: produto.destaque ?? false,
    promocao: produto.promocao ?? false,
    novidade: produto.novidade ?? false,
  };
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export class MongooseProdutoRepository implements ProdutoRepository {
  async list(filters: ProdutoFilters = {}): Promise<Produto[]> {
    const query: Record<string, unknown> = {};

    if (filters.categoria) {
      query.categoria = new RegExp(`^${escapeRegExp(filters.categoria)}$`, "i");
    }

    if (filters.nome) {
      query.nome = new RegExp(escapeRegExp(filters.nome), "i");
    }

    if (filters.disponivel) {
      query.estoque = { $gt: 0 };
    }

    if (filters.destaque !== undefined) {
      query.destaque = filters.destaque;
    }

    if (filters.promocao !== undefined) {
      query.promocao = filters.promocao;
    }

    if (filters.novidade !== undefined) {
      query.novidade = filters.novidade;
    }

    const produtos = await ProdutoMongooseModel.find(query)
      .sort({ id: 1 })
      .exec();

    return produtos.map(toDomain);
  }

  async findById(id: number): Promise<Produto | undefined> {
    const produto = await ProdutoMongooseModel.findOne({ id }).exec();
    return produto ? toDomain(produto) : undefined;
  }

  async replaceAll(produtos: Produto[]): Promise<void> {
    await ProdutoMongooseModel.deleteMany({}).exec();

    if (produtos.length > 0) {
      await ProdutoMongooseModel.insertMany(produtos.map(toPersistence));
    }
  }

  async clear(): Promise<void> {
    await ProdutoMongooseModel.deleteMany({}).exec();
  }
}

export const produtoRepository: ProdutoRepository =
  new MongooseProdutoRepository();
```

- `repository/usuarios.ts`

```ts
import {
  UsuarioDocument,
  UsuarioHydratedDocument,
  UsuarioMongooseModel,
} from "../database/models/usuario.model";
import { Usuario } from "../model/usuario";

export interface UsuarioRepository {
  list(): Promise<Usuario[]>;
  findById(id: number): Promise<Usuario | undefined>;
  replaceAll(usuarios: Usuario[]): Promise<void>;
  clear(): Promise<void>;
}

function toDomain(document: UsuarioHydratedDocument): Usuario {
  const usuario = document.toObject();

  return {
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
  };
}

function toPersistence(usuario: Usuario): UsuarioDocument {
  return {
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
  };
}

export class MongooseUsuarioRepository implements UsuarioRepository {
  async list(): Promise<Usuario[]> {
    const usuarios = await UsuarioMongooseModel.find({}).sort({ id: 1 }).exec();

    return usuarios.map(toDomain);
  }

  async findById(id: number): Promise<Usuario | undefined> {
    const usuario = await UsuarioMongooseModel.findOne({ id }).exec();
    return usuario ? toDomain(usuario) : undefined;
  }

  async replaceAll(usuarios: Usuario[]): Promise<void> {
    await UsuarioMongooseModel.deleteMany({}).exec();

    if (usuarios.length > 0) {
      await UsuarioMongooseModel.insertMany(usuarios.map(toPersistence));
    }
  }

  async clear(): Promise<void> {
    await UsuarioMongooseModel.deleteMany({}).exec();
  }
}

export const usuarioRepository: UsuarioRepository =
  new MongooseUsuarioRepository();
```

**Atualizar os BDDs**

- Editar `features/step-definitions/support/database.steps.ts` para criar hook BDD, conectar no banco de teste e limpar collections entre cenarios

```ts
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

  await connectDatabase({
    serverSelectionTimeoutMS: 5000,
  });
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
```

- Editar `features/step-definitions/carrinhos/carrinho.steps.ts`

```ts
import { Given, Then, When } from "@cucumber/cucumber";
import { expect } from "chai";
import request from "supertest";

import app from "../../../src/app";
import {
  carrinhosIniciais,
  produtosIniciais,
} from "../../../src/database/seeds/dados-iniciais";
import { Carrinho } from "../../../src/model/carrinho";
import { carrinhoRepository } from "../../../src/repository/carrinhos";

let response: request.Response;

const carrinhoParaSalvar: Carrinho = {
  itens: [
    {
      ...produtosIniciais[0]!,
      quantidade: 3,
    },
  ],
};

Given("existem carrinhos cadastrados", async function () {
  await carrinhoRepository.replaceAll(carrinhosIniciais);
});

When(
  "eu envio uma requisição GET de carrinho para {string}",
  async function (endpoint: string) {
    response = await request(app).get(endpoint);
  },
);

When(
  "eu envio uma requisição POST de carrinho para {string}",
  async function (endpoint: string) {
    response = await request(app).post(endpoint).send(carrinhoParaSalvar);
  },
);

Then(
  "o status da resposta de carrinho deve ser {int}",
  function (statusCode: number) {
    expect(response.status).to.equal(statusCode);
  },
);

Then("a resposta deve conter o último carrinho cadastrado", function () {
  const ultimoCarrinho = carrinhosIniciais.at(-1);

  expect(ultimoCarrinho).to.not.equal(undefined);
  expect(response.body).to.deep.equal(ultimoCarrinho);
});

Then("a resposta deve conter o carrinho salvo", function () {
  expect(response.body).to.deep.equal(carrinhoParaSalvar);
});
```

- Nos arquivos em `features/step-definitions/produtos/`

  - `busca_e_filtros.steps.ts`
  - `catalogo.steps.ts`
  - `categorias.steps.ts`
  - remover a linha que contém `from "../../../src/data/produtos.memory";`
- Editar `features/step-definitions/produtos/shared.steps.ts`

```ts
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
```

- Editar `features/step-definitions/usuarios/detalhes.steps.ts`

```ts
import { Given, Then, When } from "@cucumber/cucumber";
import { expect } from "chai";
import request from "supertest";

import app from "../../../src/app";
import { usuariosIniciais } from "../../../src/database/seeds/dados-iniciais";
import { usuarioRepository } from "../../../src/repository/usuarios";

let response: request.Response;

Given("existe um usuário cadastrado com id {int}", async function (id: number) {
  const usuario = usuariosIniciais.find(
    (usuarioCadastrado) => usuarioCadastrado.id === id,
  );

  if (!usuario) {
    throw new Error(`Usuário de teste com id ${id} não foi definido`);
  }

  await usuarioRepository.replaceAll([usuario]);
});

Given(
  "não existe usuário cadastrado com id {int}",
  async function (id: number) {
    await usuarioRepository.replaceAll(
      usuariosIniciais.filter((usuario) => usuario.id !== id),
    );
  },
);

When(
  "eu envio uma requisição GET de detalhe de usuário para {string}",
  async function (endpoint: string) {
    response = await request(app).get(endpoint);
  },
);

Then(
  "o status da resposta de detalhe de usuário deve ser {int}",
  function (statusCode: number) {
    expect(response.status).to.equal(statusCode);
  },
);

Then(
  "a resposta de detalhe de usuário deve conter os dados do usuário {int}",
  async function (id: number) {
    const usuarioEsperado = await usuarioRepository.findById(id);

    if (!usuarioEsperado) {
      throw new Error(
        `Usuário esperado com id ${id} não foi definido no Given`,
      );
    }

    expect(response.body).to.include(usuarioEsperado);
  },
);

Then("a resposta deve informar que o usuário não foi encontrado", function () {
  expect(response.body).to.deep.equal({
    message: "Usuário não encontrado",
  });
});
```

- Editar `features/step-definitions/usuarios/listagem.steps.ts`

```ts
import { Given, Then, When } from "@cucumber/cucumber";
import { expect } from "chai";
import request from "supertest";

import app from "../../../src/app";
import { usuariosIniciais } from "../../../src/database/seeds/dados-iniciais";
import { Usuario } from "../../../src/model/usuario";
import { usuarioRepository } from "../../../src/repository/usuarios";

let response: request.Response;

Given("existem usuários cadastrados", async function () {
  await usuarioRepository.replaceAll(usuariosIniciais);
});

Given("não existem usuários cadastrados", async function () {
  await usuarioRepository.clear();
});

When(
  "eu envio uma requisição GET de listagem de usuários para {string}",
  async function (endpoint: string) {
    response = await request(app).get(endpoint);
  },
);

Then(
  "o status da resposta da listagem de usuários deve ser {int}",
  function (statusCode: number) {
    expect(response.status).to.equal(statusCode);
  },
);

Then(
  "a resposta da listagem de usuários deve conter os usuários cadastrados",
  async function () {
    expect(response.body).to.be.an("array");

    const usuariosRecebidos = response.body as Usuario[];
    const usuariosEsperados = await usuarioRepository.list();

    for (const usuarioEsperado of usuariosEsperados) {
      const usuarioRecebido = usuariosRecebidos.find(
        (usuario) => usuario.id === usuarioEsperado.id,
      );

      expect(usuarioRecebido).to.include(usuarioEsperado);
    }
  },
);

Then(
  "a resposta da listagem de usuários deve ser uma lista vazia",
  function () {
    expect(response.body).to.deep.equal([]);
  },
);
```

- Remover a pasta `app/api/src/data`
- Executar `npm run test:unit`
- Executar `npm run test:bdd` e conferir no MongoDB Compass

#### Atualizar implementação

- Editar `apps/api/src/database/mongoose.ts`

```ts
import mongoose from "mongoose";

let connectionPromise: Promise<typeof mongoose> | null = null;

function getMongoUri(): string {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("Variavel de ambiente MONGODB_URI nao foi definida");
  }

  return uri;
}

function getMongoDatabase(): string {
  return process.env.MONGODB_DATABASE || "ecommerce";
}

export async function connectDatabase(
  options: mongoose.ConnectOptions = {},
): Promise<typeof mongoose> {
  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }

  if (connectionPromise) {
    return connectionPromise;
  }

  connectionPromise = mongoose
    .connect(getMongoUri(), {
      dbName: getMongoDatabase(),
      ...options,
    })
    .catch((error: unknown) => {
      connectionPromise = null;
      throw error;
    });

  return connectionPromise;
}

export async function disconnectDatabase(): Promise<void> {
  connectionPromise = null;

  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
}

export function getDatabaseName(): string {
  return getMongoDatabase();
}
```

**Criar os models Mongoose em `Ecommerce/apps/api/src/database/models`**

- `models/carrinho.ts`

```ts
import { Produto } from "./produto";

// O ItemCarrinho é uma extensão do Produto, adicionando a quantidade do produto no carrinho
// Ele representa um item específico que o cliente deseja comprar, incluindo a quantidade desejada
// ItemCarrinho é tudo que Produto tem + um novo campo quantidade”
export type ItemCarrinho = Produto & {
  quantidade: number;
};

export type Carrinho = {
  itens: ItemCarrinho[];
};
```

- `models/categoria.ts`

```ts
export type Categoria = {
  id: number;
  categoria: string;
};
```

- `models/produto.ts`

```ts
export type Produto = {
  id: number;
  nome: string;
  preco: number;
  estoque: number;
  categoria: string;
  destaque?: boolean;
  promocao?: boolean;
  novidade?: boolean;
};
```

- `models/usuario.ts`

```ts
export type Usuario = {
  id: number;
  nome: string;
  email: string;
};
```

**Atualizar os controllers**

- `controller/categorias.ts`

```ts
import { Request, Response } from "express";
import {
  CategoriaRepository,
  categoriaRepository,
} from "../repository/categorias";

export class CategoriaController {
  constructor(
    private readonly repository: CategoriaRepository = categoriaRepository,
  ) {}

  //...
}
```

- `controller/produtos.ts`

```ts
import { Request, Response } from "express";
import {
  ProdutoFilters,
  ProdutoRepository,
  produtoRepository,
} from "../repository/produtos";

export class ProdutoController {
  constructor(
    private readonly repository: ProdutoRepository = produtoRepository,
  ) {}

  //...
}
```

- `controller/usuarios.ts`

```ts
import { Request, Response } from "express";
import { UsuarioRepository, usuarioRepository } from "../repository/usuarios";

export class UsuarioController {
  constructor(
    private readonly repository: UsuarioRepository = usuarioRepository,
  ) {}

  //...
}
```

**Atualizar as rotas em `Ecommerce/apps/api/src/route`**

- `route/categorias.ts`

```ts
//...
router.get("/categorias", (req, res, next) => {
  categoriaController.index(req, res).catch(next);
});
//...
```

- `route/produtos.ts`

```ts
//...
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
//...
```

- `route/usuarios.ts`

```ts
//...
router.get("/usuarios", (req, res, next) => {
  usuarioController.index(req, res).catch(next);
});
router.get("/usuarios/:id", (req, res, next) => {
  usuarioController.show(req, res).catch(next);
});
//...
```

- Atualizar `server.ts` para conectar ao MongoDB antes de iniciar o servidor

```ts
import app from "./app";
import dotenv from "dotenv";
import { connectDatabase } from "./database/mongoose";

dotenv.config({ path: ".env.dev", quiet: true });
dotenv.config({ quiet: true });

const PORT: number = Number(process.env.PORT) || 3001;

async function startServer(): Promise<void> {
  await connectDatabase();

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer().catch((error: unknown) => {
  console.error("Erro ao iniciar a aplicacao", error);
  process.exit(1);
});
```

- Criar dados iniciais em `Ecommerce/apps/api/src/database/seeds/dados-iniciais.ts`

```ts
import { Carrinho } from "../../model/carrinho";
import { Categoria } from "../../model/categoria";
import { Produto } from "../../model/produto";
import { Usuario } from "../../model/usuario";

export const produtosIniciais: Produto[] = [
  {
    id: 1,
    nome: "Camiseta Básica",
    preco: 59,
    estoque: 20,
    categoria: "Camisetas",
    destaque: true,
    promocao: false,
    novidade: true,
  },
  {
    id: 2,
    nome: "Calça Jeans Slim",
    preco: 149,
    estoque: 5,
    categoria: "Calças",
    destaque: false,
    promocao: true,
    novidade: false,
  },
  {
    id: 3,
    nome: "Jaqueta de Couro",
    preco: 399,
    estoque: 0,
    categoria: "Jaquetas",
    destaque: true,
    promocao: false,
    novidade: false,
  },
  {
    id: 4,
    nome: "Tênis Casual",
    preco: 199,
    estoque: 15,
    categoria: "Calçados",
    destaque: false,
    promocao: true,
    novidade: true,
  },
  {
    id: 5,
    nome: "Bermuda Jeans",
    preco: 89,
    estoque: 8,
    categoria: "Bermudas",
    destaque: false,
    promocao: false,
    novidade: true,
  },
  {
    id: 6,
    nome: "Camisa Social",
    preco: 120,
    estoque: 12,
    categoria: "Camisas",
    destaque: true,
    promocao: false,
    novidade: false,
  },
];

export const categoriasIniciais: Categoria[] = [
  {
    id: 1,
    categoria: "Camisetas",
  },
  {
    id: 2,
    categoria: "Calças",
  },
  {
    id: 3,
    categoria: "Jaquetas",
  },
  {
    id: 4,
    categoria: "Calçados",
  },
  {
    id: 5,
    categoria: "Bermudas",
  },
  {
    id: 6,
    categoria: "Camisas",
  },
];

export const usuariosIniciais: Usuario[] = [
  {
    id: 1,
    nome: "Alice Silva",
    email: "alice.silva@example.com",
  },
  {
    id: 2,
    nome: "Bob Costa",
    email: "bob.costa@example.com",
  },
];

export const carrinhosIniciais: Carrinho[] = [
  {
    itens: [
      {
        id: 1,
        nome: "Camiseta Básica",
        preco: 59,
        estoque: 20,
        categoria: "Camisetas",
        destaque: true,
        promocao: false,
        novidade: true,
        quantidade: 2,
      },
      {
        id: 2,
        nome: "Calça Jeans Slim",
        preco: 149,
        estoque: 5,
        categoria: "Calças",
        destaque: false,
        promocao: true,
        novidade: false,
        quantidade: 1,
      },
    ],
  },
  {
    itens: [
      {
        id: 3,
        nome: "Jaqueta de Couro",
        preco: 399,
        estoque: 0,
        categoria: "Jaquetas",
        destaque: true,
        promocao: false,
        novidade: false,
        quantidade: 1,
      },
    ],
  },
];
```

- Editar `Ecommerce/apps/api/src/database/migrate.ts` para sincronizar indices

```ts
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
```

- Editar `Ecommerce/apps/api/src/database/seed.ts` para inserir dados iniciais

```ts
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
```

- Adicionar os scripts `db:migrate` e `db:seed` ao `package.json`

```js
"scripts": {
  ...
  "db:migrate": "ts-node src/database/migrate.ts",
  "db:seed": "ts-node src/database/seed.ts"
},
```

- Instalar dotenv `npm i dotenv`
- Editar `Ecommerce/apps/api/.env.dev` com `MONGODB_URI` e `MONGODB_DATABASE`.

```env
NODE_ENV=development
PORT=3001
MONGODB_URI=mongodb://mongodb:27017
MONGODB_DATABASE=ecommerce_dev
```

- Recriar o container da API para carregar o `.env.dev` atualizado. Acesse `app/api/`
  - Executar `docker compose exec api npm run db:migrate`
  - Executar `docker compose exec api npm run db:seed`

### Deploy

#### MongoDB Atlas (banco de dados)

* Cadastrar no [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
* Criar um projeto. Ex: Ecommerce
* Criar um cluster no projeto Ecommerce (selecione `free`)
  * Coloque um nome. Ex: ecommerce
  * Clique em `Create Deployment`
  * Edite as credenciais de acesso. Sugestão:
    * Username: root
    * Password:  toor
  * Clique em `Create db user`
* Clique em `Choose a connection method`
* Clique em `Drivers`
* Copie a URL. Algo como `mongodb+srv://root:toor@ecommerce.1apj1w4.mongodb.net/?appName=ecommerce`

#### Render (backend)

* Cadastre no [Render](https://render.com/)
* Clique em `+New` e depois em `Web Service`
* Escolha GitHub como provider e conecte
* Escolha o repositório
* Configure:
  * Language: `Node`
  * Branch: `main`
  * Root Directory: `Ecommerce/apps/api/src/`
  * Build Command: `npm install && npm run build && npm run db:migrate && npm run db:seed`
    * Obs: `migrate` e `seed` estão sendo usados somente para ter alguns dados de teste
  * Start Command: `npm start`
  * Instance Type: `Free`
  * Environment Variables
    * `MONGODB_URI` =  `mongodb+srv://root:toor@ecommerce.1apj1w4.mongodb.net/?appName=ecommerce`
* Clique em `Deploy Web Service`
* Após a falha, clique em `Connect` e copie os IPs
* Acesse o **MongoDB Atlas**, clique à esquerda em `Security Quickstart`, role a página, adicione os IPs e clique em `Finish and Close`
* Volte para o **Render**, clique em `Manual Deploy` e clique em `Deploy lastest commit`
* Clique na URL no top para acessar a api publicada. Algo como `https://eswiii.onrender.com`

#### Vercel

* Cadastre no [Vercel](https://vercel.com/)
* Clique em `Add New`...`Project`
* Conecte ao repostiório do GitHub
* Configure o projeto:
  * Project name: `ecommerce`
  * Application Preset: `Vite`
  * Root Directory: `Ecommerce/apps/web`
  * Build Command: `npm run build`
  * Output Directory: `dist`
  * Install Command: `npm install`
  * Environment Variables
    * `VITE_API_URL` = [**URL GERADA PELO RENDER**]
* Clique em `Deploy` e acesse a aplicação.
* **Obs**: se fizer o deploy e não carregar os produtos, volte para o Vercel e faça:
  * Acesse  `Settings` / `Enviroments` / `Production`
  * Role a página, encontre a variável com o enderço da API (ex: *VITE_API_URL*) e coloque o endereço da API publicada no Render
  * Faça o Redeploy

### Alterações em Produção

Uma das vantagens de usar o **Github Actions** é automatizar as alterações para produção e com a garantia de funcionamento sem falhas.

Vamos criar cenários para verificar as alterações feitas indo direto para produção com êxito e outra com falha.

#### Cenário com Êxito

Criar um teste de aceitação que passa ao simular o clique em "Recarregar" no frontend.

Todos os procedimentos abaixo devem ser realizados em `Ecommerce/apps/api`.

Execute `npm i -D @vitejs/plugin-react chai jsdom tsx`

Editar arquivo `package.json`

```json
  "scripts": {
   ...
    "test:bdd": "node --import tsx --import ./features/support/register-css-loader.mjs ./node_modules/@cucumber/cucumber/bin/cucumber.js --config cucumber.mjs"
  },
```

Editar arquivo `cucumber.mjs`

```json
export default {
  import: ["features/step-definitions/**/*.ts"],
  paths: ["features/**/*.feature"],
};

```

Criar as pastas `mkdir -p features/recarregar features/step-definitions/recarregar features/support`

Editar `features/recarregar/recarregar.feature`

```gherkin
Feature: Recarregar página inicial

  Como visitante do e-commerce
  Quero recarregar os dados da página inicial
  Para visualizar as informações mais recentes do catálogo

  Scenario: Recarregar dados ao clicar no botão
    Given a página inicial do e-commerce está carregada
    When eu clico no botão "Recarregar"
    Then os dados da página inicial devem ser carregados novamente

```

Editar `features/step-definitions/recarregar/recarregar.steps.ts`

```typescript
import {
  After,
  AfterAll,
  Before,
  Given,
  Then,
  When,
} from "@cucumber/cucumber";
import { expect } from "chai";
import { JSDOM } from "jsdom";

const dom = new JSDOM("<!doctype html><html><body></body></html>", {
  url: "http://localhost",
});

Object.defineProperties(globalThis, {
  window: { value: dom.window, configurable: true },
  document: { value: dom.window.document, configurable: true },
  navigator: { value: dom.window.navigator, configurable: true },
  HTMLElement: { value: dom.window.HTMLElement, configurable: true },
  SVGElement: { value: dom.window.SVGElement, configurable: true },
  Element: { value: dom.window.Element, configurable: true },
  Node: { value: dom.window.Node, configurable: true },
  MutationObserver: {
    value: dom.window.MutationObserver,
    configurable: true,
  },
  getComputedStyle: {
    value: dom.window.getComputedStyle.bind(dom.window),
    configurable: true,
  },
});

(globalThis as typeof globalThis & {
  IS_REACT_ACT_ENVIRONMENT?: boolean;
}).IS_REACT_ACT_ENVIRONMENT = true;

type TestingLibrary = typeof import("@testing-library/react");

const respostasPorEndpoint: Record<string, unknown> = {
  "/produtos": [
    {
      id: 1,
      nome: "Camiseta Básica",
      descricao: "Camiseta de algodão",
      preco: 59.9,
      categoria: "Camisetas",
      estoque: 10,
      destaque: true,
      promocao: false,
      criadoEm: "2026-01-01",
    },
  ],
  "/categorias": [
    {
      id: 1,
      categoria: "Camisetas",
      totalProdutos: 1,
    },
  ],
  "/usuarios": [
    {
      id: 1,
      nome: "Maria",
      email: "maria@example.com",
    },
  ],
  "/carrinhos/ultimo": {
    itens: [],
  },
};

let chamadasFetch: string[] = [];
let fetchOriginal: typeof globalThis.fetch;

function criarRespostaJson(body: unknown, status = 200): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  } as Response;
}

function extrairPath(input: RequestInfo | URL): string {
  const url =
    typeof input === "string"
      ? input
      : input instanceof URL
        ? input.href
        : input.url;

  return new URL(url, "http://localhost:3001").pathname;
}

function contarChamadas(endpoint: string): number {
  return chamadasFetch.filter((path) => path === endpoint).length;
}

async function importarTestingLibrary(): Promise<TestingLibrary> {
  return import("@testing-library/react");
}

Before(function () {
  chamadasFetch = [];
  fetchOriginal = globalThis.fetch;
  document.body.innerHTML = "";

  globalThis.fetch = async (input: RequestInfo | URL) => {
    const path = extrairPath(input);
    chamadasFetch.push(path);

    if (path in respostasPorEndpoint) {
      return criarRespostaJson(respostasPorEndpoint[path]);
    }

    return criarRespostaJson({ message: "Endpoint não encontrado" }, 404);
  };
});

After(async function () {
  const { cleanup } = await importarTestingLibrary();

  cleanup();
  globalThis.fetch = fetchOriginal;
  document.body.innerHTML = "";
});

AfterAll(function () {
  dom.window.close();
});

Given("a página inicial do e-commerce está carregada", async function () {
  const React = await import("react");
  const { render, screen, waitFor } = await importarTestingLibrary();
  const { default: App } = await import("../../../src/App");

  render(React.createElement(App));

  await screen.findByRole("button", { name: /recarregar/i });

  await waitFor(() => {
    expect(contarChamadas("/produtos")).to.equal(1);
    expect(contarChamadas("/categorias")).to.equal(1);
    expect(contarChamadas("/usuarios")).to.equal(1);
    expect(contarChamadas("/carrinhos/ultimo")).to.equal(1);
  });
});

When("eu clico no botão {string}", async function (rotulo: string) {
  const { act } = await import("react");
  const { fireEvent, screen } = await importarTestingLibrary();

  await act(async () => {
    fireEvent.click(screen.getByRole("button", { name: rotulo }));
    await new Promise((resolve) => setTimeout(resolve, 0));
  });
});

Then("os dados da página inicial devem ser carregados novamente", async function () {
  const { waitFor } = await importarTestingLibrary();

  await waitFor(() => {
    expect(contarChamadas("/produtos")).to.equal(2);
    expect(contarChamadas("/categorias")).to.equal(2);
    expect(contarChamadas("/usuarios")).to.equal(2);
    expect(contarChamadas("/carrinhos/ultimo")).to.equal(2);
  });
});

```

Editar `features/support/ignore-css-loader.mjs`

```typescript
export async function load(url, context, nextLoad) {
  if (new URL(url).pathname.endsWith(".css")) {
    return {
      format: "module",
      shortCircuit: true,
      source: "export default {};",
    };
  }

  return nextLoad(url, context);
}

```

Editar `features/support/register-css-loader.mjs`

```typescript
import { register } from "node:module";

register("./ignore-css-loader.mjs", import.meta.url);
```

Editar `src/api.ts`

```typescript
import { Carrinho, Categoria, Produto, Usuario } from "./model";

// Acrescentar essa linha
const API_URL = import.meta.env?.VITE_API_URL || "http://localhost:3001";

// ...
```

Editar `.github/workflows/ci-teste-frontend.yml`

```yaml
# Nome exibido na aba "Actions" do GitHub
name: CI - Testes do Frontend

# Gatilhos: o workflow roda em pushes e pull requests de qualquer branch
on:
  push:
    branches:
      - "**"
  pull_request:
    branches:
      - "**"

# Como o package.json do frontend está em Ecommerce/apps/web, os comandos npm devem rodar nesse diretório
defaults:
  run:
    working-directory: Ecommerce/apps/web

# Conjunto de etapas executadas na máquina virtual
jobs:
  # Executa os testes antes de permitir o build
  tests:
    # O que será mostrado no GitHub Actions
    name: Testes automatizados do frontend

    # Ambiente virtual usado pelo GitHub Actions
    runs-on: ubuntu-latest

    steps:
      # Baixa o código do repositório para dentro da máquina virtual do GitHub Actions
      - name: Baixar código do repositório
        uses: actions/checkout@v4

      # Instala e configura a versão do Node.js usada pela pipeline
      - name: Configurar Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
          cache-dependency-path: Ecommerce/apps/web/package-lock.json

      # Instala as dependências exatamente como descritas no package-lock.json
      - name: Instalar dependências
        run: npm ci

      # Executa os testes de aceitação(BDD) do frontend
      - name: Executar testes BDD
        run: npm run test:bdd

  # O build só executa se os testes passarem
  build:
    # O que será mostrado no GitHub Actions
    name: Build do frontend

    # Garante que o build depende do sucesso dos testes
    needs: tests

    # Ambiente virtual usado pelo GitHub Actions
    runs-on: ubuntu-latest

    steps:
      # Baixa o código do repositório para dentro da máquina virtual do GitHub Actions
      - name: Baixar código do repositório
        uses: actions/checkout@v4

      # Instala e configura a versão do Node.js usada pela pipeline
      - name: Configurar Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
          cache-dependency-path: Ecommerce/apps/web/package-lock.json

      # Instala as dependências exatamente como descritas no package-lock.json
      - name: Instalar dependências
        run: npm ci

      # Compila o frontend apenas depois dos testes passarem
      - name: Verificar build do frontend
        run: npm run build
```

Atualizar repositório remoto.

#### Cenário SEM êxito

Editar `wep/src/App.tsx`

```javascript
        {/* <button
          className="refresh-button"
          type="button"
          onClick={() => void carregarDados()}
          title="Recarregar dados da API"
        >
          <RefreshCcw size={18} aria-hidden="true" />
          <span>Recarregar</span>
        </button> */}
```

Atualizar o repositório.

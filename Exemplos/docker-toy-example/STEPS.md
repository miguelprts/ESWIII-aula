# STEPS.md

## Criar estrutura

```
api
web
.gitignore
README.md
.env.dev
```

## Implementar ./api

- Acessar `./api`
- `npm i cors dotenv express`
- `npm i -D @types/cors @types/express @types/node tsx typescript`
- Editar `package.json`

```js
"main": "dist/server.js",
"scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js"
},
```

- Editar `config/.env.dev`

```txt
PORT=3000
FRONTEND_URL=http://localhost:5173
MONGODB_URI=mongodb://localhost:27017/docker-toy-example
STORAGE_UPLOAD_DIR=uploads
STORAGE_PUBLIC_URL=http://localhost:8080/uploads
```

- Editar `tsconfig.json`

```ts
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "CommonJS",
    "moduleResolution": "Node",
    "rootDir": "src",
    "outDir": "dist",
    "strict": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true
  },
  "include": ["src/**/*.ts"],
  "exclude": ["node_modules", "dist"]
}
```

- Criar e acessar pasta `src`
- Editar `app.ts`

```ts
import cors from "cors";
import express from "express";

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: process.env.FRONTEND_URL ?? "http://localhost:5173",
  }),
);

app.get("/health", (_request, response) => {
  response.status(200).json({ status: "ok" });
});

export { app };
```

- Editar `env.ts`

```ts
import dotenv from "dotenv";

dotenv.config({ path: ".env.dev" });
```

- Editar `server.ts`

```ts
import "./env";
import { app } from "./app";

const port = Number(process.env.PORT || 3000);

app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
});
```

- Executar `npm run dev`
- Acessar `localhost:3000/health`

## Configurar Docker da api

- Criar `.dockerignore`

```txt
node_modules
dist
npm-debug.log
.env
.env.local
.env.*.local
.DS_Store
coverage
uploads
```

- Editar `Dockerfile`

```yml
# Multi-stage build
# Etapa build: build a aplicação
# Etapa production: copia os arquivos do build e expõe a aplicação (única imagem)

# Etapa de build: instala todas as dependencias e compila o TypeScript.
FROM node:lts-alpine AS build

# Define o diretorio de trabalho dentro do container.
WORKDIR /app

# Copia primeiro os manifests do npm para aproveitar cache de dependencias.
COPY package*.json ./
RUN npm ci

# Copia a configuracao do TypeScript e o codigo-fonte da API.
COPY tsconfig.json ./
COPY src ./src

# Gera a pasta dist com o JavaScript compilado.
RUN npm run build

# Etapa final: imagem menor, apenas para executar a API em producao.
FROM node:lts-alpine AS production

WORKDIR /app

# Indica para bibliotecas Node que a aplicacao esta em modo producao.
ENV NODE_ENV=production

# Instala somente dependencias de producao.
COPY package*.json ./
RUN npm ci --omit=dev

# Copia apenas o resultado compilado da etapa de build.
COPY --from=build /app/dist ./dist

# Documenta que a API escuta na porta 3000 dentro do container.
EXPOSE 3000

# Comando executado quando o container iniciar.
CMD ["npm", "start"]
```

## Configurar MongoDB na API

- Executar no terminal

```shell
npm i dovenv mongoose 
```

- Criar e acessar a pasta `api/src`
- Editar `config/env.ts`

```ts
import dotenv from "dotenv";

dotenv.config({ path: ".env.dev" });

const requiredEnv = (name: string): string => {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
};

export const env = {
  port: Number(process.env.PORT ?? 3000),
  frontendUrl: process.env.FRONTEND_URL ?? "http://localhost:5173",
  mongodbUri: requiredEnv("MONGODB_URI"),
};
```

- Editar `database/mongoose.ts`

```ts
import mongoose from "mongoose";
import { env } from "../config/env";

export const connectToMongoDB = async (): Promise<void> => {
  try {
    await mongoose.connect(env.mongodbUri);
    console.log("MongoDB connected");
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Could not connect to MongoDB: ${message}`);
    throw error;
  }
};
```

## Criar modelo de Livro

- Em `api/src`
- Editar `modules/books/book.model.ts`

```ts
import { Schema, model } from "mongoose";

export interface Book {
  title: string;
  authors: string[];
  year: number;
  imageUrl: string;
}

const bookSchema = new Schema<Book>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    authors: {
      type: [String],
      required: true,
      validate: {
        validator: (authors: string[]) => authors.length > 0,
        message: "Book must have at least one author.",
      },
    },
    year: {
      type: Number,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

export const BookModel = model<Book>("Book", bookSchema);
```

## Criar rotas

- Em `api/src/modules/books`
- Editar `book.controller.ts`

```ts
import { Request, Response } from "express";
import { createBook, listBooks } from "./book.service";

type CreateBookBody = {
  title: string;
  authors: string[];
  year: number;
  imageUrl: string;
};

type UnknownCreateBookBody = Partial<Record<keyof CreateBookBody, unknown>>;

const validateCreateBookBody = (body: UnknownCreateBookBody): string | null => {
  if (typeof body.title !== "string" || body.title.trim().length === 0) {
    return "Field title is required and must be a non-empty string.";
  }

  if (
    !Array.isArray(body.authors) ||
    body.authors.length === 0 ||
    !body.authors.every(
      (author) => typeof author === "string" && author.trim().length > 0,
    )
  ) {
    return "Field authors is required and must be a non-empty array of strings.";
  }

  if (typeof body.year !== "number" || !Number.isInteger(body.year)) {
    return "Field year is required and must be an integer.";
  }

  if (typeof body.imageUrl !== "string" || body.imageUrl.trim().length === 0) {
    return "Field imageUrl is required and must be a non-empty string.";
  }

  return null;
};

export const getBooks = async (
  _request: Request,
  response: Response,
): Promise<void> => {
  try {
    const books = await listBooks();
    response.status(200).json(books);
  } catch (error) {
    console.error("Could not list books:", error);
    response.status(500).json({ message: "Could not list books." });
  }
};

export const postBook = async (
  request: Request<unknown, unknown, UnknownCreateBookBody>,
  response: Response,
): Promise<void> => {
  const validationError = validateCreateBookBody(request.body);

  if (validationError) {
    response.status(400).json({ message: validationError });
    return;
  }

  const body = request.body as CreateBookBody;

  try {
    const book = await createBook({
      title: body.title.trim(),
      authors: body.authors.map((author) => author.trim()),
      year: body.year,
      imageUrl: body.imageUrl.trim(),
    });

    response.status(201).json(book);
  } catch (error) {
    console.error("Could not create book:", error);
    response.status(500).json({ message: "Could not create book." });
  }
};
```

- Editar `book.routes.ts`

```ts
import { Router } from "express";
import { getBooks, postBook } from "./book.controller";

const bookRoutes = Router();

bookRoutes.get("/", getBooks);
bookRoutes.post("/", postBook);

export { bookRoutes };
```

- Editar `book.service.ts`

```ts
import { Book, BookModel } from "./book.model";

type CreateBookInput = Pick<Book, "title" | "authors" | "year" | "imageUrl">;

export const listBooks = async (): Promise<Book[]> => {
  return BookModel.find().sort({ createdAt: -1 });
};

export const createBook = async (book: CreateBookInput): Promise<Book> => {
  return BookModel.create(book);
};
```

- Editar `api/src/app.ts`

```ts
import cors from "cors";
import express from "express";
import { env } from "./config/env";
import { bookRoutes } from "./modules/books/book.routes";

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: env.frontendUrl,
  }),
);

app.get("/health", (_request, response) => {
  response.status(200).json({ status: "ok" });
});

app.use("/books", bookRoutes);

export { app };
```

## Adicionar upload de imagem na API

- Executar `npm i multer`
- Executar `npm i -D @types/multer`
- Editar `api/src/config/env.ts`

```ts
export const env = {
  //...
  storageUploadDir: process.env.STORAGE_UPLOAD_DIR ?? "uploads",
  storagePublicUrl:
    process.env.STORAGE_PUBLIC_URL ?? "http://localhost:8080/uploads",
};
```

- Editar `api/src/modules/books/book.upload.ts`

```ts
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { NextFunction, Request, Response } from "express";
import multer from "multer";
import { env } from "../../config/env";

const allowedMimeTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const allowedExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);

const storage = multer.diskStorage({
  destination: (_request, _file, callback) => {
    fs.mkdirSync(env.storageUploadDir, { recursive: true });
    callback(null, env.storageUploadDir);
  },
  filename: (_request, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    callback(null, `${crypto.randomUUID()}${extension}`);
  },
});

export const uploadBookImage = multer({
  storage,
  fileFilter: (_request, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();

    if (!allowedMimeTypes.has(file.mimetype) || !allowedExtensions.has(extension)) {
      callback(new Error("File image must be jpg, jpeg, png, webp or gif."));
      return;
    }

    callback(null, true);
  },
});

export const handleBookImageUploadError = (
  error: Error,
  _request: Request,
  response: Response,
  _next: NextFunction,
): void => {
  if (error instanceof multer.MulterError && error.code === "LIMIT_UNEXPECTED_FILE") {
    response.status(400).json({
      message: "Unexpected file field. Use a single file field named image.",
    });
    return;
  }

  response.status(400).json({ message: error.message });
};
```

- Editar `api/src/modules/books/book.controller.ts`

```ts
import { Request, Response } from "express";
import { env } from "../../config/env";
import { createBook, listBooks } from "./book.service";

type CreateBookBody = {
  title: string;
  authors: string[];
  year: number;
  imageUrl: string;
};

type UnknownCreateBookBody = Partial<Record<keyof CreateBookBody, unknown>>;

const parseAuthors = (authors: unknown): string[] | null => {
  if (Array.isArray(authors)) {
    const parsedAuthors = authors
      .filter((author): author is string => typeof author === "string")
      .map((author) => author.trim())
      .filter(Boolean);

    return parsedAuthors.length > 0 ? parsedAuthors : null;
  }

  if (typeof authors === "string") {
    const parsedAuthors = authors
      .split(",")
      .map((author) => author.trim())
      .filter(Boolean);

    return parsedAuthors.length > 0 ? parsedAuthors : null;
  }

  return null;
};

const parseYear = (year: unknown): number | null => {
  if (typeof year === "number" && Number.isInteger(year)) {
    return year;
  }

  if (typeof year === "string" && year.trim().length > 0) {
    const parsedYear = Number(year);
    return Number.isInteger(parsedYear) ? parsedYear : null;
  }

  return null;
};

const buildImageUrl = (file?: Express.Multer.File): string | null => {
  if (!file) {
    return null;
  }

  return `${env.storagePublicUrl.replace(/\/$/, "")}/${file.filename}`;
};

const validateCreateBookBody = (
  body: UnknownCreateBookBody,
  file?: Express.Multer.File,
): string | null => {
  if (typeof body.title !== "string" || body.title.trim().length === 0) {
    return "Field title is required and must be a non-empty string.";
  }

  if (!parseAuthors(body.authors)) {
    return "Field authors is required and must be a non-empty array or comma-separated string.";
  }

  if (parseYear(body.year) === null) {
    return "Field year is required and must be an integer.";
  }

  if (
    !file &&
    (typeof body.imageUrl !== "string" || body.imageUrl.trim().length === 0)
  ) {
    return "Field imageUrl is required when image file is not provided.";
  }

  return null;
};

export const getBooks = async (
  _request: Request,
  response: Response,
): Promise<void> => {
  try {
    const books = await listBooks();
    response.status(200).json(books);
  } catch (error) {
    console.error("Could not list books:", error);
    response.status(500).json({ message: "Could not list books." });
  }
};

export const postBook = async (
  request: Request<unknown, unknown, UnknownCreateBookBody>,
  response: Response,
): Promise<void> => {
  const validationError = validateCreateBookBody(request.body, request.file);

  if (validationError) {
    response.status(400).json({ message: validationError });
    return;
  }

  const body = request.body;
  const authors = parseAuthors(body.authors);
  const year = parseYear(body.year);
  const imageUrl = buildImageUrl(request.file) ?? String(body.imageUrl).trim();

  try {
    const book = await createBook({
      title: String(body.title).trim(),
      authors: authors ?? [],
      year: year ?? 0,
      imageUrl,
    });

    response.status(201).json(book);
  } catch (error) {
    console.error("Could not create book:", error);
    response.status(500).json({ message: "Could not create book." });
  }
};
```

- Editar `api/src/modules/books/book.routes.ts`

```ts
import { Router } from "express";
import { getBooks, postBook } from "./book.controller";
import { handleBookImageUploadError, uploadBookImage } from "./book.upload";

const bookRoutes = Router();

bookRoutes.get("/", getBooks);
bookRoutes.post(
  "/",
  uploadBookImage.single("image"),
  handleBookImageUploadError,
  postBook,
);

export { bookRoutes };
```

## Criar o Frontend com Vite e React

- Acessar `web`
- Executar `npm i vite react react-dom @vitejs/plugin-react`
- Executar `npm i -D @types/react @types/react-dom typescript`
- Editar `package.js`

```js
"type": "module",
"scripts": {
    "dev": "vite --mode dev",
    "build": "tsc -b && vite build",
    "preview": "vite preview"
},
```

- Editar `.env.dev`

```text
VITE_API_URL=http://localhost:5173
```

- Editar `tsconfig.ts`

```ts
{
  "files": [],
  "references": [
    {
      "path": "./tsconfig.app.json"
    },
    {
      "path": "./tsconfig.node.json"
    }
  ]
}
```

- Editar `tsconfig.node.json`

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2023"],
    "module": "ESNext",
    "moduleResolution": "Node",
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "noEmit": true,
    "skipLibCheck": true
  },
  "include": ["vite.config.ts"]
}
```

- Editar `tsconfig.app.json`

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "allowJs": false,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "moduleResolution": "Node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": ["src"]
}
```

- Editar `vite.config.ts`

```ts
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 5173,
  },
});
```

- Editar `index.html`

```html
<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Docker Toy Example</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- Acessar `src`
- Editar App.tsx

```tsx
import { useEffect, useState } from "react";

type Book = {
  _id: string;
  title: string;
  authors: string[];
  year: number;
  imageUrl: string;
};

const apiUrl = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export function App() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const loadBooks = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`${apiUrl}/books`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Nao foi possivel carregar os livros.");
        }

        const data = (await response.json()) as Book[];
        setBooks(data);
      } catch (requestError) {
        if (requestError instanceof DOMException && requestError.name === "AbortError") {
          return;
        }

        setError(requestError instanceof Error ? requestError.message : "Erro inesperado.");
      } finally {
        setIsLoading(false);
      }
    };

    void loadBooks();

    return () => controller.abort();
  }, []);

  return (
    <main className="page">
      <header className="page-header">
        <p className="eyebrow">Docker Toy Example</p>
        <h1>Livros</h1>
      </header>

      {isLoading && <p className="status">Carregando livros...</p>}

      {error && !isLoading && <p className="status status-error">{error}</p>}

      {!isLoading && !error && books.length === 0 && (
        <p className="status">Nenhum livro cadastrado ainda.</p>
      )}

      {!isLoading && !error && books.length > 0 && (
        <section className="book-grid" aria-label="Lista de livros">
          {books.map((book) => (
            <article className="book-card" key={book._id}>
              <img className="book-image" src={book.imageUrl} alt={`Capa do livro ${book.title}`} />
              <div className="book-content">
                <h2>{book.title}</h2>
                <p>{book.authors.join(", ")}</p>
                <span>{book.year}</span>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
```

- Editar `main.tsx`

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import "./styles.css";

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

- Editar `styles.css`

```css
:root {
  color: #1f2937;
  background: #f6f7f9;
  font-family:
    Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-width: 320px;
  min-height: 100vh;
}

img {
  display: block;
  max-width: 100%;
}

.page {
  width: min(1120px, calc(100% - 32px));
  margin: 0 auto;
  padding: 48px 0;
}

.page-header {
  margin-bottom: 28px;
}

.eyebrow {
  margin: 0 0 6px;
  color: #2563eb;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0;
  text-transform: uppercase;
}

h1 {
  margin: 0;
  color: #111827;
  font-size: clamp(2rem, 4vw, 3.5rem);
  line-height: 1;
}

.status {
  margin: 0;
  padding: 18px 20px;
  border: 1px solid #d7dce3;
  border-radius: 8px;
  background: #ffffff;
  color: #4b5563;
}

.status-error {
  border-color: #f3b4b4;
  background: #fff5f5;
  color: #a42222;
}

.book-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 18px;
}

.book-card {
  overflow: hidden;
  border: 1px solid #d7dce3;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 10px 24px rgb(17 24 39 / 8%);
}

.book-image {
  width: 100%;
  aspect-ratio: 4 / 5;
  object-fit: cover;
  background: #e5e7eb;
}

.book-content {
  padding: 16px;
}

.book-content h2 {
  margin: 0 0 8px;
  color: #111827;
  font-size: 1.05rem;
  line-height: 1.25;
}

.book-content p {
  margin: 0 0 12px;
  color: #4b5563;
  line-height: 1.45;
}

.book-content span {
  display: inline-flex;
  color: #166534;
  font-size: 0.9rem;
  font-weight: 700;
}

@media (max-width: 560px) {
  .page {
    width: min(100% - 24px, 1120px);
    padding: 28px 0;
  }

  .book-grid {
    grid-template-columns: 1fr;
  }
}
```

- Editar `vite-env.d.ts`

```ts
/// <reference types="vite/client" />
```

## Docker no frontend

- Editar `.dockerignore`

```txt
node_modules
dist
npm-debug.log
.env
.env.local
.env.*.local
.DS_Store
coverage
*.tsbuildinfo
```

- Editar `Dockerfile`

```yaml
# Etapa de build: instala dependencias e gera os arquivos estaticos do Vite.
FROM node:lts-alpine AS build

# Define o diretorio de trabalho dentro do container.
WORKDIR /app

# Copia primeiro os manifests do npm para aproveitar o cache de dependencias.
COPY package*.json ./
RUN npm ci

# Copia os arquivos de configuracao e o codigo-fonte da aplicacao.
COPY tsconfig*.json ./
COPY vite.config.ts ./
COPY index.html ./
COPY src ./src

# Define a URL usada pelo Vite durante o build.
ARG VITE_API_URL=http://localhost:5173
ENV VITE_API_URL=$VITE_API_URL

# Compila o TypeScript e gera o build estatico na pasta dist.
RUN npm run build

# Etapa final: usa nginx para servir os arquivos estaticos gerados.
FROM nginx:alpine AS production

# Substitui a configuracao padrao do nginx pela configuracao da aplicacao.
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia o build da etapa anterior para a pasta publica do nginx.
COPY --from=build /app/dist /usr/share/nginx/html

# Documenta que o container escuta na porta 80.
EXPOSE 80

# Mantem o nginx em primeiro plano para o container continuar em execucao.
CMD ["nginx", "-g", "daemon off;"]
```

- Editar `nginx.conf`

```txt
server {
  listen 80;
  server_name _;

  root /usr/share/nginx/html;
  index index.html;

  location / {
    try_files $uri $uri/ /index.html;
  }
}
```

## Criar container de storage para imagens

- Criar pasta `./infra/storage`
- Editar arquivo `./infra/storage/nginx.conf`

```txt
server {
  listen 80;
  server_name _;

  root /usr/share/nginx/html;

  location /uploads/ {
    alias /usr/share/nginx/html/uploads/;
    autoindex off;
    try_files $uri =404;
  }
}
```

## Criar docker-compose.yml com todos os containers

- Editar `./docker-compose.yml`

```yml
# Docker Compose do projeto Docker Toy Example.
# Ele sobe os containers de backend, frontend, banco, painel do banco e storage.

services:
  # Backend Node.js + TypeScript.
  api:
    # Builda a imagem usando o Dockerfile dentro de ./api.
    build:
      context: ./api
    container_name: docker-toy-api
    ports:
      # host:container
      - "3000:3000"
    environment:
      # Porta interna usada pela API.
      PORT: 3000
      # Origem permitida pelo CORS.
      FRONTEND_URL: http://localhost:5173
      # Dentro da rede Docker, o host do MongoDB e o nome do servico: mongodb.
      MONGODB_URI: mongodb://mongodb:27017/docker-toy-example
      # A API grava os uploads neste caminho dentro do container.
      STORAGE_UPLOAD_DIR: /uploads
      # URL publica usada para salvar imageUrl no MongoDB.
      STORAGE_PUBLIC_URL: http://localhost:8080/uploads
    volumes:
      # Mesmo volume usado pelo storage, mas montado no caminho onde a API escreve.
      - uploads_data:/uploads
    depends_on:
      mongodb:
        condition: service_healthy
    networks:
      - docker_toy_network

  # Frontend React compilado pelo Vite e servido com nginx.
  web:
    build:
      context: ./web
      args:
        # Esta URL roda no navegador do host, entao usa localhost e a porta publicada da API.
        VITE_API_URL: http://localhost:3000
    container_name: docker-toy-web
    ports:
      # O nginx do container escuta na porta 80; no host usamos 5173 para estudo.
      - "5173:80"
    depends_on:
      - api
    networks:
      - docker_toy_network

  # Banco de dados MongoDB.
  mongodb:
    image: mongo:latest
    container_name: docker-toy-mongodb
    # Nao publicamos a porta 27017 no host para evitar conflito com MongoDB local.
    # Os containers acessam o banco pela rede Docker usando mongodb:27017.
    volumes:
      # Persistencia dos dados do MongoDB.
      - mongodb_data:/data/db
    healthcheck:
      # Garante que outros servicos aguardem o MongoDB aceitar comandos.
      test: ["CMD", "mongosh", "--quiet", "--eval", "db.adminCommand('ping').ok"]
      interval: 5s
      timeout: 3s
      retries: 10
      start_period: 5s
    networks:
      - docker_toy_network

  # Interface web para inspecionar o MongoDB.
  mongo-express:
    image: mongo-express:latest
    container_name: docker-toy-mongo-express
    ports:
      - "8082:8081"
    environment:
      # URL interna do MongoDB dentro da rede Docker.
      ME_CONFIG_MONGODB_URL: mongodb://mongodb:27017
      # Desabilita autenticacao basica para simplificar o toy example local.
      ME_CONFIG_BASICAUTH: "false"
    depends_on:
      mongodb:
        condition: service_healthy
    networks:
      - docker_toy_network

  # Storage HTTP para servir imagens enviadas pela API.
  storage:
    image: nginx:alpine
    container_name: docker-toy-storage
    ports:
      - "8080:80"
    volumes:
      # Configuracao nginx dedicada para servir /uploads.
      - ./infra/storage/nginx.conf:/etc/nginx/conf.d/default.conf:ro
      # Mesmo volume usado pela API, montado no diretorio publico do nginx.
      - uploads_data:/usr/share/nginx/html/uploads
    networks:
      - docker_toy_network

# Rede propria para os servicos se comunicarem por nome.
networks:
  docker_toy_network:
    driver: bridge

# Volumes nomeados para persistir dados mesmo apos parar/remover containers.
volumes:
  mongodb_data:
  uploads_data:
```

- Execute `docker compose up -d --build`

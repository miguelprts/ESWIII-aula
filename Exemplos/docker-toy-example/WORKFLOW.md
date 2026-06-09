# Workflow do Docker Toy Example

Este workflow foi pensado para construir o projeto em etapas pequenas, usando o app apenas como laboratório de Docker. A ideia é executar um passo por vez e usar o prompt de cada seção para gerar somente o código daquela etapa.

Arquitetura desejada:

- `api`: backend Node.js + TypeScript.
- `web`: frontend simples com Vite + React + TypeScript.
- `mongodb`: banco de dados MongoDB.
- `mongo-express`: interface web para inspecionar o MongoDB.
- `storage`: container separado para servir arquivos de imagem salvos em um volume Docker.

Observação importante: os arquivos devem persistir em um volume Docker nomeado. O container `storage` pode servir esses arquivos via HTTP, mas a persistência real vem do volume, não do filesystem interno do container.

## 1. Criar a Estrutura Inicial do Monorepo

Objetivo: criar a estrutura de diretórios e arquivos base sem implementar regras de negócio ainda.

Prompt:

```text
Atue como dev fullstack senior com foco em Docker. Neste projeto vazio, crie apenas a estrutura inicial de um monorepo para um app de livros:

- diretório ./api para o backend
- diretório ./web para o frontend
- diretório ./infra se for útil para arquivos auxiliares de Docker
- arquivo .gitignore na raiz
- arquivo README.md inicial com instruções ainda resumidas
- arquivo .env.example na raiz com variáveis previstas para MongoDB, API, web e storage

Não implemente a API, o frontend nem o docker-compose ainda. Apenas crie a base do projeto e explique brevemente a função de cada diretório.
```

## 2. Criar o Backend Node.js com TypeScript

Objetivo: inicializar a API com Express, TypeScript e scripts básicos de desenvolvimento.

Prompt:

```text
Dentro de ./api, crie uma API Node.js com TypeScript usando Express.

Requisitos:
- package.json com scripts dev, build e start
- tsconfig.json
- src/server.ts
- src/app.ts
- endpoint GET /health retornando { "status": "ok" }
- uso de dotenv para variáveis de ambiente
- CORS habilitado para o frontend
- código organizado de forma simples e didática

Não implemente MongoDB, upload nem livros ainda. Ao final, mostre como rodar a API localmente sem Docker.
```

## 3. Adicionar Dockerfile do Backend

Objetivo: containerizar a API isoladamente antes de conectar com outros serviços.

Prompt:

```text
Crie o Dockerfile do backend em ./api/Dockerfile.

Requisitos:
- usar imagem oficial node LTS alpine
- instalar dependências com npm ci quando possível
- copiar o código da API
- rodar npm run build
- iniciar com npm start
- expor a porta 3000
- criar também um .dockerignore dentro de ./api

Não altere regras de negócio. Explique quais camadas do Dockerfile ajudam no cache de build.
```

## 4. Configurar MongoDB na API

Objetivo: conectar a API ao MongoDB usando Mongoose.

Prompt:

```text
Atualize a API em ./api para conectar no MongoDB usando Mongoose.

Requisitos:
- criar src/config/env.ts para centralizar variáveis de ambiente
- criar src/database/mongoose.ts com a função de conexão
- usar MONGODB_URI vindo do ambiente
- conectar ao banco antes de subir o servidor
- manter o endpoint GET /health funcionando
- retornar erro claro no console quando o MongoDB não estiver acessível

Não implemente ainda o CRUD de livros. Inclua as variáveis necessárias no .env.example da raiz se ainda não existirem.
```

## 5. Criar Modelo de Livro

Objetivo: definir a estrutura dos dados no MongoDB.

Prompt:

```text
Na API, implemente o modelo Book com Mongoose.

Campos obrigatórios:
- title: string
- authors: array de strings
- year: number
- imageUrl: string

Requisitos:
- criar src/modules/books/book.model.ts
- validar campos obrigatórios no schema
- timestamps habilitados
- manter nomes em inglês no código
- não criar controllers nem rotas ainda

Ao final, explique como esse schema será armazenado no MongoDB.
```

## 6. Criar Rotas de Listagem e Cadastro de Livros

Objetivo: permitir listar livros pela página web e cadastrar livros via POST no Postman.

Prompt:

```text
Implemente as rotas de livros na API.

Rotas:
- GET /books: retorna todos os livros, ordenados pelos mais recentes primeiro
- POST /books: cria um livro

Payload JSON do POST /books:
{
  "title": "Clean Code",
  "authors": ["Robert C. Martin"],
  "year": 2008,
  "imageUrl": "http://localhost:8080/uploads/clean-code.jpg"
}

Requisitos:
- criar controller, service e routes em src/modules/books
- validar campos obrigatórios de forma simples
- retornar status HTTP adequados
- registrar as rotas no app principal
- não implementar upload de arquivo ainda
```

## 7. Adicionar Upload de Imagem na API

Objetivo: permitir que o cadastro via Postman envie imagem junto com os dados do livro.

Prompt:

```text
Atualize a API para aceitar cadastro de livro com upload de imagem usando multipart/form-data.

Requisitos:
- usar multer
- POST /books deve aceitar os campos:
  - title
  - authors, podendo ser string separada por vírgulas ou múltiplos valores
  - year
  - image
- salvar o arquivo enviado em uma pasta configurável por STORAGE_UPLOAD_DIR
- gerar imageUrl usando STORAGE_PUBLIC_URL
- persistir no MongoDB title, authors, year e imageUrl
- manter compatibilidade com cadastro via JSON usando imageUrl, se isso for simples
- validar extensão/tipo básico de imagem

Considere que em Docker a API gravará em um volume compartilhado com o container storage. Não crie ainda o docker-compose.
```

## 8. Criar o Frontend com Vite e React

Objetivo: criar uma página simples para consumir a API e mostrar a lista de livros.

Prompt:

```text
Dentro de ./web, crie um frontend simples com Vite + React + TypeScript.

Requisitos:
- uma única página
- buscar os livros em GET /books
- exibir título, autores, ano e imagem
- usar variável VITE_API_URL para a URL da API
- criar estado de loading e erro
- não criar formulário de cadastro no frontend
- design simples, limpo e responsivo
- package.json com scripts dev, build e preview

Ao final, mostre como rodar o frontend localmente sem Docker.
```

## 9. Adicionar Dockerfile do Frontend

Objetivo: containerizar o frontend para servir a aplicação compilada.

Prompt:

```text
Crie o Dockerfile do frontend em ./web/Dockerfile.

Requisitos:
- build multi-stage
- etapa de build com Node LTS alpine
- etapa final com nginx alpine
- servir o build estático do Vite pelo nginx
- expor a porta 80 no container
- criar ./web/nginx.conf se necessário para fallback de SPA
- criar ./web/.dockerignore

Não altere a interface além do necessário para funcionar no container.
```

## 10. Criar Container de Storage para Imagens

Objetivo: criar um serviço separado para servir os arquivos enviados pela API.

Prompt:

```text
Crie a configuração do container storage para servir imagens salvas em volume Docker.

Abordagem desejada:
- usar nginx alpine como servidor estático
- servir arquivos em /usr/share/nginx/html/uploads
- expor esse serviço na porta 8080 do host
- criar arquivo de configuração em ./infra/storage/nginx.conf, se necessário
- considerar que o volume Docker será montado nesse diretório

Não implemente docker-compose ainda. Explique que a API gravará no mesmo volume em outro caminho, e o storage apenas servirá os arquivos via HTTP.
```

## 11. Criar docker-compose.yml com Todos os Containers

Objetivo: orquestrar os cinco containers do projeto.

Prompt:

```text
Crie o docker-compose.yml na raiz do projeto.

Serviços obrigatórios:
- api
- web
- mongodb
- mongo-express
- storage

Requisitos:
- api deve buildar ./api
- web deve buildar ./web
- mongodb deve usar imagem oficial mongo
- mongo-express deve usar imagem oficial mongo-express
- storage deve usar nginx alpine com configuração de ./infra/storage
- criar rede Docker própria para o projeto
- criar volume nomeado para dados do MongoDB
- criar volume nomeado para uploads/imagens
- api deve receber MONGODB_URI apontando para mongodb dentro da rede Docker
- api deve montar o volume de uploads no caminho usado por STORAGE_UPLOAD_DIR
- storage deve montar o mesmo volume como diretório público de arquivos
- web deve ser acessível pelo host
- mongo-express deve ser acessível pelo host

Use portas simples:
- web: 5173 ou 8081 no host
- api: 3000 no host
- storage: 8080 no host
- mongo-express: 8082 no host
- mongodb: 27017 no host, se achar útil para aprendizado

Também atualize o .env.example com todas as variáveis usadas.
```

## 12. Ajustar Variáveis de Ambiente para Docker e Desenvolvimento Local

Objetivo: evitar URLs quebradas entre execução local e execução com Docker Compose.

Prompt:

```text
Revise as variáveis de ambiente do projeto para suportar dois cenários:

1. rodar localmente sem Docker
2. rodar com docker compose

Requisitos:
- criar exemplos claros no .env.example
- documentar MONGODB_URI
- documentar STORAGE_UPLOAD_DIR
- documentar STORAGE_PUBLIC_URL
- documentar VITE_API_URL
- garantir que, no Docker, a API fale com mongodb pelo nome do serviço
- garantir que, no navegador, web consuma a API por uma URL acessível pelo host
- garantir que imageUrl aponte para o container storage publicado no host

Não adicione novas features. Apenas corrija configuração e documentação.
```

## 13. Criar Seeds Opcionais para Teste

Objetivo: facilitar testes sem depender de cadastro manual sempre.

Prompt:

```text
Crie um script opcional de seed na API para inserir alguns livros de exemplo no MongoDB.

Requisitos:
- script npm run seed dentro de ./api
- usar a mesma conexão Mongoose da aplicação
- inserir livros apenas se a coleção estiver vazia
- usar imageUrl apontando para imagens públicas ou para arquivos esperados no storage
- não executar seed automaticamente no start da API

Explique quando faz sentido usar seed e quando usar Postman para aprender POST e upload.
```

## 14. Documentar Requisições para Postman

Objetivo: deixar claro como cadastrar livros manualmente.

Prompt:

```text
Atualize o README.md com exemplos de requisições para testar a API pelo Postman ou curl.

Documente:
- GET /health
- GET /books
- POST /books com JSON usando imageUrl
- POST /books com multipart/form-data usando upload de imagem

Inclua exemplos de campos:
- title
- authors
- year
- imageUrl
- image

Também explique como acessar:
- frontend
- API
- storage de imagens
- mongo-express
```

## 15. Testar Tudo com Docker Compose

Objetivo: validar a integração completa dos containers.

Prompt:

```text
Execute uma revisão final do projeto Docker.

Tarefas:
- verificar se docker compose up --build sobe todos os serviços
- testar GET /health
- testar POST /books via JSON
- testar POST /books via multipart/form-data com imagem
- testar GET /books
- verificar se a imagem enviada fica acessível pela URL do storage
- verificar se o frontend renderiza a lista de livros
- verificar se o mongo-express mostra a coleção de livros

Se encontrar erro, corrija o menor conjunto de arquivos necessário e explique a causa.
```

## 16. Melhorar a Experiência de Aprendizado com Docker

Objetivo: adicionar comandos úteis para estudar imagens, containers, redes e volumes.

Prompt:

```text
Atualize o README.md com uma seção "Comandos Docker para estudo".

Inclua comandos para:
- subir tudo com build
- parar os containers
- ver logs da API
- listar containers
- listar imagens
- listar volumes
- inspecionar a rede do projeto
- apagar containers mantendo volumes
- apagar volumes quando quiser resetar banco e imagens
- executar um shell dentro do container da API
- executar um shell dentro do container do MongoDB

Inclua explicações curtas, didáticas e objetivas para cada comando.
```

## 17. Checklist Final do Projeto

Objetivo: confirmar que o toy-example cumpre exatamente a proposta inicial.

Prompt:

```text
Faça uma auditoria final do projeto.

Verifique se:
- existe monorepo com ./api e ./web
- existem containers separados para backend, frontend, mongodb, mongo-express e storage
- backend usa Node.js com TypeScript
- frontend usa framework simples
- a página única mostra lista de livros
- livro possui título, autores, ano e imagem
- cadastro é possível via POST no Postman
- imagens são salvas em volume Docker
- storage serve as imagens
- MongoDB persiste dados em volume
- README explica como rodar e testar

Não adicione novas features. Apenas corrija inconsistências com a proposta.
```

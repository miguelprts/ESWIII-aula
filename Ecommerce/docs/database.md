# Banco de Dados da API

A API usa MongoDB com Mongoose para persistir os dados do exemplo didatico.

## Variaveis de ambiente

O arquivo `apps/api/.env.dev` define as variaveis usadas pelo container da API:

```env
MONGODB_URI=mongodb://mongodb:27017
MONGODB_DATABASE=ecommerce_dev
```

No Docker Compose, `mongodb` e o nome do servico do banco dentro da rede Docker.

## Subir o ambiente

A partir da pasta `Ecommerce`, execute:

```bash
docker compose up --build
```

## Sincronizar indices

Com os containers em execucao, execute:

```bash
docker compose exec api npm run db:migrate
```

Esse comando usa os schemas Mongoose para criar ou atualizar os indices das collections.

## Inserir dados iniciais

Com os containers em execucao, execute:

```bash
docker compose exec api npm run db:seed
```

Esse comando recria os dados iniciais de produtos, categorias, usuarios e carrinhos.

## Banco de testes BDD

Os cenarios BDD usam `MONGODB_TEST_DATABASE` quando essa variavel existir.
Se ela nao existir, usam o banco `ecommerce_test`.

Para rodar os testes BDD fora do container da API, garanta que o MongoDB esteja acessivel pelo host:

```bash
docker compose up -d mongodb
MONGODB_TEST_URI=mongodb://localhost:27277 npm run test:bdd
```

Para rodar os testes BDD dentro do container da API, informe o host interno do Compose:

```bash
docker compose exec api sh -c "MONGODB_TEST_URI=mongodb://mongodb:27017 npm run test:bdd"
```

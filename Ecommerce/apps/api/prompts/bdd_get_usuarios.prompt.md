Atue como especialista desenvolvedor full stack TypeScript.

Leia a especificação do projeto em ./Ecommerce/CONTEXT.md.

Escreva somente os testes de aceitação para usuários da api em ./Ecommerce/apps/api/, usando cumcumber e gherkin.

Conforme especificado em ./Ecommerce/CONTEXT.md, deve-se criar uma nova pasta em /api/features "usuarios". Cada .feature deve relfetir uma história de usuário e vários cenários possíveis. Veja o exemplo de catálogo de proudutos

Feature: Catálogo de Produtos

Como visitante do e-commerce
Quero visualizar a lista de produtos disponíveis na loja
Para decidir o que comprar

Background:
Given existem os seguintes produtos cadastrados

Scenario: Visualizar lista de produtos
When eu envio uma requisição GET de listagem de produtos para "/produtos"
Then o status da resposta da listagem de produtos deve ser 200

Em /api/features/step-definitions, também deve criar a pasta "usuarios" e dentro desta pasta criar os .steps.ts que refletem cada .feature.

Ao final, crie um arquivo em promtps/logs, com o mesmo nome do arquivo do prompt, porém com final .log.md, cujo conteúdo deve ser considerado como um tutorial para ser replicado passo a passo o que foi feito ao executar este prompt. Por exemplo

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

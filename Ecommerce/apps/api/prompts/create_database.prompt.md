Atue como um desenvolvedor sênior especialista em DevOps, MongoDB, Mongoose, Node.js, Express, TypeScript, arquitetura em camadas e boas práticas de engenharia de software.

Objetivo geral:
Substituir todas as implementações atuais que usam dados mockados/memória em arquivos `./Ecommerce/apps/api/src/data/*.memory.ts` por persistência real em MongoDB usando Mongoose.

Contexto importante:

- O projeto já possui os arquivos Docker configurados.
- Não altere os arquivos Docker, a menos que seja absolutamente necessário.
- O foco desta tarefa é migrar a persistência da API para MongoDB com Mongoose.
- Atualize o arquivo `env.dev` com as configurações necessárias para conexão com o MongoDB.

Antes de modificar qualquer código:

1. Leia obrigatoriamente o arquivo `./Ecommerce/AGENTS.md`.
2. Analise a estrutura completa do projeto `./Ecommerce/apps/api`.
3. Identifique todas as entidades atualmente persistidas ou simuladas pelos arquivos:
   - `./Ecommerce/apps/api/src/data/*.memory.ts`
4. Identifique quais services, repositories, controllers, routes, tests ou step-definitions dependem desses arquivos de memória.
5. Preserve o comportamento externo da API sempre que possível.
6. Não remova funcionalidades existentes sem necessidade.

Tarefa principal:
Migrar a camada de persistência da API para MongoDB usando Mongoose.

Requisitos técnicos:

1. Usar `mongoose` como ODM para integração com MongoDB.
2. Criar schemas e models Mongoose para cada entidade identificada nos arquivos `*.memory.ts`.
3. Criar uma camada de repository baseada em Mongoose.
4. Evitar acoplamento direto entre controllers/services e os models do Mongoose.
5. Controllers e services não devem manipular diretamente models Mongoose.
6. Manter ou criar interfaces para os repositories, permitindo troca futura da implementação.
7. Converter `_id` do MongoDB para `id` no domínio da aplicação, caso o projeto use `id`.
8. Evitar vazar tipos específicos do Mongoose para as camadas superiores.
9. Criar mappers quando necessário.
10. Usar tipagem forte com TypeScript.
11. Não inserir credenciais reais no código.

Configuração de ambiente:

1. Atualizar o arquivo `env.dev` com as variáveis necessárias para conexão com MongoDB.
2. Usar nomes claros, por exemplo:

   MONGODB_URI=mongodb://localhost:27017
   MONGODB_DATABASE=ecommerce_dev

3. Caso a configuração Docker existente use outro host, porta, usuário, senha ou nome de serviço, adapte o `env.dev` de acordo com a configuração já existente.
4. Não alterar os arquivos Docker se eles já estiverem corretos.
5. Se for necessário alterar algum arquivo Docker, explique claramente o motivo no resumo final.

Conexão com MongoDB:

1. Criar ou atualizar um módulo de conexão com MongoDB, por exemplo:
   - `src/database/mongoose.ts`
   - ou outro caminho coerente com a arquitetura atual.
2. A conexão deve:
   - usar `MONGODB_URI`
   - usar `MONGODB_DATABASE`
   - tratar erros de conexão adequadamente
   - evitar múltiplas conexões desnecessárias
   - ser chamada no ponto adequado de inicialização da aplicação
3. A aplicação não deve iniciar corretamente sem uma conexão válida, a menos que já exista uma estratégia explícita para isso no projeto.

Schemas e Models:
Para cada entidade identificada nos arquivos `*.memory.ts`:

1. Criar um schema Mongoose.
2. Criar um model Mongoose.
3. Definir os campos obrigatórios de acordo com os dados e regras existentes.
4. Definir tipos corretos para strings, numbers, booleans, dates, arrays e referências.
5. Adicionar `timestamps: true`, salvo se houver motivo claro para não usar.
6. Criar índices para campos identificadores, campos únicos e campos frequentemente consultados.
7. Usar `collection` explicitamente no schema quando isso melhorar a clareza.
8. Evitar deixar campos essenciais como `any`.

Repositories:
Para cada entidade atualmente baseada em memória:

1. Criar ou atualizar o repository correspondente para usar Mongoose.
2. Manter os métodos públicos usados atualmente pelos services.
3. Preservar os contratos de entrada e saída sempre que possível.
4. Garantir que os services continuem trabalhando com objetos de domínio ou DTOs da aplicação, não com documentos Mongoose.
5. Criar funções de mapeamento, por exemplo:
   - `toDomain`
   - `toPersistence`
   - `toDTO`, se fizer sentido na arquitetura atual.
6. Tratar corretamente operações como:
   - criar
   - buscar por id
   - listar
   - atualizar
   - remover
   - buscar por campos específicos já usados pela aplicação

Migrations e Seeds:
Usar uma estratégia de migrations/seeds compatível com Mongoose e TypeScript.

Preferencialmente:

1. Usar um pacote de migration compatível com TypeScript e Mongoose, como `ts-migrate-mongoose`, se fizer sentido para o projeto.
2. Criar uma migration ou seed para cada entidade identificada.
3. Caso os arquivos `*.memory.ts` contenham dados iniciais importantes, migrar esses dados para seeds.
4. Separar claramente:
   - criação/preparação estrutural da collection e índices
   - inserção de dados iniciais
5. Criar scripts no `package.json`, por exemplo:
   - `db:migrate`
   - `db:rollback`, se viável
   - `db:seed`, se fizer sentido separar seed de migration
6. Documentar os comandos necessários para executar migrations e seeds.

Atenção:

- Como o MongoDB cria collections de forma dinâmica, use migrations principalmente para índices, dados iniciais e ajustes estruturais relevantes.
- Não crie migrations artificiais sem utilidade prática.
- Priorize uma solução simples e didática.

Testes:

1. Atualizar testes existentes para funcionarem com a nova persistência.
2. Se houver testes unitários que dependiam dos dados mockados, adaptar para usar mocks de repository.
3. Se houver testes de integração ou BDD, garantir preparação adequada do banco de teste.
4. Evitar que testes usem diretamente o banco de desenvolvimento.
5. Se necessário, adicionar variáveis específicas para ambiente de teste.
6. Rodar os testes disponíveis ao final.
7. Corrigir erros causados pela migração.

Arquivos de memória:

1. Antes de apagar arquivos `*.memory.ts`, verifique se não há mais referências a eles.
2. Se for melhor manter os arquivos antigos temporariamente, mova-os para uma pasta legada ou deixe claro que não são mais usados.
3. Nenhuma regra de negócio deve continuar dependendo dos arquivos `*.memory.ts`.

Critérios de aceite:

1. A API deve persistir e recuperar dados usando MongoDB com Mongoose.
2. Os arquivos `*.memory.ts` não devem mais ser usados pela aplicação.
3. Deve existir schema/model Mongoose para cada entidade necessária.
4. Deve existir repository Mongoose para cada entidade necessária.
5. Controllers e services não devem depender diretamente de models Mongoose.
6. O arquivo `env.dev` deve estar atualizado com as variáveis de conexão necessárias.
7. Os arquivos Docker não devem ser modificados, salvo necessidade justificada.
8. O projeto deve compilar sem erros TypeScript.
9. Os testes existentes devem passar ou, se algum teste não puder ser ajustado, explicar claramente o motivo.
10. A documentação mínima de uso deve ser atualizada.
11. Não deve haver credenciais reais no repositório.

Fluxo de execução esperado:

1. Ler `./Ecommerce/AGENTS.md`.
2. Mapear entidades e dependências dos arquivos `*.memory.ts`.
3. Verificar a configuração Docker já existente apenas para entender host, porta e nome do serviço MongoDB.
4. Atualizar `env.dev` com as variáveis necessárias.
5. Instalar/configurar Mongoose e pacote de migrations/seeds, se necessário.
6. Criar conexão Mongoose.
7. Criar schemas e models.
8. Criar repositories baseados em Mongoose.
9. Substituir dependências dos repositories de memória.
10. Criar migrations/seeds.
11. Atualizar scripts do `package.json`.
12. Atualizar testes.
13. Rodar build, lint e testes disponíveis.
14. Ao final, apresentar um resumo das alterações feitas, arquivos criados/modificados, comandos adicionados e comandos que devo executar.

Importante:

- Faça mudanças incrementais e seguras.
- Preserve ao máximo a arquitetura existente.
- Não refatore partes não relacionadas à persistência.
- Priorize clareza didática, pois este projeto será usado em contexto de aula.
- Sempre que houver dúvida entre uma solução muito sofisticada e uma solução simples, escolha a solução simples, desde que correta e sustentável.

Ao final, crie um arquivo em promtps/logs, com o mesmo nome do arquivo do prompt, porém com final .log.md, cujo conteúdo deve ser considerado como um tutorial para ser replicado passo a passo o que foi feito ao executar este prompt. Exemplo

- Editar arquivo `arquivo`
- Editar arquivo `arquivo`
  ...

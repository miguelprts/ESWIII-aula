Atue como um especialista em Node.js, TypeScript, Express, APIs REST, testes BDD com Gherkin/Cucumber e boas práticas de desenvolvimento backend.

Antes de realizar qualquer alteração no projeto, leia atentamente o arquivo CONTEXT.md localizado na raiz do repositório. Use esse arquivo para compreender:

- a estrutura do projeto;
- o padrão arquitetural adotado;
- os comandos disponíveis;
- as regras de negócio já definidas;
- as convenções de código do projeto.

Objetivo da tarefa:
Implementar as funcionalidades da API necessárias para que os step definitions existentes passem com sucesso.

Arquivos de referência obrigatórios:

- steps-definitions/detalhes.steps.ts
- steps-definitions/listagem.steps.ts

Instruções:

1. Leia primeiro o arquivo CONTEXT.md.

2. Depois, analise cuidadosamente os arquivos:
   - steps-definitions/detalhes.steps.ts
   - steps-definitions/listagem.steps.ts

3. Identifique, a partir dos step definitions:
   - quais endpoints a API precisa oferecer;
   - quais métodos HTTP devem ser implementados;
   - quais parâmetros de rota ou query são esperados;
   - quais formatos de resposta são esperados;
   - quais códigos de status HTTP são esperados;
   - quais dados de teste são necessários para os cenários passarem.

4. Localize a estrutura atual da API no projeto.

5. Implemente somente o necessário para fazer os testes BDD desses dois arquivos passarem.

6. Não altere os arquivos de testes BDD, arquivos `.feature` ou step definitions, a menos que exista erro evidente de sintaxe ou inconsistência grave. Caso encontre algo assim, explique antes de alterar.

7. Preserve a arquitetura existente do projeto.

8. Caso o projeto use camadas como routes, controllers, services, repositories, DTOs ou validators, respeite essa separação.

9. Evite soluções improvisadas diretamente nas rotas, exceto se o projeto ainda não possuir arquitetura definida.

10. Não remova funcionalidades existentes.

11. Não modifique comportamentos que já estejam cobertos por outros testes.

12. Use dados em memória, mocks ou estrutura já existente no projeto, conforme o padrão encontrado no CONTEXT.md e no código atual.

13. Após implementar, execute os testes relacionados aos step definitions:
    - detalhes.steps.ts
    - listagem.steps.ts

14. Caso não exista um comando específico para executar apenas esses testes, execute o comando geral de testes BDD definido no package.json.

15. Corrija os erros encontrados até que os cenários relacionados a detalhes e listagem passem.

16. Ao final, apresente um resumo objetivo contendo:
    - arquivos analisados;
    - arquivos criados ou modificados;
    - endpoints implementados;
    - comandos de teste executados;
    - resultado final dos testes.

Critérios de aceitação:

- Os step definitions em steps-definitions/detalhes.steps.ts devem passar.
- Os step definitions em steps-definitions/listagem.steps.ts devem passar.
- A API deve manter a organização arquitetural existente.
- Nenhum teste existente deve ser quebrado.
- As alterações devem ser mínimas, claras e coerentes com o projeto.

Ao final, crie um arquivo em promtps/logs, com o mesmo nome do arquivo do prompt, porém com final .log.md, cujo conteúdo deve ser considerado como um tutorial para ser replicado passo a passo o que foi feito ao executar este prompt. Exemplo

- Editar arquivo `arquivo`
- Editar arquivo `arquivo`
  ...

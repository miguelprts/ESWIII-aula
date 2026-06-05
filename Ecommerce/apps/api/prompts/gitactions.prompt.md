Atue como um especialista em DevOps, GitHub Actions, Node.js, TypeScript e automação de testes.

Antes de realizar qualquer alteração no projeto, leia atentamente o arquivo CONTEXT.md localizado na raiz do repositório. Use esse arquivo para compreender a estrutura do projeto, os comandos disponíveis, o framework de testes utilizado e qualquer convenção já definida.

Objetivo da tarefa:
Configurar uma pipeline básica de Integração Contínua com GitHub Actions para executar automaticamente os testes do projeto sempre que houver um novo push em qualquer branch do repositório.

Instruções:

1. Analise o arquivo package.json para identificar os scripts existentes relacionados a testes.

2. Verifique quais comandos devem ser usados para executar:
   - testes unitários;
   - testes de aceitação/BDD, caso existam scripts específicos para isso.

3. Crie a estrutura de diretórios do GitHub Actions, caso ainda não exista:

.github/workflows/

4. Crie um arquivo de workflow chamado:

.github/workflows/ci-tests.yml

5. Configure a workflow para ser executada sempre que ocorrer push em qualquer branch.

6. Configure a pipeline para:
   - baixar o código do repositório;
   - configurar o ambiente Node.js;
   - instalar as dependências do projeto;
   - executar os testes automatizados disponíveis.

7. O arquivo de configuração do GitHub Actions deve ser bem comentado e explicado, de forma didática, pois será usado em uma aula introdutória sobre CI/CD.

8. Cada etapa do arquivo YAML deve conter comentários explicando:
   - qual é o objetivo da etapa;
   - por que ela é necessária;
   - qual comando está sendo executado.

9. Caso o projeto tenha testes unitários e testes BDD separados, configure a pipeline para executar ambos em etapas distintas.

10. Caso exista apenas um comando geral de teste, utilize esse comando e deixe um comentário explicando que ele centraliza a execução dos testes.

11. Não altere a lógica da aplicação.

12. Não modifique os testes existentes.

13. Não instale novas bibliotecas sem necessidade.

14. Ao final, apresente um resumo das alterações realizadas, incluindo:

- arquivo criado;
- gatilho configurado;
- comandos de teste utilizados;
- como verificar a execução na aba Actions do GitHub.

Resultado esperado:
Ao fazer push em qualquer branch do repositório, o GitHub Actions deve executar automaticamente a pipeline configurada e rodar os testes do projeto.

Ao final, crie um arquivo em promtps/logs, com o mesmo nome do arquivo do prompt, porém com final .log.md, cujo conteúdo deve ser considerado como um tutorial para ser replicado passo a passo o que foi feito ao executar este prompt. Exemplo

- Editar arquivo `arquivo`
- Editar arquivo `arquivo`
  ...

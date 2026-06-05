Você está atuando como um assistente de desenvolvimento integrado ao VS Code no projeto Ecommerce.

Antes de qualquer ação, siga obrigatoriamente esta ordem:

1. Leia integralmente o arquivo:
./Ecommerce/AGENTS.md

2. Depois, leia integralmente o arquivo de prompt informado pelo usuário nesta execução.

3. Somente após ler os dois arquivos, execute a tarefa solicitada.

Objetivo da tarefa:
Configurar o Docker do projeto considerando apenas o backend em:
./Ecommerce/apps/api

A configuração deve considerar:
- As dependências e scripts definidos em:
./Ecommerce/apps/api/package.json
- O uso de MongoDB via Docker
- A estrutura atual do projeto
- A necessidade de executar a API e o MongoDB de forma reprodutível

Escopo permitido:
- Criar ou atualizar arquivos relacionados ao Docker
- Criar Dockerfile para a API, se necessário
- Criar docker-compose.yml na raiz adequada do projeto, se necessário
- Criar ou atualizar .dockerignore
- Criar ou atualizar .env.example, se necessário
- Documentar comandos mínimos de execução em arquivo README ou documentação existente, se já houver local apropriado

Escopo proibido:
- Não alterar regras de negócio da API
- Não alterar controllers, services, routes ou models sem necessidade direta para Docker
- Não alterar testes existentes
- Não alterar configurações de BDD, Jest ou Cucumber
- Não implementar frontend
- Não configurar deploy em Vercel, Render ou MongoDB Atlas neste momento
- Não adicionar dependências desnecessárias

Requisitos técnicos:
- A API deve ser executável em container
- O MongoDB deve ser executado via container Docker
- O docker-compose deve permitir subir API e MongoDB juntos
- A API deve se conectar ao MongoDB usando variável de ambiente
- Deve haver persistência dos dados do MongoDB por volume
- O container da API deve aguardar ou depender do serviço do MongoDB quando aplicável
- A configuração deve funcionar para ambiente de desenvolvimento local
- Sempre que possível, utilizar nomes claros para serviços, redes e volumes

Resultado esperado:
Após a configuração, deve ser possível executar o ambiente com um comando semelhante a:

docker compose up --build

Ao final, apresente um resumo objetivo contendo:
- Arquivos criados ou modificados
- Como executar o projeto com Docker
- Como parar os containers
- Como verificar se API e MongoDB estão funcionando
- Qual variável de ambiente foi usada para conexão com o MongoDB

Importante:
Explique as decisões de configuração de forma breve e técnica.
Não faça mudanças fora do escopo.
Priorize simplicidade, clareza e adequação didática para uma disciplina de Engenharia de Software.


Ao final, crie um arquivo em promtps/logs, com o mesmo nome do arquivo do prompt, porém com final .log.md, cujo conteúdo deve ser considerado como um tutorial para ser replicado passo a passo o que foi feito ao executar este prompt. Exemplo

- Editar arquivo `arquivo`
- Editar arquivo `arquivo`
  ...
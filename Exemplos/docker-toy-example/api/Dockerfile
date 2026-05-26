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
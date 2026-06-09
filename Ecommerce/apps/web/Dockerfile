FROM node:22-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json vite.config.ts index.html .env.dev ./
COPY src ./src

RUN npm run build

FROM nginx:1.27-alpine as production

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
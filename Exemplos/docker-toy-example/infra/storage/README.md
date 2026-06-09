# Storage

Este diretorio contem a configuracao do nginx que servira os arquivos de imagem enviados pela API.

No Docker Compose, um volume Docker nomeado deve ser montado em:

```text
/usr/share/nginx/html/uploads
```

Assim, o container `storage` apenas publica via HTTP os arquivos existentes nesse volume.

Exemplo isolado, sem Docker Compose:

```bash
docker run --rm \
  -p 8080:80 \
  -v uploads_data:/usr/share/nginx/html/uploads \
  -v ./infra/storage/nginx.conf:/etc/nginx/conf.d/default.conf:ro \
  nginx:alpine
```

Com isso, um arquivo salvo no volume como:

```text
clean-code.jpg
```

ficaria acessivel em:

```text
http://localhost:8080/uploads/clean-code.jpg
```

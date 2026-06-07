# Backend JukeBoxd - PSW Main

Este backend foi criado para o app em `psw-main` e usa MongoDB para persistir dados de usuários e avaliações.

## Instalação

1. Abra terminal em `psw-main/backend`
2. Execute `npm install`
3. Crie um arquivo `.env` com base em `.env.example`

Exemplo de `.env`:

```
MONGO_URI=mongodb://localhost:27017/jukeboxd
JWT_SECRET=uma-chave-secreta-forte
PORT=3001
CORS_ORIGIN=http://localhost:3000
```

## Execução

- `npm start` para iniciar o servidor
- `npm run dev` para usar `nodemon` durante o desenvolvimento

## Endpoints disponíveis

- `POST /api/auth/signup` — cria conta
- `POST /api/auth/login` — faz login e obtém token JWT
- `GET /api/users/me` — retorna perfil do usuário autenticado
- `PUT /api/users/me` — atualiza perfil do usuário autenticado
- `GET /api/users/me` — retorna perfil do usuário autenticado
- `PUT /api/users/me` — atualiza perfil ou senha do usuário autenticado
- `GET /api/users` — lista usuários (admin)
- `GET /api/reviews` — lista avaliações públicas
- `POST /api/reviews` — cria avaliação (protegido)
- `GET /api/reviews/:id` — consulta avaliação
- `DELETE /api/reviews/:id` — exclui avaliação do próprio autor

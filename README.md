# Módulo Engajamento · Avaliação de Produto

Next.js 16 (App Router) + Supabase, hospedado na Vercel. As funcionalidades nascem de specs em
[`specs/`](specs/); a stack está em [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

## Rodar

```bash
bun install
cp .env.example .env.local   # preencha SUPABASE_URL e SUPABASE_SECRET_KEY
bun dev                      # http://localhost:3000 → /auth/sign-up
```

O banco precisa da migração de [`supabase/migrations/`](supabase/migrations/): cole o SQL no
SQL Editor do projeto no Supabase, ou rode `npx supabase db push` com o projeto vinculado.

## Scripts

| comando | o que faz |
|---|---|
| `bun dev` | servidor de desenvolvimento |
| `bun test` | testes da API (sem banco: usam um repositório em memória) |
| `bun run typecheck` | tipos do Next + `tsc` |
| `bun run lint` | Biome (lint + formatação) |
| `bun run build` | build de produção |

## Rotas

| rota | o quê |
|---|---|
| `/auth/sign-up` | criação de conta |
| `/auth/sign-up/success` | conta criada |
| `POST /api/v1/sign-up` | `201` criada · `400` dados inválidos · `409` email já cadastrado |

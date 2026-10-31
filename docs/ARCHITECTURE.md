# Arquitetura do Projeto

## Front-End
Vamos utilizar as seguintes bibliotecas principais:
- TypeScript: linguagem principal de desenvolvimento com tipagem
- Next.js: Framework para criação e gestão de interfaces + APIs
- React.js: Biblioteca para criação e componenticação de interfaces
- Biome: Validação formatação correcao de codigo (lint)
- TailwindCSS: Estilização
- Date-FNS: Manipulação de data/hora
- Shadcn: Componenticação base (design system)
- React Query: Criação e gestão de queries para ler dados da API e mutations para alterar dados
- React-Hook-Form + Zod: Formulários e validação (o mesmo schema Zod valida o formulário e a API)

## Back-End
Vamos utilizar as seguintes bibliotecas principais:
- Typescript: Linguagem principalmente de desenvolvimento com tipagem
- Next.js: Framework para criação de APIs
- bcryptjs: Geração de salt + hash da senha (o salt fica embutido no próprio hash)
- Mastra.AI: Criação e customização de agentes internos

## Banco de dados
Supabase: PostgreSQL

## Infraestrutura
Vercel: Hospedar tanto o servidor (API) quanto o cliente (SPA)

## Automação
N8N: Criação de fluxos automatizados
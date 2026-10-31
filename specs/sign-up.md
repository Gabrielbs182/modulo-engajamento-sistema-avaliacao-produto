# Sign-Up (Criação de conta)

## Escopo
TODO

## Contexto
- Primeiro nome
- Sobrenome
- Email
- Senha
- Confirmação de senha

## Requisitos funcionais
1. Precisamos adicionar validação no formulário na camada de cliente
   1. Caso o formulário esteja válido podemos enviar a requisição para a API
2. Os campos de nome e sobrenome devem ser separados
3. Precisamos criar uma nova conta no banco de dados na tabela de `accounts`
   1. `id`: nanoid (gerado com `nanoid` na camada de API)
   2. `first_name`: text
   3. `last_name`: text
   4. `created_at`: timestamp
   5. `updated_at`: timestamp
   6. `active`: boolean
   7. `email`: text (único, sem diferenciar maiúscula)
   8. `password`: text (hash bcryptjs)
   - ~~`salt`~~: removida em 30/10/2026 — o hash do bcrypt já carrega o salt (`$2b$<custo>$<salt><hash>`)
4. A requisição deve ser um `POST` para `/api/v1/sign-up` e receber os dados como JSON no `body`
   (`firstName`, `lastName`, `email`, `password`; a confirmação de senha fica só no formulário)
5. Caso tudo dê certo retornar `201` ou erros de acordo com a validação:
   1. `400`: Má formatação de dados
   2. `409`: Email já cadastrado
6. Senha: mínimo de 8 caracteres e máximo de 72 bytes (limite do bcrypt), sem exigir tipos de caractere
7. A conta nasce ativa (`active = true`)

## Requisitos não funcionais
- Segurança: Precisamos salvar as senhas de forma segura no banco de dados
  - Precisamos receber os dados do cliente de forma segura usando HTTPS (para prevenir network sniff)
- UI/UX: Boa experiência de uso através de uma interface bonita, elegante, moderna
- Performance: O processo de criação de conta precisa ser rápido

## Você deve
- Criar a base do projeto com um endpoint inicial para criação de conta
- Criar a base do projeto com uma página inicial para a interface de criação de conta
- Configurar as bibliotecas base

## Você não deve
- Implementar qualquer outra funcionalidade que não esteja relacionada com sign-up (criação de contas).
- Não vamos realizar nenhum envio de email no momento, apenas processar a requisição, salvar no banco de dados e tornar um suceso.

## Tecnologias (Stack)
React.js, Next.js, React-Hook-Form, Zod, React Query, Shadcn, Tailwind, Supabase, bcryptjs, Bun

tRPC fica fora desta entrega (decisão de 30/10/2026): a API é uma rota REST do Next, chamada com React Query.

## Critérios de aceitação
- Temos uma página para criar a nova conta em `/auth/sign-up`
- A página contém um formulário com validação
- A plataforma consegue se comunicar com a API para enviar os dados e receber uma resposta
- Estamos informando possíveis erros
  - Mostrar um alert em vermelho no formulário
- Estamos informando o sucesso de criação da conta:
  - Navegar para `/auth/sign-up/success`

## Resultado
Pessoas conseguem criar uma nova conta na plataforma.

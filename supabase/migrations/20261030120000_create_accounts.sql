-- MESA-1: contas criadas pelo sign-up (specs/sign-up.md).
-- Sem coluna salt: o hash do bcrypt já carrega o salt ($2b$<custo>$<salt><hash>).

create table public.accounts (
  id text primary key,                 -- nanoid gerado na API
  first_name text not null,
  last_name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  active boolean not null default true,
  email text not null,
  password text not null               -- hash bcrypt, nunca a senha
);

-- Email único sem diferenciar maiúscula; a API grava em minúsculas, o índice garante
-- mesmo se outra escrita não normalizar.
create unique index accounts_email_lower_key on public.accounts (lower(email));

-- Só o servidor (chave secreta, que ignora o RLS) lê e escreve. RLS ligado sem política
-- fecha a tabela para as chaves públicas; o revoke tira até a permissão de tentar.
alter table public.accounts enable row level security;
revoke all on table public.accounts from anon, authenticated;

create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger accounts_set_updated_at
before update on public.accounts
for each row execute function public.set_updated_at();

# BarberPro funcional — instalação

Este pacote parte do código real do repositório `barberpro-saas` e preserva as integrações existentes com Supabase.

## Antes de substituir

Faça uma cópia do projeto atual, principalmente das alterações locais ainda não commitadas.

## Instalação

1. Extraia o ZIP em uma pasta nova.
2. Copie o seu arquivo `.env.local` para a raiz desta versão.
3. Execute `npm ci`.
4. Execute `npm test`.
5. Execute `npm run build`.
6. Rode `npm run dev` e valide uma conta real.

## Validação obrigatória com conta real

- Cadastro e confirmação de e-mail.
- Login de usuário sem barbearia redirecionando para `/onboarding`.
- Criação da barbearia.
- Criação do primeiro serviço vinculado ao proprietário.
- Gravação do expediente de segunda a sexta.
- Entrada no dashboard.
- Novo agendamento pela agenda.
- Logout no desktop e no mobile.

## Banco de dados

O pacote não aplica migrations automaticamente. As migrations `001` a `012` continuam em `supabase/migrations` e devem corresponder ao schema do Supabase configurado.

## O que foi atualizado

- Dashboard premium responsivo com dados reais.
- Shell com nome, cargo e barbearia reais.
- Logout real no desktop e no mobile.
- Login decide entre onboarding e dashboard.
- Cadastro informa quando é necessário confirmar e-mail.
- Primeiro serviço é vinculado ao proprietário.
- Jornada inicial é salva em `work_schedules`.
- Empty states para conta nova.

# BarberPro — status atual

Última atualização: 2026-08-09

## Estado do produto

O BarberPro é um SaaS Next.js para gestão de barbearias, com Supabase como backend. O núcleo de dados, RLS e booking engine existentes estão preservados. O foco atual é fechar o fluxo de produto para uma pessoa comum: cadastro, onboarding, operação diária e logout.

## O que está funcionando

- Login com ações claras de entrar e criar conta.
- Usuário autenticado sem `shop_members` é direcionado ao onboarding.
- Usuário com barbearia é direcionado ao dashboard.
- Onboarding cria a barbearia via RPC existente.
- Primeiro serviço é criado e vinculado ao proprietário.
- Jornada inicial é salva em `work_schedules`.
- Logout encerra a sessão e redireciona para `/login`.
- Sidebar desktop e navegação mobile com perfil, cargo e logout.
- Dashboard, agenda, equipe, serviços, clientes, relatórios e configurações usam dados reais e empty states orientados à ação.
- Página pública de agendamento mantém fluxo sem autenticação.

## Validações recentes

- `npm test`: OK
- `npm run typecheck`: OK
- `npm run build`: OK
- Rotas sem sessão: `/login` responde 200; áreas privadas redirecionam para `/login`.
- `/api/health` respondeu 200 no deploy Vercel anterior quando executado fora do sandbox.

## Ainda pendente

- Executar cadastro real com e-mail de staging.
- Confirmar onboarding real no Supabase com uma sessão autenticada.
- Confirmar logout real e login subsequente.
- Fazer QA visual autenticado em desktop e mobile.
- Revisar o produto no Vercel antes de novo deploy.

## Higiene e invariantes

- Não criar novas versões numeradas de documentação.
- Não alterar migrations 001–012 sem bug real que impeça o produto.
- Não alterar RLS ou booking engine nesta fase.
- Logs, caches e artefatos de build ficam ignorados e fora da raiz do projeto.

## Commits relevantes

- `715ea73` — Polish BarberPro product UI
- `d7972e6` — Harden Supabase runtime handling
- `a8aac9e` — Initial BarberPro SaaS V13


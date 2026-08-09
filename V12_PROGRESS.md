# BarberPro V12 — Production QA / hardening

## Feito
- Reschedule agora reaproveita o booking engine autoritativo em uma única transação.
- Reagendamento mantém o preço originalmente combinado.
- Validação server-side de nome, telefone e e-mail no fluxo público.
- Health check não expõe nomes/estado de secrets.
- Helper central de variáveis de ambiente.
- Páginas profissionais de loading, error e 404.
- SQL de invariantes do banco para staging/CI.
- Source-integrity tests para garantir que proteções críticas não sumam em refactors.
- Novo polish de loading/erro/mobile.

## Resultado do ambiente atual
O registry npm disponível neste ambiente retorna 404 inclusive para `next`, `react`,
`typescript` e `@supabase/supabase-js`. Portanto `npm install`, `typecheck` e `next build`
não podem ser validados aqui de forma honesta.

Isso é uma limitação do ambiente de execução, não um resultado verde do projeto.
O pacote inclui comandos para rodar essas validações numa máquina/Vercel com registry npm normal.

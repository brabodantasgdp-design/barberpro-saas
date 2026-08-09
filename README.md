# BarberPro SaaS Starter

Agora não é mais apenas o HTML do protótipo: esta pasta inicia a base real em Next.js/TypeScript + Supabase/PostgreSQL.

## Incluído
- dashboard premium responsivo
- rotas de agenda, equipe e clientes
- página pública `/agendar/[slug]`
- shell desktop/mobile
- schema PostgreSQL multi-tenant
- papéis owner/partner/manager/barber/reception
- serviços, jornada, bloqueios, clientes e agendamentos
- estrutura inicial de API
- documentação das regras críticas

## Rodar local
1. copie `.env.example` para `.env.local`
2. preencha as chaves do Supabase
3. `npm install`
4. `npm run dev`

## Banco
Rode `supabase/migrations/001_init.sql` em um projeto Supabase de desenvolvimento.

## Ainda não está pronto para produção
Faltam autenticação completa, RLS por papel, RPC transacional de booking, storage de fotos, CRUDs reais, notificações, testes e pagamentos. A base foi deixada preparada para essas etapas em vez de fingir que já estão resolvidas.


## V2
Veja `V2_PROGRESS.md` e `supabase/migrations/002_booking_engine.sql`.

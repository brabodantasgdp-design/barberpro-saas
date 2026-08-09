# BarberPro V2 — progresso

## Implementado nesta etapa
- RBAC em código para Owner/Partner/Manager/Barber/Reception
- helpers SQL de autorização multi-tenant
- proteção PostgreSQL contra reservas sobrepostas
- proteção contra bloqueios sobrepostos
- RPC `book_appointment`
- validação de serviço/profissional
- validação da jornada
- validação de bloqueios
- duração + buffer do serviço
- tratamento de concorrência: duas pessoas tentando o mesmo horário
- endpoint POST de booking chamando a transação do banco
- contrato inicial do endpoint de disponibilidade

## Próxima fatia
1. autenticação Supabase SSR
2. onboarding da barbearia
3. CRUD real de equipe/serviços/jornadas
4. gerador de slots de disponibilidade
5. fluxo público completo serviço → profissional → data → horário → cliente → confirmação
6. upload de logo/foto em Supabase Storage
7. testes automatizados de concorrência e permissões

## Regra arquitetural
A UI pode sugerir disponibilidade, mas o PostgreSQL é a autoridade final. Isso evita overbooking mesmo com duas requisições simultâneas.

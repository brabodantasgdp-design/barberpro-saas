# BarberPro — arquitetura V1

## Produto
SaaS multi-tenant. Uma instalação atende várias barbearias com isolamento por `shop_id`.

## Papéis
- owner: tudo
- partner: operação + financeiro conforme permissão
- manager: equipe/agenda/clientes
- barber: própria agenda, produção, comissão, clientes permitidos
- reception: agenda geral + clientes

## Regras críticas
1. O frontend nunca decide sozinho se um horário está livre.
2. Reserva é confirmada no PostgreSQL por operação transacional.
3. Duração = serviço + buffer.
4. Horário válido respeita jornada, pausa, folga, bloqueios e reservas.
5. Funcionário pode bloquear tempo; por usuário pode ser livre ou exigir aprovação.
6. Funcionário vê produção e comissão próprias.
7. Alteração de jornada que colida com reservas existentes exige tratamento explícito.
8. Fotos ficam em storage; banco guarda URL.
9. Toda tabela operacional carrega tenant direta ou indiretamente.
10. RLS protege acesso entre barbearias.

## Deploy
Agora: Vercel + Supabase.
Depois: Next.js em Docker + PostgreSQL/Redis/worker em VPS sem mudar a regra de negócio.

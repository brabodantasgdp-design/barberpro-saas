# Booking Engine Test Plan

## Concorrência
- duas requisições simultâneas para o mesmo staff/slot: exatamente uma deve confirmar
- slot adjacente não pode colidir com duration + buffer

## Jornada
- antes da abertura: rejeita
- depois do fechamento: rejeita
- serviço que começa dentro mas termina fora: rejeita
- dia de folga: rejeita

## Bloqueios
- approved: remove slot
- pending: ainda não remove slot
- rejected: não remove slot

## Permissões
- barbeiro vê própria produção
- barbeiro não edita comissão
- manager edita jornada
- recepção não vê financeiro global
- owner/partner aprovam bloqueios

## Multi-tenant
- usuário da barbearia A não lê/escreve dados da B
- IDs válidos de outro tenant não podem furar RLS

## Público
- cliente não precisa de conta
- serviço inativo não agenda
- profissional não habilitado não agenda
- slot tomado entre consulta e confirmação retorna TIME_ALREADY_BOOKED

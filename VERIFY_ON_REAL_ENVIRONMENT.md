# Verificação em ambiente real

Execute numa máquina com Node 20+ e acesso normal ao npm:

```bash
npm install
npm test
npm run typecheck
npm run build
```

Depois conecte um Supabase de STAGING vazio e aplique as migrations em ordem.

Obrigatório antes de produção:
1. migrations 001 → 011 sem erro;
2. `supabase/tests/booking_invariants.sql`;
3. auditoria RLS entre dois tenants;
4. teste simultâneo do mesmo slot;
5. signup → onboarding → booking público → atendimento → relatório;
6. upload de fotos;
7. convite de funcionário;
8. reagendamento/cancelamento;
9. teste em Android/iPhone e desktop.

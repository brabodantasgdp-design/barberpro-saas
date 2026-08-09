# BarberPro V6 — tiro pesado

Implementado nesta etapa:
- Dashboard passou a ler atendimentos reais do banco.
- KPIs reais: faturamento, atendimentos, ticket médio, concluídos e no-show.
- Produção por funcionário.
- Editor de jornada semanal.
- API segura para substituir jornada do funcionário.
- Área de pedidos de bloqueio pendentes.
- API para editar comissão, papel e permissões de bloqueio.
- Página de configurações/branding.
- Navegação real para Configurações.
- Fundação de audit log para registrar ações administrativas.
- Restrições adicionais de integridade no PostgreSQL.

Próximas pancadas:
1. ligar botões Aprovar/Recusar à API;
2. editor visual completo de funcionário;
3. seleção de funcionário na jornada;
4. onboarding guiado serviços → equipe → jornada → publicar;
5. notificações;
6. testes automáticos de concorrência, permissões e disponibilidade;
7. refinamento visual final desktop/mobile.

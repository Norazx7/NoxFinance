# Requisitos — NOX FINANCE

## Requisitos funcionais

| ID | Requisito | Status |
|----|-----------|--------|
| RF01 | Cadastro de usuário | Implementado |
| RF02 | Login com autenticação JWT | Implementado |
| RF03 | Refresh token e logout | Implementado |
| RF04 | Recuperação de senha | Implementado (token acadêmico na API) |
| RF05 | Perfil do usuário autenticado | Implementado |
| RF06 | CRUD de contas | Implementado |
| RF07 | CRUD de cartões com limites | Implementado |
| RF08 | Categorias personalizadas + padrão | Implementado |
| RF09 | CRUD de receitas e despesas | Implementado |
| RF10 | Histórico com filtros (período/categoria/tipo) | Implementado |
| RF11 | Orçamentos mensais e limites por categoria | Implementado |
| RF12 | Metas financeiras com progresso | Implementado |
| RF13 | Despesas recorrentes | Implementado |
| RF14 | Previsão de fluxo de caixa | Implementado |
| RF15 | Dashboard (saldo, receitas, despesas, comparação) | Implementado |
| RF16 | Relatórios por categoria, evolução e comparação | Implementado |
| RF17 | NOX AI — perguntas com fatos autorizados | Implementado |
| RF18 | NOX AI — simulação de compra sem alterar dados | Implementado |
| RF19 | Isolamento de dados por usuário | Implementado |

## Requisitos não funcionais

| ID | Requisito | Como atendido |
|----|-----------|---------------|
| RNF01 | Sem float em dinheiro | Centavos (`Int`) no banco e API |
| RNF02 | Não expor chaves de IA no app | LLM apenas no backend |
| RNF03 | Autenticação segura | bcrypt + JWT + refresh |
| RNF04 | Validação de entrada | class-validator / DTOs |
| RNF05 | API documentada | Swagger em `/api/docs` |
| RNF06 | Testes de operações financeiras | Jest (money + amountCents) |
| RNF07 | Tema escuro premium | Identidade NOX no app |
| RNF08 | Dados de exemplo identificados | Seed acadêmico fictício |

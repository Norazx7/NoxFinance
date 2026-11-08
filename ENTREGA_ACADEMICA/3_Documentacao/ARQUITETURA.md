# Arquitetura — NOX FINANCE

## Visão geral

```
[App Expo / React Native]
        |  HTTPS/JSON (JWT)
        v
[API NestJS]
   |           \
   |            \--> [NOX AI Provider: mock | ollama | openai]
   v
[PostgreSQL via Prisma]
```

## Camadas

1. **Mobile:** Expo Router, Zustand (sessão), TanStack Query (dados remotos), StyleSheet com tema escuro.
2. **API:** módulos NestJS (`auth`, `accounts`, `cards`, `categories`, `transactions`, `budgets`, `goals`, `recurring`, `dashboard`, `reports`, `ai`).
3. **Persistência:** Prisma + PostgreSQL.
4. **IA:** interface `LlmProvider` com implementações trocáveis.

## Fluxo da NOX AI

1. Usuário autentica e envia pergunta.
2. Backend agrega fatos autorizados (dashboard/relatórios/orçamento).
3. System prompt contém apenas esses fatos.
4. Provider LLM gera texto explicativo.
5. Resposta devolve `answer` + `factsUsed` + disclaimer.

Regra: a IA **não** calcula saldos, **não** executa SQL e **não** altera movimentações sem confirmação explícita no app.

## Modelo de dados (principais entidades)

- **User** — autenticação e dono dos dados
- **Account** — contas com `balanceCents`
- **Card** — cartões com `limitCents` / `usedCents`
- **Category** — categorias INCOME/EXPENSE
- **Transaction** — movimentações com `amountCents` positivo e `type`
- **Budget** + **BudgetCategoryLimit** — orçamento e limites
- **Goal** — metas com progresso
- **RecurringExpense** — despesas recorrentes
- **RefreshToken** / **PasswordResetToken** — segurança

## Decisões técnicas

| Decisão | Justificativa |
|---------|---------------|
| Centavos (`Int`) | Evitar erros de ponto flutuante |
| JWT + refresh | Sessão segura com revogação |
| Prisma | Produtividade e tipagem TypeScript |
| Expo | Entrega Android acadêmica com DX rápida |
| LLM no backend | Segurança de chaves e controle de contexto |

## Substituições / limitações de ambiente

- Em demonstração local sem LLM externo, `LLM_PROVIDER=mock` é o padrão acadêmico.
- O app pode ser executado via Expo Web para inspeção visual quando o emulador Android não estiver disponível; o alvo da disciplina permanece Android (Expo).

# Documentação da API — NOX FINANCE

Base URL local: `http://localhost:3847/api`  
Swagger interativo: `http://localhost:3847/api/docs`

Autenticação: `Authorization: Bearer <accessToken>`

Valores monetários: **inteiros em centavos**.

## Health

- `GET /health`

## Auth

- `POST /auth/register` `{ name, email, password }`
- `POST /auth/login` `{ email, password }`
- `POST /auth/refresh` `{ refreshToken }`
- `POST /auth/forgot-password` `{ email }`
- `POST /auth/reset-password` `{ token, newPassword }`
- `POST /auth/logout` `{ refreshToken }` (auth)
- `GET /auth/me` (auth)

## Contas / Cartões / Categorias

- `GET|POST /accounts`
- `GET|PATCH|DELETE /accounts/:id`
- `GET|POST /cards`
- `GET|PATCH|DELETE /cards/:id`
- `GET|POST /categories`
- `GET|PATCH|DELETE /categories/:id`

## Movimentações

- `GET /transactions?from&to&categoryId&type&accountId`
- `POST /transactions` `{ accountId, type, amountCents, description, occurredAt, categoryId?, cardId? }`
- `GET|PATCH|DELETE /transactions/:id`

## Planejamento

- `GET|POST /budgets`
- `GET|PATCH|DELETE /budgets/:id`
- `GET|POST /goals`
- `POST /goals/:id/contribute` `{ amountCents }`
- `GET|POST /recurring`
- `GET /recurring/forecast/cashflow?days=30`

## Dashboard / Relatórios

- `GET /dashboard?year&month`
- `GET /reports/expenses-by-category?year&month`
- `GET /reports/monthly-evolution?months=6`
- `GET /reports/compare?yearA&monthA&yearB&monthB`

## NOX AI

- `GET /ai/status`
- `POST /ai/ask` `{ question }`
- `POST /ai/simulate` `{ description, amountCents, categoryName? }`

A resposta de `ask`/`simulate` inclui os fatos calculados pelo backend e um disclaimer explícito.

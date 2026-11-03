# NOX FINANCE API

API REST NestJS + Prisma + PostgreSQL do projeto acadêmico NOX FINANCE.

- Porta padrão: `3847`
- Prefixo: `/api`
- Swagger: `/api/docs`
- Valores monetários em centavos (`Int`)

```bash
cp .env.example .env
npm install
npx prisma migrate dev
npm run seed
npm run start:dev
```

Conta demo: `demo@noxfinance.app` / `Demo1234` (dados fictícios).

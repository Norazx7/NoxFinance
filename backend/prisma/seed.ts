import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

/**
 * Dados fictícios de demonstração acadêmica — NÃO são dados reais de terceiros.
 */
const prisma = new PrismaClient();

async function main() {
  const email = 'demo@noxfinance.app';
  await prisma.refreshToken.deleteMany({});
  await prisma.passwordResetToken.deleteMany({});
  await prisma.transaction.deleteMany({});
  await prisma.budgetCategoryLimit.deleteMany({});
  await prisma.budget.deleteMany({});
  await prisma.goal.deleteMany({});
  await prisma.recurringExpense.deleteMany({});
  await prisma.card.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.account.deleteMany({});
  await prisma.user.deleteMany({ where: { email } });

  const passwordHash = await bcrypt.hash('Demo1234', 12);
  const user = await prisma.user.create({
    data: {
      name: 'Usuário Demonstração',
      email,
      passwordHash,
    },
  });

  const categories = await Promise.all(
    [
      { name: 'Salário', kind: 'INCOME' as const, color: '#10B981' },
      { name: 'Freelance', kind: 'INCOME' as const, color: '#34D399' },
      { name: 'Moradia', kind: 'EXPENSE' as const, color: '#EF4444' },
      { name: 'Alimentação', kind: 'EXPENSE' as const, color: '#F59E0B' },
      { name: 'Transporte', kind: 'EXPENSE' as const, color: '#3B82F6' },
      { name: 'Lazer', kind: 'EXPENSE' as const, color: '#8B5CF6' },
      { name: 'Saúde', kind: 'EXPENSE' as const, color: '#EC4899' },
      { name: 'Educação', kind: 'EXPENSE' as const, color: '#06B6D4' },
    ].map((c) =>
      prisma.category.create({
        data: { ...c, userId: user.id, isSystem: true },
      }),
    ),
  );

  const byName = Object.fromEntries(categories.map((c) => [c.name, c]));

  const checking = await prisma.account.create({
    data: {
      userId: user.id,
      name: 'Conta Corrente',
      type: 'CHECKING',
      balanceCents: 0,
      color: '#10B981',
    },
  });

  const savings = await prisma.account.create({
    data: {
      userId: user.id,
      name: 'Poupança',
      type: 'SAVINGS',
      balanceCents: 0,
      color: '#34D399',
    },
  });

  const card = await prisma.card.create({
    data: {
      userId: user.id,
      accountId: checking.id,
      name: 'Cartão NOX',
      type: 'CREDIT',
      lastFourDigits: '4242',
      limitCents: 500000,
      usedCents: 0,
      closingDay: 10,
      dueDay: 17,
    },
  });

  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();

  const txs: Array<{
    type: 'INCOME' | 'EXPENSE';
    amountCents: number;
    description: string;
    category: string;
    day: number;
    accountId: string;
    cardId?: string;
    monthOffset?: number;
  }> = [
    {
      type: 'INCOME',
      amountCents: 650000,
      description: 'Salário mensal (exemplo)',
      category: 'Salário',
      day: 5,
      accountId: checking.id,
    },
    {
      type: 'INCOME',
      amountCents: 80000,
      description: 'Projeto freelance (exemplo)',
      category: 'Freelance',
      day: 18,
      accountId: checking.id,
    },
    {
      type: 'EXPENSE',
      amountCents: 180000,
      description: 'Aluguel (exemplo)',
      category: 'Moradia',
      day: 8,
      accountId: checking.id,
    },
    {
      type: 'EXPENSE',
      amountCents: 65000,
      description: 'Supermercado (exemplo)',
      category: 'Alimentação',
      day: 12,
      accountId: checking.id,
      cardId: card.id,
    },
    {
      type: 'EXPENSE',
      amountCents: 22000,
      description: 'Transporte app (exemplo)',
      category: 'Transporte',
      day: 14,
      accountId: checking.id,
    },
    {
      type: 'EXPENSE',
      amountCents: 15000,
      description: 'Cinema e lazer (exemplo)',
      category: 'Lazer',
      day: 20,
      accountId: checking.id,
      cardId: card.id,
    },
    {
      type: 'EXPENSE',
      amountCents: 12000,
      description: 'Farmácia (exemplo)',
      category: 'Saúde',
      day: 22,
      accountId: checking.id,
    },
    {
      type: 'EXPENSE',
      amountCents: 29900,
      description: 'Curso online (exemplo)',
      category: 'Educação',
      day: 16,
      accountId: checking.id,
    },
    {
      type: 'INCOME',
      amountCents: 650000,
      description: 'Salário mês anterior (exemplo)',
      category: 'Salário',
      day: 5,
      accountId: checking.id,
      monthOffset: -1,
    },
    {
      type: 'EXPENSE',
      amountCents: 175000,
      description: 'Aluguel mês anterior (exemplo)',
      category: 'Moradia',
      day: 8,
      accountId: checking.id,
      monthOffset: -1,
    },
    {
      type: 'EXPENSE',
      amountCents: 48000,
      description: 'Mercado mês anterior (exemplo)',
      category: 'Alimentação',
      day: 15,
      accountId: checking.id,
      monthOffset: -1,
    },
    {
      type: 'INCOME',
      amountCents: 200000,
      description: 'Reserva inicial (exemplo)',
      category: 'Freelance',
      day: 2,
      accountId: savings.id,
    },
  ];

  for (const t of txs) {
    const monthOffset = t.monthOffset ?? 0;
    const occurredAt = new Date(y, m + monthOffset, t.day, 12, 0, 0);
    await prisma.transaction.create({
      data: {
        userId: user.id,
        accountId: t.accountId,
        cardId: t.cardId,
        categoryId: byName[t.category].id,
        type: t.type,
        amountCents: t.amountCents,
        description: t.description,
        occurredAt,
      },
    });

    const delta = t.type === 'INCOME' ? t.amountCents : -t.amountCents;
    await prisma.account.update({
      where: { id: t.accountId },
      data: { balanceCents: { increment: delta } },
    });
    if (t.cardId && t.type === 'EXPENSE') {
      await prisma.card.update({
        where: { id: t.cardId },
        data: { usedCents: { increment: t.amountCents } },
      });
    }
  }

  await prisma.budget.create({
    data: {
      userId: user.id,
      name: 'Orçamento mensal',
      year: y,
      month: m + 1,
      limitCents: 400000,
      limits: {
        create: [
          { categoryId: byName['Alimentação'].id, limitCents: 80000 },
          { categoryId: byName['Lazer'].id, limitCents: 30000 },
          { categoryId: byName['Transporte'].id, limitCents: 40000 },
        ],
      },
    },
  });

  await prisma.goal.create({
    data: {
      userId: user.id,
      name: 'Reserva de emergência',
      description: 'Meta de exemplo — 3 meses de despesas',
      targetCents: 900000,
      currentCents: 250000,
      deadline: new Date(y + 1, 5, 1),
    },
  });

  await prisma.recurringExpense.create({
    data: {
      userId: user.id,
      name: 'Aluguel',
      amountCents: 180000,
      frequency: 'MONTHLY',
      nextDueDate: new Date(y, m + 1, 8),
      categoryId: byName['Moradia'].id,
    },
  });

  // eslint-disable-next-line no-console
  console.log('Seed concluído (dados de exemplo):');
  // eslint-disable-next-line no-console
  console.log('  email: demo@noxfinance.app');
  // eslint-disable-next-line no-console
  console.log('  senha: Demo1234');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { BadRequestException } from '@nestjs/common';
import { TransactionsService } from './transactions.service';

describe('TransactionsService amount validation', () => {
  const prismaMock = {
    account: { findFirst: jest.fn() },
    card: { findFirst: jest.fn() },
    category: { findFirst: jest.fn() },
    transaction: {
      create: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  const service = new TransactionsService(prismaMock as never);

  it('rejeita amountCents não inteiro ou <= 0', async () => {
    await expect(
      service.create('user-1', {
        accountId: 'acc',
        type: 'EXPENSE',
        amountCents: 0,
        description: 'teste',
        occurredAt: new Date().toISOString(),
      }),
    ).rejects.toBeInstanceOf(BadRequestException);

    await expect(
      service.create('user-1', {
        accountId: 'acc',
        type: 'EXPENSE',
        amountCents: 10.5 as unknown as number,
        description: 'teste',
        occurredAt: new Date().toISOString(),
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});

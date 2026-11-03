import { addCents, assertNonNegativeCents, formatBRL, fromCents, subCents, toCents } from './money';

describe('money utils', () => {
  it('converte reais para centavos sem float residual', () => {
    expect(toCents(10.1)).toBe(1010);
    expect(toCents(0.1 + 0.2)).toBe(30);
    expect(toCents('1.234,56')).toBe(123456);
  });

  it('rejeita valores inválidos', () => {
    expect(() => toCents(Number.NaN)).toThrow();
    expect(() => fromCents(10.5 as unknown as number)).toThrow();
    expect(() => assertNonNegativeCents(-1)).toThrow();
  });

  it('soma e subtrai apenas inteiros', () => {
    expect(addCents(100, 50)).toBe(150);
    expect(subCents(100, 40)).toBe(60);
  });

  it('formata BRL a partir de centavos', () => {
    expect(formatBRL(123456)).toContain('1.234,56');
  });
});

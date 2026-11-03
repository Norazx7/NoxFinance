/** Utilitários monetários — valores sempre em centavos (inteiros). */

export function toCents(reais: number | string): number {
  if (typeof reais === 'string') {
    const normalized = reais.replace(/\./g, '').replace(',', '.').trim();
    const parsed = Number(normalized);
    if (!Number.isFinite(parsed)) {
      throw new Error(`Valor monetário inválido: ${reais}`);
    }
    return Math.round(parsed * 100);
  }
  if (!Number.isFinite(reais)) {
    throw new Error(`Valor monetário inválido: ${reais}`);
  }
  return Math.round(reais * 100);
}

export function fromCents(cents: number): number {
  if (!Number.isInteger(cents)) {
    throw new Error(`Centavos devem ser inteiros: ${cents}`);
  }
  return cents / 100;
}

export function formatBRL(cents: number): string {
  return fromCents(cents).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

export function assertNonNegativeCents(cents: number, field = 'amountCents'): void {
  if (!Number.isInteger(cents) || cents < 0) {
    throw new Error(`${field} deve ser um inteiro >= 0 (centavos)`);
  }
}

export function addCents(a: number, b: number): number {
  return a + b;
}

export function subCents(a: number, b: number): number {
  return a - b;
}

export function formatBRL(cents: number): string {
  return (cents / 100).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

export function parseBRLInput(value: string): number {
  const cleaned = value.replace(/[^\d,.-]/g, '').replace(/\./g, '').replace(',', '.');
  const num = Number(cleaned);
  if (!Number.isFinite(num)) return 0;
  return Math.round(num * 100);
}

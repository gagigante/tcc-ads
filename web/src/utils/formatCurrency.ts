export function formatCurrency(integerValue: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(integerValue / 100);
};
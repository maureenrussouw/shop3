// apps/web/lib/format.ts
const CURRENCY = process.env.NEXT_PUBLIC_CURRENCY ?? "AED";
const LOCALE = process.env.NEXT_PUBLIC_LOCALE ?? "en-AE";

export function formatMoney(amount: number): string {
  return new Intl.NumberFormat(LOCALE, {
    style: "currency",
    currency: CURRENCY,
    // Most catalogues are whole numbers, and "AED 1,200" reads better than
    // "AED 1,200.00". Prices with real decimals still show them.
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Money is stored in MINOR units (cents) to avoid floating-point errors.
 * 1099 minor + USD => $10.99
 * This file is a provided primitive — you do NOT need to change it.
 */
export type Currency = 'USD' | 'EUR' | 'GBP' | 'UAH' | 'PLN';

export interface Money {
  amountMinor: number;
  currency: Currency;
}

const FRACTION_DIGITS: Record<Currency, number> = {
  USD: 2,
  EUR: 2,
  GBP: 2,
  UAH: 2,
  PLN: 2,
};

const LOCALE: Record<Currency, string> = {
  USD: 'en-US',
  EUR: 'de-DE',
  GBP: 'en-GB',
  UAH: 'uk-UA',
  PLN: 'pl-PL',
};

/** Build a Money value from a major-unit number, e.g. money(10.99, 'USD'). */
export function money(major: number, currency: Currency = 'USD'): Money {
  const factor = 10 ** FRACTION_DIGITS[currency];

  return { amountMinor: Math.round(major * factor), currency };
}

/** Convert minor units back to a major-unit number (10.99). */
export function toMajor(value: Money): number {
  return value.amountMinor / 10 ** FRACTION_DIGITS[value.currency];
}

/** Locale-aware currency string, e.g. "$10.99". */
export function formatMoney(value: Money): string {
  return new Intl.NumberFormat(LOCALE[value.currency], {
    style: 'currency',
    currency: value.currency,
  }).format(toMajor(value));
}

export const zero = (currency: Currency = 'USD'): Money => ({ amountMinor: 0, currency });

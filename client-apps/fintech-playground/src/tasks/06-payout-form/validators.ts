import { Currency } from '../../shared/domain/money';

export interface PayoutForm {
  amountMajor: number | '';
  currency: Currency;
  iban: string;
  scheduleAt: string; // yyyy-mm-dd
}

export type PayoutErrors = Partial<Record<keyof PayoutForm, string>>;

/**
 * 🎯 TODO (pure): validate the form, return a map of field -> error message.
 * Rules:
 *  - amountMajor: required, must be a number > 0 and <= 1_000_000.
 *  - iban: required; must match /^[A-Z]{2}\d{2}[A-Z0-9]{10,30}$/ (uppercase).
 *  - scheduleAt: required; must be today or in the future (compare yyyy-mm-dd).
 *  - currency: must be one of USD/EUR/GBP/UAH/PLN (already typed, but validate anyway).
 * Return {} when everything is valid.
 */
export function validatePayout(form: PayoutForm): PayoutErrors {
  // TODO: implement.
  return {};
}

import { formatMoney, Money as MoneyValue } from '../../domain/money';
import styles from './money.module.scss';

interface MoneyProps {
  value: MoneyValue;
  /** Colour negative amounts red and positive green. */
  colored?: boolean;
  className?: string;
}

export function Money({ value, colored = false, className = '' }: MoneyProps) {
  const tone = !colored ? '' : value.amountMinor < 0 ? styles.neg : styles.pos;
  return (
    <span className={`${styles.money} ${tone} ${className}`}>{formatMoney(value)}</span>
  );
}

import type { InputHTMLAttributes } from 'react';
import { forwardRef } from 'react';

import styles from './number-input.module.scss';

interface NumberInputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'onChange' | 'value'
> {
  value: number | '';
  onValueChange: (value: number | '') => void;
  invalid?: boolean;
}

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  ({ value, onValueChange, invalid = false, className = '', ...rest }, ref) => (
    <input
      className={`${styles.input} ${invalid ? styles.invalid : ''} ${className}`}
      inputMode="decimal"
      ref={ref}
      type="number"
      value={value}
      onChange={(e) => {
        const raw = e.target.value;

        onValueChange(raw === '' ? '' : Number(raw));
      }}
      {...rest}
    />
  ),
);
NumberInput.displayName = 'NumberInput';

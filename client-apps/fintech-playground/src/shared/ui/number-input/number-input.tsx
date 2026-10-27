import { forwardRef, InputHTMLAttributes } from 'react';

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
      ref={ref}
      type="number"
      inputMode="decimal"
      className={`${styles.input} ${invalid ? styles.invalid : ''} ${className}`}
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

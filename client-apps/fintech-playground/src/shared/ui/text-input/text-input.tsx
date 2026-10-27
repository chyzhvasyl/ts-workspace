import type { InputHTMLAttributes } from 'react';
import { forwardRef } from 'react';

import styles from './text-input.module.scss';

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ invalid = false, className = '', ...rest }, ref) => (
    <input
      className={`${styles.input} ${invalid ? styles.invalid : ''} ${className}`}
      ref={ref}
      {...rest}
    />
  ),
);
TextInput.displayName = 'TextInput';

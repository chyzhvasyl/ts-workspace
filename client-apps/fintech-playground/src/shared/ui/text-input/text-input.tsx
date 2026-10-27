import { forwardRef, InputHTMLAttributes } from 'react';

import styles from './text-input.module.scss';

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ invalid = false, className = '', ...rest }, ref) => (
    <input
      ref={ref}
      className={`${styles.input} ${invalid ? styles.invalid : ''} ${className}`}
      {...rest}
    />
  ),
);
TextInput.displayName = 'TextInput';

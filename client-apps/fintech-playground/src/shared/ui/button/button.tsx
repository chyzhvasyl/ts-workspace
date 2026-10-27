import { ButtonHTMLAttributes } from 'react';

import styles from './button.module.scss';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  ...rest
}: ButtonProps) {
  return (
    <button
      className={`${styles.btn} ${styles[variant]} ${styles[size]} ${className}`}
      {...rest}
    />
  );
}

import { SelectHTMLAttributes } from 'react';

import styles from './select.module.scss';

export interface SelectOption<T extends string = string> {
  value: T;
  label: string;
}

interface SelectProps<T extends string> extends Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  'onChange' | 'value'
> {
  value: T;
  options: ReadonlyArray<SelectOption<T>>;
  onValueChange: (value: T) => void;
}

export function Select<T extends string>({
  value,
  options,
  onValueChange,
  className = '',
  ...rest
}: SelectProps<T>) {
  return (
    <select
      className={`${styles.select} ${className}`}
      value={value}
      onChange={(e) => onValueChange(e.target.value as T)}
      {...rest}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

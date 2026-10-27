import type { ReactNode } from 'react';

import styles from './stat.module.scss';

interface StatProps {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
}

export function Stat({ label, value, hint }: StatProps) {
  return (
    <div className={styles.stat}>
      <span className={styles.label}>{label}</span>
      <span className={styles.value}>{value}</span>
      {hint && <span className={styles.hint}>{hint}</span>}
    </div>
  );
}

import { ReactNode } from 'react';

import styles from './status-pill.module.scss';

export type Tone = 'neutral' | 'info' | 'success' | 'warning' | 'danger';

interface StatusPillProps {
  tone?: Tone;
  children: ReactNode;
}

export function StatusPill({ tone = 'neutral', children }: StatusPillProps) {
  return <span className={`${styles.pill} ${styles[tone]}`}>{children}</span>;
}

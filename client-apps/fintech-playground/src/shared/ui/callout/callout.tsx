import type { ReactNode } from 'react';

import styles from './callout.module.scss';

type Tone = 'info' | 'success' | 'warning' | 'danger';

interface CalloutProps {
  tone?: Tone;
  title?: ReactNode;
  children: ReactNode;
}

const ICON: Record<Tone, string> = {
  info: 'ℹ️',
  success: '✅',
  warning: '⚠️',
  danger: '❌',
};

export function Callout({ tone = 'info', title, children }: CalloutProps) {
  return (
    <div className={`${styles.callout} ${styles[tone]}`}>
      <span className={styles.icon}>{ICON[tone]}</span>
      <div>
        {title && <strong className={styles.title}>{title}</strong>}
        <div className={styles.text}>{children}</div>
      </div>
    </div>
  );
}

import { useState } from 'react';

import styles from './demo-block.module.scss';

type BadgeVariant = 'danger' | 'warning' | 'success' | 'info';

interface DemoBlockProps {
  title: string;
  description: string;
  code: string;
  children: React.ReactNode;
  badge?: BadgeVariant;
  badgeText?: string;
}

const BADGE_LABELS: Record<BadgeVariant, string> = {
  danger: '❌ Проблема',
  warning: '⚠️ Обережно',
  success: '✅ Правильно',
  info: 'ℹ️ Інфо',
};

export function DemoBlock({
  title,
  description,
  code,
  children,
  badge,
  badgeText,
}: DemoBlockProps) {
  const [showCode, setShowCode] = useState(false);

  return (
    <div className={styles.block}>
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        {badge && (
          <span className={`${styles.badge} ${styles[badge]}`}>
            {badgeText ?? BADGE_LABELS[badge]}
          </span>
        )}
      </div>

      <p className={styles.description}>{description}</p>

      <div className={styles.demo}>{children}</div>

      <button className={styles.codeToggle} onClick={() => setShowCode((s) => !s)}>
        {showCode ? '▲ Сховати код' : '▼ Показати код'}
      </button>

      {showCode && (
        <pre className={styles.code}>
          <code>{code.trim()}</code>
        </pre>
      )}
    </div>
  );
}

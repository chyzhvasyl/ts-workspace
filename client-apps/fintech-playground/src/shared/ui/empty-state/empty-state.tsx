import { ReactNode } from 'react';

import styles from './empty-state.module.scss';

interface EmptyStateProps {
  icon?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
}

export function EmptyState({ icon = '📭', title, description, action }: EmptyStateProps) {
  return (
    <div className={styles.empty}>
      <span className={styles.icon}>{icon}</span>
      <h4 className={styles.title}>{title}</h4>
      {description && <p className={styles.desc}>{description}</p>}
      {action && <div className={styles.action}>{action}</div>}
    </div>
  );
}

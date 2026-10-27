import type { ReactNode } from 'react';

import styles from './task-page.module.scss';

export interface TaskMeta {
  id: string;
  order: number;
  title: string;
  difficulty: 'junior' | 'middle' | 'senior';
  concepts: string[];
  summary: string;
}

interface TaskPageProps {
  meta: TaskMeta;
  /** What to build. */
  requirements: ReactNode[];
  /** Definition of done. */
  acceptance: ReactNode[];
  /** Optional nudge toward the right React idea — not a solution. */
  hints?: ReactNode[];
  /** The interactive scaffold the user completes. */
  children: ReactNode;
}

const DIFF_TONE: Record<TaskMeta['difficulty'], string> = {
  junior: styles.junior ?? '',
  middle: styles.middle ?? '',
  senior: styles.senior ?? '',
};

export function TaskPage({
  meta,
  requirements,
  acceptance,
  hints,
  children,
}: TaskPageProps) {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.crumbs}>
          Завдання {meta.order} ·{' '}
          <span className={DIFF_TONE[meta.difficulty]}>{meta.difficulty}</span>
        </div>
        <h1 className={styles.title}>{meta.title}</h1>
        <p className={styles.summary}>{meta.summary}</p>
        <div className={styles.tags}>
          {meta.concepts.map((c) => (
            <span className={styles.tag} key={c}>
              {c}
            </span>
          ))}
        </div>
      </header>

      <div className={styles.grid}>
        <aside className={styles.spec}>
          <div className={styles.specBlock}>
            <h3>📋 Що зробити</h3>
            <ol>
              {requirements.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ol>
          </div>
          <div className={styles.specBlock}>
            <h3>✅ Критерії готовності</h3>
            <ul>
              {acceptance.map((a, i) => (
                <li key={i}>{a}</li>
              ))}
            </ul>
          </div>
          {hints && hints.length > 0 && (
            <details className={styles.hints}>
              <summary>💡 Підказки (концепт, не рішення)</summary>
              <ul>
                {hints.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
            </details>
          )}
        </aside>

        <div className={styles.work}>{children}</div>
      </div>
    </div>
  );
}

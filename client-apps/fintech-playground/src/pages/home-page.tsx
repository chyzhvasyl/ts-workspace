import { Link } from 'react-router-dom';

import { TASKS } from '../tasks/registry';
import styles from './home-page.module.scss';

const DIFF_LABEL: Record<string, string> = {
  junior: 'Junior',
  middle: 'Middle',
  senior: 'Senior',
};

export function HomePage() {
  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <span className={styles.badge}>Solidgate · Frontend Engineer prep</span>
        <h1 className={styles.title}>Fintech React Playground</h1>
        <p className={styles.subtitle}>
          8 завдань на чисту логіку React у фінтех-домені (комісії, інвойси, баланси,
          ledger). UI вже готовий — твоє завдання лише написати логіку. Відкрий завдання,
          читай ТЗ ліворуч, реалізуй <code>// TODO</code> у файлах.
        </p>
        <div className={styles.metaRow}>
          <span>⚛️ React 19</span>
          <span>·</span>
          <span>🟦 TypeScript strict</span>
          <span>·</span>
          <span>🧪 Vitest</span>
          <span>·</span>
          <Link to="/guide" className={styles.guideLink}>
            📚 Гайд до співбесіди →
          </Link>
        </div>
      </header>

      <div className={styles.grid}>
        {TASKS.map((t) => (
          <Link key={t.meta.id} to={t.path} className={styles.card}>
            <div className={styles.cardHead}>
              <span className={styles.order}>
                {String(t.meta.order).padStart(2, '0')}
              </span>
              <span className={`${styles.diff} ${styles[t.meta.difficulty]}`}>
                {DIFF_LABEL[t.meta.difficulty]}
              </span>
            </div>
            <h2 className={styles.cardTitle}>{t.meta.title}</h2>
            <p className={styles.cardDesc}>{t.meta.summary}</p>
            <div className={styles.tags}>
              {t.meta.concepts.slice(0, 3).map((c) => (
                <span key={c} className={styles.tag}>
                  {c}
                </span>
              ))}
            </div>
            <div className={styles.cardFooter}>Відкрити →</div>
          </Link>
        ))}
      </div>
    </div>
  );
}

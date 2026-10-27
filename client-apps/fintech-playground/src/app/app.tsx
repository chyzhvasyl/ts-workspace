import { NavLink, Route, Routes } from 'react-router-dom';

import { GuidePage } from '../pages/guide-page';
import { HomePage } from '../pages/home-page';
import { TASKS } from '../tasks/registry';

import { TaskErrorBoundary } from './task-error-boundary';

import styles from './app.module.scss';

export function App() {
  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <NavLink className={styles.logo} to="/">
          <span className={styles.logoIcon}>◆</span>
          <span className={styles.logoText}>Fintech Playground</span>
        </NavLink>

        <nav className={styles.nav}>
          <NavLink
            end
            className={({ isActive }) =>
              `${styles.item} ${isActive ? styles.active : ''}`
            }
            to="/"
          >
            <span className={styles.itemIcon}>🏠</span>
            <span className={styles.itemLabel}>Огляд</span>
          </NavLink>

          <div className={styles.sectionLabel}>Завдання</div>
          {TASKS.map((t) => (
            <NavLink
              className={({ isActive }) =>
                `${styles.item} ${isActive ? styles.active : ''}`
              }
              key={t.meta.id}
              to={t.path}
            >
              <span className={styles.itemNum}>
                {String(t.meta.order).padStart(2, '0')}
              </span>
              <span className={styles.itemContent}>
                <span className={styles.itemLabel}>{t.meta.title}</span>
                <span className={`${styles.itemDiff} ${styles[t.meta.difficulty]}`}>
                  {t.meta.difficulty}
                </span>
              </span>
            </NavLink>
          ))}

          <div className={styles.sectionLabel}>Підготовка</div>
          <NavLink
            className={({ isActive }) =>
              `${styles.item} ${isActive ? styles.active : ''}`
            }
            to="/guide"
          >
            <span className={styles.itemIcon}>📚</span>
            <span className={styles.itemLabel}>Гайд до співбесіди</span>
          </NavLink>
        </nav>

        <div className={styles.footer}>
          <span className={styles.footerText}>Solidgate · Finance Eng</span>
          <span className={styles.footerSub}>React 19 · TS strict</span>
        </div>
      </aside>

      <main className={styles.main}>
        <Routes>
          <Route element={<HomePage />} path="/" />
          <Route element={<GuidePage />} path="/guide" />
          {TASKS.map((t) => (
            <Route
              element={
                <TaskErrorBoundary key={t.meta.id}>
                  <t.Component />
                </TaskErrorBoundary>
              }
              key={t.meta.id}
              path={t.path}
            />
          ))}
        </Routes>
      </main>
    </div>
  );
}

export default App;

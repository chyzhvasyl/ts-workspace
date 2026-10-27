import { NavLink, Route, Routes } from 'react-router-dom';

import { ContextPage } from '../concepts/context/context-page';
import { HooksPage } from '../concepts/hooks/hooks-page';
import { RenderingPage } from '../concepts/rendering/rendering-page';
import { HomePage } from '../pages/home-page';

import styles from './app.module.scss';

const NAV_ITEMS = [
  {
    path: '/',
    label: 'Home',
    icon: '🏠',
    end: true,
  },
  {
    path: '/rendering',
    label: 'Rendering',
    icon: '⚛️',
    sub: 'Re-render, memo, keys, batching',
  },
  {
    path: '/hooks',
    label: 'Hooks',
    icon: '🪝',
    sub: 'useEffect, useRef, useMemo',
  },
  {
    path: '/context',
    label: 'Context',
    icon: '📦',
    sub: 'Re-render, split contexts',
  },
];

export function App() {
  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>⚛</span>
          <span className={styles.logoText}>React Concepts</span>
        </div>

        <nav className={styles.nav}>
          {NAV_ITEMS.map((item) => (
            <NavLink
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.navItemActive : ''}`
              }
              end={item.end}
              key={item.path}
              to={item.path}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              <span className={styles.navContent}>
                <span className={styles.navLabel}>{item.label}</span>
                {item.sub && <span className={styles.navSub}>{item.sub}</span>}
              </span>
            </NavLink>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <span className={styles.footerText}>Senior Refresher</span>
          <span className={styles.footerSub}>TypeScript · React 19</span>
        </div>
      </aside>

      <main className={styles.main}>
        <Routes>
          <Route element={<HomePage />} path="/" />
          <Route element={<RenderingPage />} path="/rendering" />
          <Route element={<HooksPage />} path="/hooks" />
          <Route element={<ContextPage />} path="/context" />
        </Routes>
      </main>
    </div>
  );
}

export default App;

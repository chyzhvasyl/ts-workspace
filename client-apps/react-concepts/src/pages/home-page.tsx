import { Link } from 'react-router-dom';

import styles from './home-page.module.scss';

const TOPICS = [
  {
    id: 'rendering',
    path: '/rendering',
    tag: 'Частина 1',
    tagColor: 'blue',
    title: 'Rendering & Reconciliation',
    description: 'Re-render, React.memo, useCallback, key prop, batching',
    items: [
      { label: 'Re-render + React.memo', badge: 'Ключова тема' },
      { label: 'key prop та списки', badge: 'Часта помилка' },
      { label: 'Batching (React 18)', badge: 'Automatic batching' },
    ],
  },
  {
    id: 'hooks',
    path: '/hooks',
    tag: 'Частина 2',
    tagColor: 'purple',
    title: 'Hooks — глибше ніж базово',
    description: 'useEffect, useRef, useMemo, stale closure і cleanup',
    items: [
      { label: 'useEffect — infinite loop & cleanup', badge: 'Найчастіша помилка' },
      { label: 'useRef — DOM та mutable values', badge: 'Два юз-кейси' },
      { label: 'useMemo — коли варто', badge: 'Оптимізація' },
      { label: 'Stale closure', badge: 'Пастка' },
    ],
  },
  {
    id: 'context',
    path: '/context',
    tag: 'Частина 3',
    tagColor: 'cyan',
    title: 'Context',
    description: 'Ре-рендер всього дерева та як його уникнути',
    items: [
      { label: 'Один великий контекст (проблема)', badge: 'Антипатерн' },
      { label: 'Розбиті контексти (рішення)', badge: 'Best Practice' },
      { label: 'Context vs Zustand vs React Query', badge: 'Таблиця' },
    ],
  },
];

export function HomePage() {
  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <span className={styles.badge}>React Senior Refresher</span>
        <h1 className={styles.title}>React Concepts</h1>
        <p className={styles.subtitle}>
          Інтерактивні демо по темах, які реально питають на Senior-співбесіді. Кожен
          приклад — живий, з кодом.
        </p>
      </div>

      <div className={styles.grid}>
        {TOPICS.map((topic) => (
          <Link key={topic.id} to={topic.path} className={styles.card}>
            <div className={styles.cardTop}>
              <span className={`${styles.tag} ${styles[`tag_${topic.tagColor}`]}`}>
                {topic.tag}
              </span>
              <h2 className={styles.cardTitle}>{topic.title}</h2>
              <p className={styles.cardDesc}>{topic.description}</p>
            </div>
            <ul className={styles.cardList}>
              {topic.items.map((item) => (
                <li key={item.label} className={styles.cardItem}>
                  <span className={styles.arrow}>›</span>
                  <span>{item.label}</span>
                  <span className={styles.itemBadge}>{item.badge}</span>
                </li>
              ))}
            </ul>
            <div className={styles.cardFooter}>Відкрити →</div>
          </Link>
        ))}
      </div>
    </div>
  );
}

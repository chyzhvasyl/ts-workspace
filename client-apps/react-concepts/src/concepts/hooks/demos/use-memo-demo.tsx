import { useMemo, useRef, useState } from 'react';

import { RenderCount } from '../../../shared/render-count/render-count';

import styles from './use-memo-demo.module.scss';

// Симуляція важкого обчислення
function heavyFilter(items: number[], query: string): number[] {
  // Штучна затримка
  const start = performance.now();

  while (performance.now() - start < 50) {
    /* busy wait */
  }

  if (!query) return items;

  return items.filter((n) => String(n).includes(query));
}

const BIG_DATASET = Array.from({ length: 200 }, (_, i) => i + 1);

export function UseMemoDemo() {
  const [query, setQuery] = useState('');
  const [unrelated, setUnrelated] = useState(0); // незалежний стейт
  const renderCountRef = useRef(0);

  renderCountRef.current++;

  // ✅ useMemo: важке обчислення запускається тільки при зміні query
  const filtered = useMemo(() => heavyFilter(BIG_DATASET, query), [query]);

  return (
    <div className={styles.root}>
      <p className={styles.hint}>
        <code>heavyFilter</code> — штучно повільна функція (~50ms). Без{' '}
        <code>useMemo</code> вона б запускалась при <em>кожному</em> рендері, включно з
        кліком «+». З <code>useMemo</code> — тільки при зміні <code>query</code>.
      </p>

      <div className={styles.controls}>
        <input
          className={styles.input}
          placeholder="Фільтр за числом..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className={styles.aside}>
          <button className={styles.btn} onClick={() => setUnrelated((c) => c + 1)}>
            Незалежний стейт: {unrelated}
          </button>
          <RenderCount label="Renders" />
        </div>
      </div>

      <div className={styles.result}>
        <span>
          Знайдено: <strong>{filtered.length}</strong> із {BIG_DATASET.length}
        </span>
        <span className={styles.resultItems}>
          {filtered.slice(0, 20).join(', ')}
          {filtered.length > 20 && '...'}
        </span>
      </div>

      <div className={styles.comparison}>
        <div className={styles.noMemo}>
          <p className={styles.colTitle}>❌ Без useMemo</p>
          <pre>{`const filtered = heavyFilter(dataset, query);
// Запускається при КОЖНОМУ рендері
// Навіть якщо query не змінилась!`}</pre>
        </div>
        <div className={styles.withMemo}>
          <p className={styles.colTitle}>✅ З useMemo</p>
          <pre>{`const filtered = useMemo(
  () => heavyFilter(dataset, query),
  [query] // тільки при зміні query
);`}</pre>
        </div>
      </div>
    </div>
  );
}

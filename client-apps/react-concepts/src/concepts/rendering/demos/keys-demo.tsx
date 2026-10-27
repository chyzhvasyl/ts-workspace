import { useState } from 'react';

import styles from './keys-demo.module.scss';

interface Item {
  id: number;
  label: string;
  color: string;
}

const COLORS = ['#fecaca', '#fed7aa', '#fef08a', '#bbf7d0', '#bfdbfe', '#e9d5ff'];

let nextId = 6;

const initialItems: Item[] = [
  { id: 1, label: 'Item A', color: COLORS[0] ?? '#fecaca' },
  { id: 2, label: 'Item B', color: COLORS[1] ?? '#fed7aa' },
  { id: 3, label: 'Item C', color: COLORS[2] ?? '#fef08a' },
  { id: 4, label: 'Item D', color: COLORS[3] ?? '#bbf7d0' },
  { id: 5, label: 'Item E', color: COLORS[4] ?? '#bfdbfe' },
];

// Окремий компонент щоб бачити mount/unmount
function ListItem({ label, color }: { label: string; color: string }) {
  return (
    <div className={styles.item} style={{ background: color }}>
      {label}
    </div>
  );
}

export function KeysDemo() {
  const [items, setItems] = useState<Item[]>(initialItems);

  const addFirst = () => {
    const newItem: Item = {
      id: nextId++,
      label: `Item NEW`,
      color: COLORS[nextId % COLORS.length] ?? '#fecaca',
    };
    setItems((prev) => [newItem, ...prev]);
  };

  const removeFirst = () => {
    setItems((prev) => prev.slice(1));
  };

  const reset = () => {
    nextId = 6;
    setItems(initialItems);
  };

  return (
    <div className={styles.root}>
      <div className={styles.controls}>
        <button onClick={addFirst}>➕ Додати на початок</button>
        <button onClick={removeFirst}>➖ Видалити перший</button>
        <button onClick={reset}>🔄 Reset</button>
      </div>

      <div className={styles.grid}>
        <div>
          <div className={styles.colHeader}>
            <span className={styles.bad}>❌ key=index</span>
            <span className={styles.hint}>
              При додаванні/видаленні React перерендерить <em>всі</em> елементи
            </span>
          </div>
          <div className={styles.list}>
            {items.map((item, i) => (
              <ListItem key={i} label={item.label} color={item.color} />
            ))}
          </div>
          <pre className={styles.code}>
            {`{items.map((item, i) =>\n  <ListItem key={i} ... />)}`}
          </pre>
        </div>

        <div>
          <div className={styles.colHeader}>
            <span className={styles.good}>✅ key=item.id</span>
            <span className={styles.hint}>React точно знає які елементи змінились</span>
          </div>
          <div className={styles.list}>
            {items.map((item) => (
              <ListItem key={item.id} label={item.label} color={item.color} />
            ))}
          </div>
          <pre className={styles.code}>
            {`{items.map((item) =>\n  <ListItem key={item.id} ... />)}`}
          </pre>
        </div>
      </div>

      <div className={styles.info}>
        💡 Відкрий React DevTools і увімкни «Highlight updates» — побачиш різницю наочно
      </div>
    </div>
  );
}

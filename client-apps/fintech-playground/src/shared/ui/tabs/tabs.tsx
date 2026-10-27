import styles from './tabs.module.scss';

export interface TabItem<T extends string> {
  value: T;
  label: string;
}

interface TabsProps<T extends string> {
  items: ReadonlyArray<TabItem<T>>;
  value: T;
  onValueChange: (value: T) => void;
}

export function Tabs<T extends string>({ items, value, onValueChange }: TabsProps<T>) {
  return (
    <div className={styles.tabs} role="tablist">
      {items.map((it) => (
        <button
          aria-selected={it.value === value}
          className={`${styles.tab} ${it.value === value ? styles.active : ''}`}
          key={it.value}
          role="tab"
          onClick={() => onValueChange(it.value)}
        >
          {it.label}
        </button>
      ))}
    </div>
  );
}

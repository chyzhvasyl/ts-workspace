import { memo, useCallback, useState } from 'react';

import { RenderCount } from '../../../shared/render-count/render-count';

import styles from './re-render-demo.module.scss';

// ─── Child без memo ────────────────────────────────────────────────────────────
function ChildNoMemo({ name }: { name: string }) {
  return (
    <div className={styles.child}>
      <span>👤 {name}</span>
      <RenderCount label="ChildNoMemo" />
    </div>
  );
}

// ─── Child з memo ─────────────────────────────────────────────────────────────
const ChildMemo = memo(function ChildMemo({ name }: { name: string }) {
  return (
    <div className={styles.child}>
      <span>👤 {name}</span>
      <RenderCount label="ChildMemo" />
    </div>
  );
});

// ─── Child з memo + функція пропс ─────────────────────────────────────────────
const ChildMemoWithFn = memo(function ChildMemoWithFn({
  name,
  onClick,
}: {
  name: string;
  onClick: () => void;
}) {
  return (
    <div className={styles.child}>
      <button onClick={onClick}>Click {name}</button>
      <RenderCount label="ChildMemoWithFn" />
    </div>
  );
});

// ─── Demo Component ────────────────────────────────────────────────────────────
export function ReRenderDemo() {
  const [count, setCount] = useState(0);
  // ❌ Новий об'єкт функції на кожен рендер → memo не допомагає
  // eslint-disable-next-line no-console -- demo output: the click handler only logs
  const handleClickBad = () => console.log('bad click');
  // ✅ Стабільне посилання
  // eslint-disable-next-line no-console -- demo output: the click handler only logs
  const handleClickGood = useCallback(() => console.log('good click'), []);

  return (
    <div className={styles.root}>
      <div className={styles.parentBox}>
        <strong>Parent</strong>
        <RenderCount label="Parent" />
        <button className={styles.btn} onClick={() => setCount((c) => c + 1)}>
          Клікни мене ({count})
        </button>
      </div>

      <div className={styles.grid}>
        <div className={styles.col}>
          <p className={styles.colLabel}>❌ Без memo</p>
          <p className={styles.colHint}>Ре-рендериться разом з Parent завжди</p>
          <ChildNoMemo name="Vasyl" />
        </div>

        <div className={styles.col}>
          <p className={styles.colLabel}>✅ З React.memo</p>
          <p className={styles.colHint}>Props стабільні → пропускає рендер</p>
          <ChildMemo name="Vasyl" />
        </div>

        <div className={styles.col}>
          <p className={styles.colLabel}>❌ memo + нова функція</p>
          <p className={styles.colHint}>onClick — новий об&apos;єкт → memo марний</p>
          <ChildMemoWithFn name="bad" onClick={handleClickBad} />
        </div>

        <div className={styles.col}>
          <p className={styles.colLabel}>✅ memo + useCallback</p>
          <p className={styles.colHint}>Стабільне посилання → memo працює</p>
          <ChildMemoWithFn name="good" onClick={handleClickGood} />
        </div>
      </div>
    </div>
  );
}

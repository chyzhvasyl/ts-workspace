import { useRef, useState } from 'react';

import { RenderCount } from '../../../shared/render-count/render-count';

import styles from './batching-demo.module.scss';

export function BatchingDemo() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('Vasyl');
  const [loading, setLoading] = useState(false);
  const renderRef = useRef(0);

  renderRef.current++;

  const handleBatched = () => {
    // React 18: automatic batching — один рендер для всіх трьох
    setCount((c) => c + 1);
    setName((n) => (n === 'Vasyl' ? 'Олег' : 'Vasyl'));
    setLoading((l) => !l);
  };

  const handleUnbatched = () => {
    // React 18: навіть в setTimeout — теж один рендер (automatic batching)
    // До React 18 тут було б 3 окремих рендери
    setTimeout(() => {
      setCount((c) => c + 1);
      setName((n) => (n === 'Vasyl' ? 'Олег' : 'Vasyl'));
      setLoading((l) => !l);
    }, 0);
  };

  return (
    <div className={styles.root}>
      <div className={styles.state}>
        <div className={styles.stateBox}>
          <span className={styles.stateLabel}>count</span>
          <span className={styles.stateValue}>{count}</span>
        </div>
        <div className={styles.stateBox}>
          <span className={styles.stateLabel}>name</span>
          <span className={styles.stateValue}>{name}</span>
        </div>
        <div className={styles.stateBox}>
          <span className={styles.stateLabel}>loading</span>
          <span className={styles.stateValue}>{loading ? 'true' : 'false'}</span>
        </div>
        <RenderCount label="Renders" />
      </div>

      <div className={styles.buttons}>
        <div>
          <button className={styles.btnPrimary} onClick={handleBatched}>
            🔀 Event handler
          </button>
          <p className={styles.btnHint}>
            3 setState → <strong>1 рендер</strong>
          </p>
        </div>
        <div>
          <button className={styles.btnSecondary} onClick={handleUnbatched}>
            ⏱ setTimeout
          </button>
          <p className={styles.btnHint}>
            React 18: теж <strong>1 рендер</strong> (automatic batching!)
          </p>
        </div>
      </div>

      <div className={styles.callout}>
        <strong>React 18 Automatic Batching:</strong> групує setState навіть в{' '}
        <code>setTimeout</code>, <code>Promise</code>, <code>fetch callbacks</code> — не
        тільки в event handlers. Раніше це давало 3 окремих рендери.
      </div>
    </div>
  );
}

import { useCallback, useEffect, useRef, useState } from 'react';

import styles from './stale-closure-demo.module.scss';

export function StaleClosureDemo() {
  const [count, setCount] = useState(0);
  const [logBad, setLogBad] = useState<string[]>([]);
  const [logGood, setLogGood] = useState<string[]>([]);

  // ─── Проблема: stale closure ───────────────────────────────────────────────
  // count тут замкнутий в момент створення callback

  const handleBad = useCallback(() => {
    // count тут завжди 0 (або значення при першому render)
    // бо deps масив порожній — callback не перестворюється!
    setLogBad((prev) => [
      ...prev.slice(-4),
      `setCount(${count} + 1) = ${count + 1} ← stale!`,
    ]);
    setCount(count + 1);
  }, []); // ← порожній deps: count завжди буде 0 всередині

  // ─── Правильно: functional update ─────────────────────────────────────────
  const handleGood = useCallback(() => {
    setCount((prev) => {
      const next = prev + 1;

      setLogGood((l) => [...l.slice(-4), `prev=${prev} → next=${next} ✓`]);

      return next;
    });
  }, []); // deps пустий — і це правильно, бо не використовуємо count напряму

  return (
    <div className={styles.root}>
      <div className={styles.counter}>
        <span className={styles.countLabel}>Поточний count:</span>
        <span className={styles.countValue}>{count}</span>
      </div>

      <div className={styles.grid}>
        <div className={styles.col}>
          <p className={styles.colTitle}>❌ Stale closure</p>
          <p className={styles.colHint}>
            <code>useCallback(fn, [])</code> — count замкнений як <strong>0</strong>.
            Кожен клік встановлює 1.
          </p>
          <button className={`${styles.btn} ${styles.btnBad}`} onClick={handleBad}>
            Клікни (bad)
          </button>
          <div className={styles.log}>
            {logBad.length === 0 && <span className={styles.logEmpty}>Лог порожній</span>}
            {logBad.map((entry, i) => (
              <div className={styles.logEntry} key={i}>
                {entry}
              </div>
            ))}
          </div>
        </div>

        <div className={styles.col}>
          <p className={styles.colTitle}>✅ Functional update</p>
          <p className={styles.colHint}>
            <code>setCount(prev =&gt; prev + 1)</code> — <em>prev</em> завжди актуальний.
          </p>
          <button className={`${styles.btn} ${styles.btnGood}`} onClick={handleGood}>
            Клікни (good)
          </button>
          <div className={styles.log}>
            {logGood.length === 0 && (
              <span className={styles.logEmpty}>Лог порожній</span>
            )}
            {logGood.map((entry, i) => (
              <div className={styles.logEntry} key={i}>
                {entry}
              </div>
            ))}
          </div>
        </div>
      </div>

      <button
        className={styles.btnReset}
        onClick={() => {
          setCount(0);
          setLogBad([]);
          setLogGood([]);
        }}
      >
        🔄 Reset
      </button>
    </div>
  );
}

// ─── Auto-increment stale closure demo ────────────────────────────────────────
export function StaleClosureTimerDemo() {
  const [count, setCount] = useState(0);
  const [mode, setMode] = useState<'bad' | 'good' | 'off'>('off');

  useEffect(() => {
    if (mode === 'off') return;

    const interval = setInterval(() => {
      if (mode === 'bad') {
        setCount(count + 1); // ❌ count — значення в момент старту
      } else {
        setCount((prev) => prev + 1); // ✅ завжди актуальне значення
      }
    }, 500);

    return () => clearInterval(interval);
  }, [mode, count]); // bad mode: count в deps → effect re-runs на кожен рендер (погано)

  return (
    <div className={styles.root}>
      <p className={styles.hint}>
        У «Bad» режимі <code>count</code> в deps useEffect → ефект перезапускається при
        кожній зміні count. У «Good» режимі functional update: <code>count</code> в deps
        непотрібен.
      </p>

      <div className={styles.counter}>
        <span className={styles.countValue}>{count}</span>
      </div>

      <div className={styles.modeButtons}>
        <button
          className={`${styles.btn} ${mode === 'bad' ? styles.btnBadActive : styles.btnBad}`}
          onClick={() => {
            setCount(0);
            setMode(mode === 'bad' ? 'off' : 'bad');
          }}
        >
          {mode === 'bad' ? '⏹ Stop' : '▶ Start'} Bad mode
        </button>
        <button
          className={`${styles.btn} ${mode === 'good' ? styles.btnGoodActive : styles.btnGood}`}
          onClick={() => {
            setCount(0);
            setMode(mode === 'good' ? 'off' : 'good');
          }}
        >
          {mode === 'good' ? '⏹ Stop' : '▶ Start'} Good mode
        </button>
      </div>
    </div>
  );
}

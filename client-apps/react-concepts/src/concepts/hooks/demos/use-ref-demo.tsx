import { useRef, useState } from 'react';

import { RenderCount } from '../../../shared/render-count/render-count';

import styles from './use-ref-demo.module.scss';

// ─── DOM ref demo ──────────────────────────────────────────────────────────────
export function UseRefDomDemo() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [focused, setFocused] = useState(false);

  const focusInput = () => {
    inputRef.current?.focus();
    setFocused(true);
  };

  return (
    <div className={styles.root}>
      <p className={styles.hint}>
        Кнопка програматично фокусує input через <code>inputRef.current?.focus()</code>
      </p>
      <div className={styles.row}>
        <input
          ref={inputRef}
          className={`${styles.input} ${focused ? styles.inputFocused : ''}`}
          placeholder="Клікни кнопку →"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        <button className={styles.btn} onClick={focusInput}>
          🎯 Focus
        </button>
      </div>
    </div>
  );
}

// ─── Mutable value ref demo ────────────────────────────────────────────────────
export function UseRefMutableDemo() {
  const [count, setCount] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [running, setRunning] = useState(false);

  const start = () => {
    if (intervalRef.current !== null) return;
    // Зберігаємо id в ref — БЕЗ ре-рендеру
    intervalRef.current = setInterval(() => {
      setCount((c) => c + 1); // setCount викликає ре-рендер щосекунди
    }, 1000);
    setRunning(true);
  };

  const stop = () => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setRunning(false);
  };

  const reset = () => {
    stop();
    setCount(0);
  };

  return (
    <div className={styles.root}>
      <p className={styles.hint}>
        <code>intervalRef.current</code> зберігає id інтервалу без ре-рендеру. Якби
        використали <code>useState</code> для intervalId — отримали б зайвий рендер при
        start/stop.
      </p>

      <div className={styles.timer}>
        <span className={styles.timerValue}>{count}</span>
        <span className={styles.timerSec}>сек</span>
      </div>

      <div className={styles.controls}>
        <RenderCount label="Component renders" />
        <div className={styles.btns}>
          <button
            className={`${styles.btn} ${styles.btnStart}`}
            onClick={start}
            disabled={running}
          >
            ▶ Start
          </button>
          <button
            className={`${styles.btn} ${styles.btnStop}`}
            onClick={stop}
            disabled={!running}
          >
            ⏸ Stop
          </button>
          <button className={`${styles.btn} ${styles.btnReset}`} onClick={reset}>
            🔄 Reset
          </button>
        </div>
      </div>

      <div className={styles.note}>
        💡 Render count зростає тільки від <code>setCount</code>, а не від запису в{' '}
        <code>ref</code>
      </div>
    </div>
  );
}

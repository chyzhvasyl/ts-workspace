import { useEffect, useRef, useState } from 'react';

import styles from './use-effect-demo.module.scss';

// ─── Симуляція fetch ───────────────────────────────────────────────────────────
function fakeFetch(id: string, signal: AbortSignal): Promise<string> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      if (signal.aborted) {
        reject(new DOMException('Aborted', 'AbortError'));
      } else {
        resolve(`Дані для user-${id} завантажено ✅`);
      }
    }, 1000);

    signal.addEventListener('abort', () => {
      clearTimeout(timer);
      reject(new DOMException('Aborted', 'AbortError'));
    });
  });
}

// ─── Infinite Loop Demo ────────────────────────────────────────────────────────
export function UseEffectInfiniteLoopDemo() {
  const [safeId, setSafeId] = useState('1');
  const effectCallsRef = useRef(0);

  // ✅ Правильно — deps містить тільки примітив
  useEffect(() => {
    effectCallsRef.current++;
  }, [safeId]);

  return (
    <div className={styles.root}>
      <div className={styles.explanation}>
        <div className={styles.bad}>
          <p className={styles.badTitle}>❌ Нескінченний цикл</p>
          <pre className={styles.mini}>{`const options = { method: 'GET' };
// options — новий об'єкт КОЖЕН рендер
useEffect(() => {
  fetch(\`/api/\${userId}\`, options)
}, [userId, options]); // options змінюється → effect
                        // → ре-рендер → loop 🔥`}</pre>
        </div>
        <div className={styles.good}>
          <p className={styles.goodTitle}>✅ Правильно</p>
          <pre className={styles.mini}>{`useEffect(() => {
  const options = { method: 'GET' }; // всередині!
  fetch(\`/api/\${userId}\`, options)
}, [userId]); // тільки примітивне значення`}</pre>
        </div>
      </div>

      <div className={styles.controls}>
        <span className={styles.label}>Зміни userId:</span>
        {['1', '2', '3'].map((id) => (
          <button
            className={`${styles.btn} ${safeId === id ? styles.active : ''}`}
            key={id}
            onClick={() => setSafeId(id)}
          >
            User {id}
          </button>
        ))}
      </div>

      <div className={styles.result}>
        Effect викликався разів: <strong>{effectCallsRef.current}</strong> (без loop —
        тільки при зміні userId)
      </div>
    </div>
  );
}

// ─── Cleanup / AbortController Demo ───────────────────────────────────────────
export function UseEffectCleanupDemo() {
  const [userId, setUserId] = useState('1');
  const [data, setData] = useState<string | null>(null);

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'aborted'>(
    'idle',
  );

  const abortCountRef = useRef(0);

  useEffect(() => {
    const controller = new AbortController();

    setStatus('loading');
    setData(null);

    fakeFetch(userId, controller.signal)
      .then((result) => {
        setData(result);
        setStatus('success');
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === 'AbortError') {
          abortCountRef.current++;
          setStatus('aborted');
        }
      });

    // Cleanup: скасовуємо запит при зміні userId або unmount
    return () => controller.abort();
  }, [userId]);

  return (
    <div className={styles.root}>
      <p className={styles.hint}>
        Швидко перемикай users — cleanup скасовує попередні запити
      </p>

      <div className={styles.controls}>
        <span className={styles.label}>User ID:</span>
        {['1', '2', '3', '4'].map((id) => (
          <button
            className={`${styles.btn} ${userId === id ? styles.active : ''}`}
            key={id}
            onClick={() => setUserId(id)}
          >
            User {id}
          </button>
        ))}
      </div>

      <div className={styles.statusBox}>
        <div
          className={`${styles.statusDot} ${
            status === 'loading'
              ? styles.dotLoading
              : status === 'success'
                ? styles.dotSuccess
                : status === 'aborted'
                  ? styles.dotAborted
                  : styles.dotIdle
          }`}
        />
        <span>
          {status === 'loading' && '⏳ Завантаження...'}
          {status === 'success' && data}
          {status === 'aborted' && `Запит скасовано (всього: ${abortCountRef.current})`}
          {status === 'idle' && 'Idle'}
        </span>
      </div>
    </div>
  );
}

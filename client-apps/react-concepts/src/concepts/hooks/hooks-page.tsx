import { DemoBlock } from '../../shared/demo-block/demo-block';

import { StaleClosureDemo } from './demos/stale-closure-demo';
import { UseDeferredValueDemo } from './demos/use-deferred-demo';
import { UseEffectCleanupDemo, UseEffectInfiniteLoopDemo } from './demos/use-effect-demo';
import { UseMemoDemo } from './demos/use-memo-demo';
import { UseRefDomDemo, UseRefMutableDemo } from './demos/use-ref-demo';

import styles from './hooks-page.module.scss';

export function HooksPage() {
  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <span className={styles.tag}>Частина 2</span>
        <h1 className={styles.title}>Hooks — глибше ніж базово</h1>
        <p className={styles.subtitle}>
          useEffect, useRef, useMemo, stale closure — нюанси, які питають на
          Senior-співбесіді
        </p>
      </div>

      <DemoBlock
        badge="danger"
        badgeText="❌ Найчастіша помилка"
        code={`// ❌ ЗЛАМАНО — options новий об'єкт кожен рендер
function Component({ userId }: { userId: string }) {
  const options = { method: 'GET' }; // новий obj кожен рендер!

  useEffect(() => {
    fetch(\`/api/\${userId}\`, options).then(...)
  }, [userId, options]); // options змінюється → effect → рендер → loop 🔥
}

// ✅ ПРАВИЛЬНО — оголоси всередині effect
useEffect(() => {
  const options = { method: 'GET' }; // всередині → не в deps
  fetch(\`/api/\${userId}\`, options).then(...)
}, [userId]); // тільки примітиви`}
        description="Якщо в deps передати об'єкт або функцію, що створюється під час рендеру — отримаєш infinite loop. Об'єкт у deps ≠ той самий об'єкт після рендеру."
        title="useEffect — нескінченний цикл"
      >
        <UseEffectInfiniteLoopDemo />
      </DemoBlock>

      <DemoBlock
        badge="success"
        badgeText="✅ Best Practice"
        code={`useEffect(() => {
  const controller = new AbortController();

  fetch(\`/api/user/\${userId}\`, { signal: controller.signal })
    .then(r => r.json())
    .then(setData)
    .catch(err => {
      if (err.name !== 'AbortError') console.error(err);
      // AbortError — нормально, просто ігноруємо
    });

  // Cleanup: викликається при зміні userId або unmount
  return () => controller.abort();
}, [userId]);`}
        description="Cleanup функція запускається перед наступним effect або при unmount. AbortController дозволяє скасувати fetch — критично при швидкому перемиканні між даними."
        title="useEffect — cleanup & AbortController"
      >
        <UseEffectCleanupDemo />
      </DemoBlock>

      <DemoBlock
        badge="info"
        badgeText="Юз-кейс 1/2"
        code={`function Input() {
  const inputRef = useRef<HTMLInputElement>(null);

  const focusInput = () => {
    inputRef.current?.focus(); // прямий доступ до DOM
  };

  return (
    <>
      <input ref={inputRef} />
      <button onClick={focusInput}>Focus</button>
    </>
  );
}`}
        description="Перший юз-кейс useRef — збереження посилання на DOM node. Зміна ref.current НЕ викликає ре-рендер на відміну від useState."
        title="useRef — доступ до DOM елементу"
      >
        <UseRefDomDemo />
      </DemoBlock>

      <DemoBlock
        badge="info"
        badgeText="Юз-кейс 2/2"
        code={`function Timer() {
  const [count, setCount] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = () => {
    intervalRef.current = setInterval(() => {
      setCount(c => c + 1); // ← цей setCount викликає ре-рендер
    }, 1000);
    // запис в ref.current — НЕ викликає ре-рендер
  };

  const stop = () => {
    clearInterval(intervalRef.current!);
    intervalRef.current = null;
  };
}`}
        description="Другий юз-кейс — зберігання будь-якого mutable значення (таймер id, попереднє значення, лічильник) без ре-рендеру. Якби використали useState для intervalId — start/stop давали б зайвий рендер."
        title="useRef — mutable значення без ре-рендеру"
      >
        <UseRefMutableDemo />
      </DemoBlock>

      <DemoBlock
        badge="warning"
        badgeText="Оптимізація"
        code={`// ❌ Без useMemo — важке обчислення на КОЖЕН рендер
const filtered = heavyFilter(hugeDataset, query);

// ✅ З useMemo — тільки коли query або hugeDataset змінились
const filtered = useMemo(
  () => hugeDataset.filter(item =>
    item.name.toLowerCase().includes(query.toLowerCase())
  ),
  [hugeDataset, query]
);

// ✅ Також корисний для стабілізації об'єктів як props для React.memo
const config = useMemo(() => ({ theme: 'dark', lang: 'uk' }), []);
return <ExpensiveChild config={config} />;`}
        description="useMemo кешує результат обчислення між рендерами. Корисний для дорогих фільтрацій, сортувань, трансформацій даних. НЕ для простих операцій — у нього є власний overhead."
        title="useMemo — кешування важких обчислень"
      >
        <UseMemoDemo />
      </DemoBlock>

      <DemoBlock
        badge="danger"
        badgeText="Пастка"
        code={`// ❌ ПРОБЛЕМА — count завжди 0 всередині callback
const handleBad = useCallback(() => {
  setCount(count + 1); // count замкнутий як 0!
}, []); // порожній deps → callback не перестворюється

// ✅ ПРАВИЛЬНО — functional update
const handleGood = useCallback(() => {
  setCount(prev => prev + 1); // prev — завжди актуальний
}, []); // deps можна залишити порожнім — і це правильно`}
        description="Якщо використовуєш useCallback з порожнім deps масивом і читаєш state всередині — отримаєш застаріле значення (stale closure). Рішення: functional update setCount(prev => prev + 1)."
        title="useState — stale closure проблема"
      >
        <StaleClosureDemo />
      </DemoBlock>

      <DemoBlock code="" description="description" title="Use deferred">
        <UseDeferredValueDemo />
      </DemoBlock>
    </div>
  );
}

import { Link } from 'react-router-dom';

import styles from './guide-page.module.scss';

interface QA {
  q: string;
  a: string;
}

interface Section {
  icon: string;
  title: string;
  task?: { label: string; to: string };
  questions: QA[];
}

const SECTIONS: Section[] = [
  {
    icon: '🧠',
    title: 'Філософія React',
    questions: [
      {
        q: 'Що таке декларативний UI?',
        a: 'Ти описуєш, ЯК має виглядати UI для поточного стану; React сам приводить DOM до цього стану. Ти не смикаєш DOM імперативно.',
      },
      {
        q: 'UI = f(state). Що це значить на практиці?',
        a: 'Рендер — чиста функція стану й пропсів. Той самий стан → той самий UI. Тому: мінімум стану, решта — похідні значення під час рендеру.',
      },
      {
        q: 'Чому immutability так важлива?',
        a: 'React вирішує, що перерендерити, порівнюючи посилання (Object.is). Мутація обʼєкта/масиву на місці лишає те саме посилання → пропущений ре-рендер або баг.',
      },
    ],
  },
  {
    icon: '📦',
    title: 'State і derived state',
    task: { label: 'Завдання 1 · Калькулятор комісії', to: '/task/fee-calculator' },
    questions: [
      {
        q: 'Коли значення НЕ варто класти в state?',
        a: 'Якщо його можна обчислити з наявного стану/пропсів. Дублювання стану → розсинхрон. fee/net рахуй під час рендеру.',
      },
      {
        q: 'useState vs useReducer?',
        a: 'useState — для простих незалежних значень. useReducer — коли переходів багато і вони повʼязані, або наступний стан залежить від попереднього за складними правилами.',
      },
      {
        q: 'Чому setState асинхронний/батчиться?',
        a: 'React групує оновлення в межах події й рендерить один раз. Тому для оновлення на основі попереднього використовуй функціональну форму setX(prev => ...).',
      },
    ],
  },
  {
    icon: '🔁',
    title: 'Списки, keys, immutability',
    task: { label: 'Завдання 2 · Конструктор інвойсу', to: '/task/invoice-builder' },
    questions: [
      {
        q: 'Навіщо key і чому не index?',
        a: 'key дає React стабільну ідентичність елемента для reconciliation. index ламається при вставці/видаленні/сортуванні — стан компонентів зміщується не до тих рядків.',
      },
      {
        q: 'Як оновити елемент масиву в стані?',
        a: 'map з тернаром по id, повертаючи новий обʼєкт { ...item, ...patch }. filter — для видалення, spread — для додавання.',
      },
    ],
  },
  {
    icon: '⚙️',
    title: 'useReducer і складний стан',
    task: { label: 'Завдання 3 · Тарифні правила', to: '/task/commission-rules' },
    questions: [
      {
        q: 'Що таке reducer?',
        a: '(state, action) => newState — чиста функція. Передбачувано, тестовано, легко логувати й робити undo/redo.',
      },
      {
        q: 'Як зробити switch вичерпним у TS?',
        a: 'default: const _exhaustive: never = action. Якщо зʼявиться непокритий тип action — компілятор впаде.',
      },
    ],
  },
  {
    icon: '⚡',
    title: 'Performance: memo / useMemo / useCallback',
    task: {
      label: 'Завдання 4 · Explorer транзакцій',
      to: '/task/transactions-explorer',
    },
    questions: [
      {
        q: 'Коли потрібен React.memo?',
        a: 'Коли дочірній компонент дорогий і часто отримує ті самі пропси. memo робить shallow-порівняння пропсів і пропускає ре-рендер.',
      },
      {
        q: 'useMemo vs useCallback?',
        a: 'useMemo кешує ОБЧИСЛЕНЕ значення; useCallback кешує ФУНКЦІЮ (= useMemo(() => fn)). Обидва потрібні для стабільної ідентичності пропсів/залежностей.',
      },
      {
        q: 'Не передчасна це оптимізація?',
        a: 'Так, мемоїзувати все підряд — погано (вартість порівнянь + памʼять). Мемоїзуй дороге або те, що ламає memo дочірніх компонентів.',
      },
    ],
  },
  {
    icon: '🌐',
    title: 'useEffect, async, race conditions',
    task: { label: 'Завдання 5 · Завантаження балансів', to: '/task/balance-loader' },
    questions: [
      {
        q: 'Навіщо cleanup-функція в useEffect?',
        a: 'Прибрати підписки/таймери/запити при зміні залежностей чи unmount. Інакше — витоки памʼяті й setState на мертвому компоненті.',
      },
      {
        q: 'Що таке race condition при фетчі?',
        a: 'Швидка зміна залежностей запускає кілька запитів; повільніший приходить пізніше й перетирає свіжий. Лікується AbortController або прапорцем ignore у cleanup.',
      },
      {
        q: 'Чому не можна фетчити в рендері?',
        a: 'Рендер має бути чистим і без side-effects. Усі ефекти — в useEffect.',
      },
      {
        q: 'Як працює залежний масив [deps]?',
        a: 'Ефект перезапускається, коли будь-яка залежність змінює посилання. Неповний deps → stale closure; зайвий → зайві перезапуски.',
      },
    ],
  },
  {
    icon: '📝',
    title: 'Форми, валідація, custom hooks',
    task: { label: 'Завдання 6 · Форма виплати', to: '/task/payout-form' },
    questions: [
      {
        q: 'Controlled vs uncontrolled?',
        a: 'Controlled: value зі стану + onChange. Єдине джерело правди — React. Uncontrolled: значення живе в DOM, читається через ref. Для валідації/динаміки — controlled.',
      },
      {
        q: 'Навіщо власні хуки?',
        a: 'Інкапсуляція й перевикористання логіки зі станом (useForm, useAsync, useDebounce). Правила хуків: лише на верхньому рівні, лише в компонентах/хуках.',
      },
      {
        q: 'Коли useRef?',
        a: 'Мутабельне значення, що не тригерить ре-рендер, або імперативний доступ до DOM (focus, scroll, вимір).',
      },
    ],
  },
  {
    icon: '🗂️',
    title: 'Context і re-renders',
    task: { label: 'Завдання 7 · Контекст налаштувань', to: '/task/settings-context' },
    questions: [
      {
        q: 'Чому Context ре-рендерить багато?',
        a: 'Усі споживачі ре-рендеряться при зміні value. Якщо value — новий обʼєкт щорендер, ре-рендеряться всі, навіть ті, кому потрібні лише actions.',
      },
      {
        q: 'Як це лікувати?',
        a: 'Розділити на два контексти (state і actions), мемоїзувати value (useMemo). Для частих оновлень — Zustand/Jotai/Redux замість Context.',
      },
      {
        q: 'Context vs стейт-менеджер?',
        a: 'Context — це DI для рідко змінюваних глобальних даних (тема, локаль, юзер). Не оптимізований для високочастотних апдейтів.',
      },
    ],
  },
  {
    icon: '⏪',
    title: 'Undo/redo, optimistic UI',
    task: {
      label: 'Завдання 8 · Undo/Redo + optimistic',
      to: '/task/recalculation-history',
    },
    questions: [
      {
        q: 'Як зробити undo/redo?',
        a: 'Стан як { past[], present, future[] }. set пушить present у past і чистить future; undo/redo переставляють вказівник. Чистий generic reducer.',
      },
      {
        q: 'Що таке optimistic update?',
        a: 'Показати результат ДО відповіді сервера заради відгуку UI; зберегти previous і відкотити при помилці.',
      },
    ],
  },
];

const SOLIDGATE_FOCUS = [
  'Browser internals і networking: event loop, rendering pipeline, repaint/reflow, HTTP/caching, CORS.',
  'Web performance: Core Web Vitals, code splitting, lazy loading, bundle size, віртуалізація довгих списків.',
  'Системи поза фреймворком: чиста доменна логіка (комісії, ledger) у звичайному TS, незалежна від React.',
  'Тестування: Unit (Vitest) для чистих функцій, Integration (Testing Library) для компонентів, E2E (Playwright/Cypress).',
  'Архітектура: DDD, Clean/Hexagonal, шарування — відділяй domain від UI (саме так збудований цей застосунок).',
  'Точність грошей: minor units (cents) + цілочисельна математика, ніколи float для сум.',
];

export function GuidePage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <span className={styles.badge}>
          Гайд до співбесіди · Solidgate Frontend Engineer
        </span>
        <h1>Як готуватись по цьому застосунку</h1>
        <p className={styles.lead}>
          Для кожної теми React нижче є типові питання, короткі тези відповідей і
          завдання, де ти відпрацьовуєш концепт руками. Проходь зверху вниз — складність
          зростає.
        </p>
      </header>

      <div className={styles.flow}>
        <strong>Робочий цикл:</strong> відкрий завдання → прочитай ТЗ ліворуч → знайди
        файли з <code>// TODO</code> → напиши логіку → перевір у браузері → де є тести,
        прожени <code>nx test fintech-playground</code>.
      </div>

      {SECTIONS.map((s) => (
        <section key={s.title} className={styles.section}>
          <div className={styles.sectionHead}>
            <h2>
              <span className={styles.sIcon}>{s.icon}</span> {s.title}
            </h2>
            {s.task && (
              <Link to={s.task.to} className={styles.taskLink}>
                {s.task.label} →
              </Link>
            )}
          </div>
          <div className={styles.qaList}>
            {s.questions.map((qa) => (
              <div key={qa.q} className={styles.qa}>
                <p className={styles.q}>{qa.q}</p>
                <p className={styles.a}>{qa.a}</p>
              </div>
            ))}
          </div>
        </section>
      ))}

      <section className={styles.focus}>
        <h2>🎯 На що окремо звертає увагу Solidgate</h2>
        <ul>
          {SOLIDGATE_FOCUS.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}

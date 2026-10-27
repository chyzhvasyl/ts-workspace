import { TaskPage } from '../../pages/task-page';

import { BalanceLoader } from './balance-loader';

export const meta = {
  id: 'balance-loader',
  order: 5,
  title: 'Завантаження балансів',
  difficulty: 'senior' as const,
  concepts: [
    'useEffect',
    'data fetching',
    'cleanup',
    'AbortController',
    'race conditions',
    'custom hook',
  ],
  summary:
    'Найчастіше джерело багів — асинхронні ефекти. Реалізуй надійний useAsync: loading/error/success, скасування запиту й ігнорування застарілих відповідей.',
};

export function BalanceLoaderPage() {
  return (
    <TaskPage
      acceptance={[
        'Loading → success/error відображаються коректно.',
        'Швидке перемикання мерчанта показує відповідь ОСТАННЬОГО вибору.',
        'Розмонтування під час запиту не дає warning у консолі.',
        'AbortError не показується як помилка користувачу.',
      ]}
      hints={[
        'useEffect(() => { const ac = new AbortController(); ...; return () => ac.abort(); }, deps).',
        'Прапорець let ignore = false; у cleanup ignore = true — захист від race.',
        'Чому не fetch у рендері? Side-effects живуть у useEffect, рендер має бути чистим.',
      ]}
      meta={meta}
      requirements={[
        <>
          Реалізуй <code>useAsync</code> у <code>use-async.ts</code> з усіма станами.
        </>,
        <>
          Скасовуй запит у cleanup через <code>AbortController</code> і ігноруй
          стейл-відповіді.
        </>,
        <>Не викликай setState після cleanup / unmount.</>,
      ]}
    >
      <BalanceLoader />
    </TaskPage>
  );
}

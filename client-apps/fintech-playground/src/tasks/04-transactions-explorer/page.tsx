import { TaskPage } from '../../pages/task-page';
import { TransactionsExplorer } from './transactions-explorer';

export const meta = {
  id: 'transactions-explorer',
  order: 4,
  title: 'Explorer транзакцій',
  difficulty: 'middle' as const,
  concepts: [
    'useMemo',
    'derived data',
    'React.memo',
    'performance',
    'filter/sort/search',
  ],
  summary:
    'Фільтрація, сортування й агрегація списку. Похідні дані обчислюй через useMemo, щоб важкі обчислення не повторювались на кожен ре-рендер.',
};

export function TransactionsExplorerPage() {
  return (
    <TaskPage
      meta={meta}
      requirements={[
        <>
          Реалізуй <code>applyFilters</code> (status + текстовий пошук + сортування) у{' '}
          <code>filter-transactions.ts</code>.
        </>,
        <>
          Реалізуй <code>summarize</code> (count, оборот, комісії).
        </>,
        <>
          Переконайся, що обчислення обгорнуті в <code>useMemo</code> з правильними
          залежностями.
        </>,
      ]}
      acceptance={[
        'Пошук фільтрує по id/email/country без урахування регістру.',
        'Сортування за датою і сумою в обидва боки.',
        'Кнопка “Re-render” збільшує лічильник, але НЕ перераховує фільтр (правильні deps).',
      ]}
      hints={[
        'useMemo(fn, deps) кешує результат, поки deps незмінні.',
        'Передчасна оптимізація — зло, але фільтр+сорт по списку — валідний кейс для memo.',
        'Хочеш побачити вигоду memo? Виведи console.log усередині applyFilters і потисни Re-render.',
      ]}
    >
      <TransactionsExplorer />
    </TaskPage>
  );
}

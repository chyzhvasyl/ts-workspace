import { TaskPage } from '../../pages/task-page';

import { Recalculation } from './recalculation';

export const meta = {
  id: 'recalculation-history',
  order: 8,
  title: 'Undo/Redo + optimistic перерахунок',
  difficulty: 'senior' as const,
  concepts: [
    'useReducer (generic)',
    'time-travel state',
    'undo/redo',
    'optimistic UI',
    'rollback',
  ],
  summary:
    'Найвищий рівень: узагальнений history-редʼюсер (past/present/future) для undo/redo та оптимістичне оновлення з відкатом при помилці сервера.',
};

export function RecalculationHistoryPage() {
  return (
    <TaskPage
      acceptance={[
        'Зміна ставки додає крок в історію; undo/redo працюють і дизейбляться на межах.',
        'set після undo очищає future.',
        'Apply одразу показує нове значення; при “відмові сервера” відкочує назад і показує помилку.',
      ]}
      hints={[
        'history: past[], present, future[]. undo: present→front of future, last past→present.',
        'Оптимістичність = показати результат ДО відповіді сервера; зберегти previous для rollback.',
        'Generic reducer тестується ізольовано — ідеальний приклад чистої логіки поза React.',
      ]}
      meta={meta}
      requirements={[
        <>
          Реалізуй generic <code>historyReducer</code> у <code>history-reducer.ts</code>{' '}
          (set/undo/redo/reset).
        </>,
        <>Переконайся, що undo/redo коректно рухають past/present/future без мутацій.</>,
        <>
          Розбери логіку <code>apply</code>: оптимістичне оновлення + rollback при відмові
          (вже накидано — поясни собі кожен рядок).
        </>,
      ]}
    >
      <Recalculation />
    </TaskPage>
  );
}

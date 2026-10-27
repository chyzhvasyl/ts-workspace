import { TaskPage } from '../../pages/task-page';

import { CommissionRules } from './commission-rules';

export const meta = {
  id: 'commission-rules',
  order: 3,
  title: 'Редактор тарифних правил',
  difficulty: 'middle' as const,
  concepts: [
    'useReducer',
    'discriminated unions',
    'exhaustive switch',
    'never',
    'immutable state',
  ],
  summary:
    'Коли стан має багато повʼязаних переходів — useReducer чистіший за купу useState. Усі зміни проходять через одну чисту функцію-редʼюсер.',
};

export function CommissionRulesPage() {
  return (
    <TaskPage
      acceptance={[
        'Додавання рівня додає рядок; видалення прибирає правильний.',
        'Зміна ставки/межі оновлює лише потрібний рівень.',
        'Reset повертає initialRulesState.',
        'Якщо прибрати один case — TypeScript підсвічує помилку через never.',
      ]}
      hints={[
        'reducer: (state, action) => newState. Чиста функція, без side-effects.',
        'Для update по index: state.tiers.map((t,i) => i===index ? {...t, rateBps} : t).',
        'never-перевірка: const _exhaustive: never = action; — TS впаде, якщо є непокритий тип.',
      ]}
      meta={meta}
      requirements={[
        <>
          Реалізуй <code>rulesReducer</code> у <code>rules-reducer.ts</code> для всіх 5
          екшенів.
        </>,
        <>
          Жодних мутацій <code>state</code> — повертай нові обʼєкти/масиви.
        </>,
        <>
          Зроби <code>switch</code> вичерпним: додай гілку <code>default</code> з
          перевіркою <code>never</code>.
        </>,
      ]}
    >
      <CommissionRules />
    </TaskPage>
  );
}

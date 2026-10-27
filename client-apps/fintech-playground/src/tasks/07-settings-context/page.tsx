import { Callout } from '../../shared/ui';
import { TaskPage } from '../../pages/task-page';
import { SettingsPanels } from './settings-panels';

export const meta = {
  id: 'settings-context',
  order: 7,
  title: 'Контекст налаштувань',
  difficulty: 'senior' as const,
  concepts: [
    'Context',
    'split contexts',
    'useMemo (stable identity)',
    'avoid re-renders',
    'custom provider',
  ],
  summary:
    'Context зручний, але наївний провайдер ре-рендерить усе піддерево. Розділи state і actions на два контексти й мемоїзуй actions, щоб контроли не ре-рендерились від зміни state.',
};

export function SettingsContextPage() {
  return (
    <TaskPage
      meta={meta}
      requirements={[
        <>
          Реалізуй <code>SettingsProvider</code> у <code>settings-context.tsx</code>:
          state + дві обгортки-провайдери.
        </>,
        <>
          Мемоїзуй обʼєкт actions через <code>useMemo</code>, щоб його ідентичність була
          стабільна.
        </>,
        <>Підключи контроли до реальних actions, а превʼю — до state.</>,
      ]}
      acceptance={[
        'Зміна налаштувань оновлює Preview-панель.',
        'Лічильник “Controls render” НЕ росте при зміні state (бо споживає лише actions).',
        'useSettings/useSettingsActions працюють із двох різних контекстів.',
      ]}
      hints={[
        'Один контекст із обʼєктом {state, actions} ре-рендерить усіх споживачів. Розділяй.',
        'actions мають стабільну ідентичність → useMemo(() => ({...}), []). setState-функції стабільні самі по собі.',
        'Context — для рідко змінюваних/глобальних даних. Для частих оновлень — Zustand/Redux/Jotai.',
      ]}
    >
      <Callout tone="info" title="Як перевірити">
        Зараз контроли нічого не роблять (passthrough-провайдер). Реалізуй провайдер — і
        слідкуй за двома лічильниками рендерів.
      </Callout>
      <SettingsPanels />
    </TaskPage>
  );
}

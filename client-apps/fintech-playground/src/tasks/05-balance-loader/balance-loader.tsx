import { useCallback, useState } from 'react';

import { mockApi } from '../../shared/domain/mock-api';
import type { Balance } from '../../shared/domain/types';
import {
  Button,
  Callout,
  Card,
  Field,
  Money,
  Select,
  Spinner,
  Stat,
  Toggle,
} from '../../shared/ui';

import { useAsync } from './use-async';

const MERCHANTS = [
  { value: 'm_glovo', label: 'Glovo' },
  { value: 'm_setapp', label: 'Setapp' },
  { value: 'm_preply', label: 'Preply' },
] as const;

export function BalanceLoader() {
  const [merchantId, setMerchantId] = useState<string>('m_glovo');
  const [forceFail, setForceFail] = useState(false);
  const [slow, setSlow] = useState(true);

  // The factory is recreated when inputs change; useAsync re-runs on deps.
  const factory = useCallback(
    (signal: AbortSignal) =>
      mockApi.getBalances({
        signal,
        failRate: forceFail ? 1 : 0,
        delayMs: slow ? 1200 : 300,
      }),
    [merchantId, forceFail, slow],
  );

  const { status, data, error } = useAsync<Balance[]>(factory, [factory]);

  return (
    <>
      <Card
        subtitle="Швидко перемикай мерчанта — стейл-відповіді не мають перетирати свіжі"
        title="Налаштування завантаження"
      >
        <div
          style={{ display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'flex-end' }}
        >
          <Field label="Мерчант">
            <Select
              options={MERCHANTS}
              value={merchantId}
              onValueChange={setMerchantId}
            />
          </Field>
          <Toggle
            checked={slow}
            label="Повільна мережа (1.2s)"
            onCheckedChange={setSlow}
          />
          <Toggle
            checked={forceFail}
            label="Симулювати помилку"
            onCheckedChange={setForceFail}
          />
        </div>
      </Card>

      <Card subtitle={`Стан: ${status}`} title="Баланси">
        {status === 'loading' && <Spinner label="Завантаження балансів…" />}
        {status === 'error' && (
          <Callout title="Помилка запиту" tone="danger">
            {error?.message ?? 'unknown'} — обробка помилки працює ✅
          </Callout>
        )}
        {status === 'idle' && (
          <Callout title="Хук ще не реалізовано" tone="info">
            Реалізуй <code>useAsync</code> у <code>use-async.ts</code>, щоб побачити дані.
          </Callout>
        )}
        {status === 'success' && data && (
          <div
            style={{
              display: 'grid',
              gap: 14,
              gridTemplateColumns: `repeat(${data.length},1fr)`,
            }}
          >
            {data.map((b) => (
              <Stat
                hint={
                  <>
                    pending <Money value={b.pending} />
                  </>
                }
                key={b.currency}
                label={`${b.currency} available`}
                value={<Money value={b.available} />}
              />
            ))}
          </div>
        )}
      </Card>

      <Callout title="Перевір race condition" tone="info">
        Увімкни повільну мережу і швидко клацай між мерчантами. Якщо <code>useAsync</code>{' '}
        правильний — покажеться відповідь ОСТАННЬОГО вибору, а не та, що приїхала пізніше.
        Кнопка нижче розмонтовує компонент (тест cleanup).
      </Callout>
      <UnmountProbe />
    </>
  );
}

function UnmountProbe() {
  const [mounted, setMounted] = useState(true);

  return (
    <div>
      <Button size="sm" variant="secondary" onClick={() => setMounted((m) => !m)}>
        {mounted ? 'Розмонтувати під час завантаження' : 'Змонтувати знову'}
      </Button>
      {!mounted && (
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 8 }}>
          У консолі НЕ має бути warning про setState на розмонтованому компоненті.
        </p>
      )}
    </div>
  );
}

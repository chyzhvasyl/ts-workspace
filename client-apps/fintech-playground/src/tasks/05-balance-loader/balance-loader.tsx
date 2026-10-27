import { useCallback, useState } from 'react';

import { mockApi } from '../../shared/domain/mock-api';
import { Balance } from '../../shared/domain/types';
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
        title="Налаштування завантаження"
        subtitle="Швидко перемикай мерчанта — стейл-відповіді не мають перетирати свіжі"
      >
        <div
          style={{ display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'flex-end' }}
        >
          <Field label="Мерчант">
            <Select
              value={merchantId}
              options={MERCHANTS}
              onValueChange={setMerchantId}
            />
          </Field>
          <Toggle
            checked={slow}
            onCheckedChange={setSlow}
            label="Повільна мережа (1.2s)"
          />
          <Toggle
            checked={forceFail}
            onCheckedChange={setForceFail}
            label="Симулювати помилку"
          />
        </div>
      </Card>

      <Card title="Баланси" subtitle={`Стан: ${status}`}>
        {status === 'loading' && <Spinner label="Завантаження балансів…" />}
        {status === 'error' && (
          <Callout tone="danger" title="Помилка запиту">
            {error?.message ?? 'unknown'} — обробка помилки працює ✅
          </Callout>
        )}
        {status === 'idle' && (
          <Callout tone="info" title="Хук ще не реалізовано">
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
                key={b.currency}
                label={`${b.currency} available`}
                value={<Money value={b.available} />}
                hint={
                  <>
                    pending <Money value={b.pending} />
                  </>
                }
              />
            ))}
          </div>
        )}
      </Card>

      <Callout tone="info" title="Перевір race condition">
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
      <Button variant="secondary" size="sm" onClick={() => setMounted((m) => !m)}>
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

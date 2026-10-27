import { useReducer, useState } from 'react';

import {
  Button,
  Callout,
  Card,
  Field,
  NumberInput,
  StatusPill,
  Toggle,
} from '../../shared/ui';
import { canRedo, canUndo, historyReducer, initialHistory } from './history-reducer';

interface FeeConfig {
  rateBps: number;
}

type ApplyStatus = 'idle' | 'applying' | 'applied' | 'failed';

// Fake mutation: resolves or rejects after a delay.
function persistConfig(config: FeeConfig, shouldFail: boolean): Promise<FeeConfig> {
  return new Promise((resolve, reject) =>
    setTimeout(
      () =>
        shouldFail ? reject(new Error('Сервер відхилив перерахунок')) : resolve(config),
      900,
    ),
  );
}

export function Recalculation() {
  const [state, dispatch] = useReducer(
    historyReducer<FeeConfig>,
    initialHistory<FeeConfig>({ rateBps: 290 }),
  );
  const [applyStatus, setApplyStatus] = useState<ApplyStatus>('idle');
  const [appliedConfig, setAppliedConfig] = useState<FeeConfig>({ rateBps: 290 });
  const [error, setError] = useState<string | null>(null);
  const [forceFail, setForceFail] = useState(false);

  const config = state.present;

  // 🎯 BONUS (optimistic update): apply config to the "server".
  // Optimistically set appliedConfig + status 'applying'; on failure → rollback.
  const apply = async () => {
    const previous = appliedConfig; // remember for rollback
    setError(null);
    setApplyStatus('applying');
    setAppliedConfig(config); // optimistic
    try {
      const saved = await persistConfig(config, forceFail);
      setAppliedConfig(saved);
      setApplyStatus('applied');
    } catch (e) {
      setAppliedConfig(previous); // rollback
      setApplyStatus('failed');
      setError(e instanceof Error ? e.message : 'error');
    }
  };

  const statusTone =
    applyStatus === 'applied'
      ? 'success'
      : applyStatus === 'failed'
        ? 'danger'
        : applyStatus === 'applying'
          ? 'info'
          : 'neutral';

  return (
    <>
      <Card
        title="Чернетка конфігурації комісії"
        subtitle="Редагуй ставку, ходи по історії undo/redo"
        actions={
          <>
            <Button
              size="sm"
              variant="secondary"
              disabled={!canUndo(state)}
              onClick={() => dispatch({ type: 'undo' })}
            >
              ↶ undo
            </Button>
            <Button
              size="sm"
              variant="secondary"
              disabled={!canRedo(state)}
              onClick={() => dispatch({ type: 'redo' })}
            >
              redo↻
            </Button>
          </>
        }
      >
        <div
          style={{ display: 'flex', gap: 20, alignItems: 'flex-end', flexWrap: 'wrap' }}
        >
          <Field label="Ставка (bps)" hint={`${(config.rateBps / 100).toFixed(2)}%`}>
            <NumberInput
              value={config.rateBps}
              min={0}
              onValueChange={(v) =>
                dispatch({
                  type: 'set',
                  value: { rateBps: typeof v === 'number' ? v : 0 },
                })
              }
            />
          </Field>
          <div
            style={{
              fontSize: 12,
              color: 'var(--text-muted)',
              fontFamily: 'var(--mono)',
            }}
          >
            past: {state.past.length} · future: {state.future.length}
          </div>
        </div>
      </Card>

      <Card
        title="Застосувати перерахунок (optimistic)"
        actions={<StatusPill tone={statusTone}>{applyStatus}</StatusPill>}
        footer={
          <Toggle
            checked={forceFail}
            onCheckedChange={setForceFail}
            label="Симулювати відмову сервера"
          />
        }
      >
        <p style={{ fontSize: 14, marginBottom: 14 }}>
          Застосована ставка: <strong>{(appliedConfig.rateBps / 100).toFixed(2)}%</strong>
        </p>
        <Button onClick={apply} disabled={applyStatus === 'applying'}>
          Застосувати {(config.rateBps / 100).toFixed(2)}%
        </Button>
        {error && (
          <div style={{ marginTop: 14 }}>
            <Callout tone="danger" title="Відкат (rollback)">
              {error}. Значення повернулось до попереднього.
            </Callout>
          </div>
        )}
      </Card>
    </>
  );
}

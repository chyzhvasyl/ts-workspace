import type { Currency } from '../../shared/domain/money';
import { Card, RenderCount, Select, Toggle } from '../../shared/ui';

import type { RoundingMode } from './settings-context';
import { SettingsProvider, useSettings, useSettingsActions } from './settings-context';

const CURRENCIES = [
  { value: 'USD', label: 'USD' },
  { value: 'EUR', label: 'EUR' },
  { value: 'GBP', label: 'GBP' },
] as const;

const ROUNDING = [
  { value: 'half_up', label: 'Half up' },
  { value: 'bankers', label: "Banker's" },
  { value: 'floor', label: 'Floor' },
] as const;

/** Consumes ACTIONS only → must NOT re-render when settings change. */
function ControlsPanel() {
  const { setCurrency, setRounding, toggleFeesInclusive, reset } = useSettingsActions();

  return (
    <Card
      actions={<RenderCount label="Controls render" />}
      title="Контроли (тільки actions)"
    >
      <div style={{ display: 'grid', gap: 14, maxWidth: 280 }}>
        <Select
          options={CURRENCIES}
          value={'USD'}
          onValueChange={(v) => setCurrency(v)}
        />
        <Select
          options={ROUNDING}
          value={'half_up'}
          onValueChange={(v) => setRounding(v)}
        />
        <Toggle
          checked={false}
          label="Fees inclusive"
          onCheckedChange={() => toggleFeesInclusive()}
        />
        <button
          style={{
            padding: '6px 12px',
            borderRadius: 6,
            border: '1px solid var(--border-strong)',
          }}
          onClick={reset}
        >
          Reset
        </button>
      </div>
    </Card>
  );
}

/** Consumes STATE → re-renders when settings change (expected). */
function PreviewPanel() {
  const s = useSettings();

  return (
    <Card actions={<RenderCount label="Preview render" />} title="Превʼю (читає state)">
      <pre style={{ fontSize: 13 }}>{JSON.stringify(s, null, 2)}</pre>
    </Card>
  );
}

export function SettingsPanels() {
  return (
    <SettingsProvider>
      <div style={{ display: 'grid', gap: 16, gridTemplateColumns: '1fr 1fr' }}>
        <ControlsPanel />
        <PreviewPanel />
      </div>
    </SettingsProvider>
  );
}

import { Card, RenderCount, Select, Toggle } from '../../shared/ui';
import {
  RoundingMode,
  SettingsProvider,
  useSettings,
  useSettingsActions,
} from './settings-context';
import { Currency } from '../../shared/domain/money';

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
      title="Контроли (тільки actions)"
      actions={<RenderCount label="Controls render" />}
    >
      <div style={{ display: 'grid', gap: 14, maxWidth: 280 }}>
        <Select
          value={'USD'}
          options={CURRENCIES}
          onValueChange={(v) => setCurrency(v as Currency)}
        />
        <Select
          value={'half_up'}
          options={ROUNDING}
          onValueChange={(v) => setRounding(v as RoundingMode)}
        />
        <Toggle
          checked={false}
          onCheckedChange={() => toggleFeesInclusive()}
          label="Fees inclusive"
        />
        <button
          onClick={reset}
          style={{
            padding: '6px 12px',
            borderRadius: 6,
            border: '1px solid var(--border-strong)',
          }}
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
    <Card title="Превʼю (читає state)" actions={<RenderCount label="Preview render" />}>
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

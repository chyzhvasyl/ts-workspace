import { createContext, ReactNode, useContext } from 'react';

import { Currency } from '../../shared/domain/money';

export type RoundingMode = 'half_up' | 'bankers' | 'floor';

export interface Settings {
  displayCurrency: Currency;
  rounding: RoundingMode;
  feesInclusive: boolean;
}

export interface SettingsActions {
  setCurrency: (c: Currency) => void;
  setRounding: (r: RoundingMode) => void;
  toggleFeesInclusive: () => void;
  reset: () => void;
}

export const DEFAULT_SETTINGS: Settings = {
  displayCurrency: 'USD',
  rounding: 'half_up',
  feesInclusive: false,
};

const NOOP: SettingsActions = {
  setCurrency: () => undefined,
  setRounding: () => undefined,
  toggleFeesInclusive: () => undefined,
  reset: () => undefined,
};

// Two separate contexts: state changes should NOT re-render action-only consumers.
const SettingsStateContext = createContext<Settings>(DEFAULT_SETTINGS);
const SettingsActionsContext = createContext<SettingsActions>(NOOP);

/**
 * 🎯 TODO: implement the provider.
 *  - Hold settings in useState(DEFAULT_SETTINGS).
 *  - Build the actions object and MEMOIZE it (useMemo) so its identity is stable
 *    across renders — otherwise action-only consumers re-render for nothing.
 *  - Provide state via SettingsStateContext and actions via SettingsActionsContext.
 *  Currently it just renders children with defaults (controls do nothing).
 */
export function SettingsProvider({ children }: { children: ReactNode }) {
  // TODO: replace this passthrough with real state + two providers.
  return <>{children}</>;
}

/** Read settings (re-renders when settings change). */
export const useSettings = (): Settings => useContext(SettingsStateContext);

/** Read actions only (should be stable; no re-render on state change). */
export const useSettingsActions = (): SettingsActions =>
  useContext(SettingsActionsContext);

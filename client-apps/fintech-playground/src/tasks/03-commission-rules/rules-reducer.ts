import { CommissionTier } from '../../shared/domain/types';

export interface RulesState {
  tiers: CommissionTier[]; // sorted ascending by fromMinor
}

/**
 * Discriminated union of actions. Perfect for an exhaustive switch + `never`.
 */
export type RulesAction =
  | { type: 'add_tier' }
  | { type: 'remove_tier'; index: number }
  | { type: 'set_rate'; index: number; rateBps: number }
  | { type: 'set_from'; index: number; fromMinor: number }
  | { type: 'reset' };

export const initialRulesState: RulesState = {
  tiers: [
    { fromMinor: 0, rateBps: 320 },
    { fromMinor: 100_00, rateBps: 280 },
    { fromMinor: 1_000_00, rateBps: 240 },
  ],
};

/**
 * 🎯 TODO: implement the reducer PURELY (return new state, never mutate `state`).
 * - add_tier:    append a new tier { fromMinor: 0, rateBps: 0 }
 * - remove_tier: drop the tier at `index`
 * - set_rate:    set rateBps on the tier at `index`
 * - set_from:    set fromMinor on the tier at `index`
 * - reset:       return initialRulesState
 * Make the switch exhaustive so TS flags any missing case via `never`.
 */
export function rulesReducer(state: RulesState, action: RulesAction): RulesState {
  // TODO: implement.
  return state;
}

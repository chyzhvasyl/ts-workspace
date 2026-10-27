/**
 * Generic time-travel state. The same pattern powers undo/redo everywhere.
 */
export interface HistoryState<T> {
  past: T[];
  present: T;
  future: T[];
}

export type HistoryAction<T> =
  | { type: 'set'; value: T } // push a new present, clears future
  | { type: 'undo' }
  | { type: 'redo' }
  | { type: 'reset'; value: T };

export function initialHistory<T>(present: T): HistoryState<T> {
  return { past: [], present, future: [] };
}

/**
 * 🎯 TODO (pure, generic):
 *  - set:   past = [...past, present]; present = value; future = []
 *  - undo:  if past empty → no change. Else pop last past → present,
 *           push old present to FRONT of future.
 *  - redo:  if future empty → no change. Else shift first future → present,
 *           push old present to END of past.
 *  - reset: initialHistory(value)
 *  Never mutate the incoming state.
 */
export function historyReducer<T>(
  state: HistoryState<T>,
  action: HistoryAction<T>,
): HistoryState<T> {
  // TODO: implement.
  return state;
}

export const canUndo = <T>(s: HistoryState<T>): boolean => s.past.length > 0;
export const canRedo = <T>(s: HistoryState<T>): boolean => s.future.length > 0;

import type { DependencyList } from 'react';

export interface AsyncState<T> {
  status: 'idle' | 'loading' | 'success' | 'error';
  data: T | null;
  error: Error | null;
}

/**
 * 🎯 TODO: a reusable data-fetching hook.
 *
 * Requirements:
 *  - On mount and whenever `deps` change: set status 'loading', call `factory(signal)`.
 *  - On success → { status:'success', data, error:null }.
 *  - On failure → { status:'error', data:null, error }.
 *  - Use an AbortController; pass its signal to `factory`.
 *  - CLEANUP: abort the in-flight request when deps change / unmount,
 *    and IGNORE results from a stale request (race-condition safe).
 *  - Do NOT call setState after the effect was cleaned up.
 *
 * Hint: useState<AsyncState<T>> + useEffect(() => { ...; return cleanup }, deps).
 * Ignore AbortError when setting the error state.
 */
export function useAsync<T>(
  factory: (signal: AbortSignal) => Promise<T>,
  deps: DependencyList,
): AsyncState<T> {
  // TODO: implement with useState + useEffect + AbortController.
  return { status: 'idle', data: null, error: null };
}

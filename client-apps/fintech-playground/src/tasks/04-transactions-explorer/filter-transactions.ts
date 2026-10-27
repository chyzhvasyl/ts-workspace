import { Transaction, TransactionStatus } from '../../shared/domain/types';

export type SortBy = 'date' | 'amount';
export type SortDir = 'asc' | 'desc';

export interface ExplorerFilters {
  query: string; // matches id / customerEmail / country (case-insensitive)
  status: TransactionStatus | 'all';
  sortBy: SortBy;
  sortDir: SortDir;
}

export interface ExplorerSummary {
  count: number;
  volumeMinor: number; // sum of amount.amountMinor
  feesMinor: number; // sum of fee.amountMinor
}

/**
 * 🎯 TODO (pure): filter + sort transactions.
 * 1. Keep tx where status matches (or filters.status === 'all').
 * 2. Keep tx where query is empty OR id/customerEmail/country contains query (case-insensitive).
 * 3. Sort by sortBy ('date' → createdAt, 'amount' → amount.amountMinor), respecting sortDir.
 * Return a NEW array (don't mutate the input).
 */
export function applyFilters(
  transactions: ReadonlyArray<Transaction>,
  filters: ExplorerFilters,
): Transaction[] {
  // TODO: implement.
  return [...transactions];
}

/**
 * 🎯 TODO (pure): aggregate the (already filtered) list.
 */
export function summarize(transactions: ReadonlyArray<Transaction>): ExplorerSummary {
  // TODO: implement.
  return { count: 0, volumeMinor: 0, feesMinor: 0 };
}

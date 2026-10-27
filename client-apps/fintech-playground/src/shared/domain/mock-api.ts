import { money } from './money';
import { Balance, Merchant, Transaction, TransactionStatus } from './types';

/**
 * A fake async API that mimics a network layer.
 * Use it in data-fetching tasks (loading / error / race conditions / abort).
 * Latency and failure rate are configurable so you can reproduce edge cases.
 */

const MERCHANTS: Merchant[] = [
  { id: 'm_glovo', name: 'Glovo', country: 'ES', mcc: '5814' },
  { id: 'm_setapp', name: 'Setapp', country: 'UA', mcc: '5734' },
  { id: 'm_preply', name: 'Preply', country: 'US', mcc: '8299' },
];

const METHODS = ['card', 'apple_pay', 'google_pay', 'paypal'] as const;
const STATUSES: TransactionStatus[] = [
  'approved',
  'declined',
  'refunded',
  'chargeback',
  'pending',
];
const COUNTRIES = ['US', 'GB', 'DE', 'UA', 'PL', 'ES', 'FR'];

function seeded(n: number): number {
  const x = Math.sin(n * 99.7) * 10000;
  return x - Math.floor(x);
}

function buildTransactions(count: number): Transaction[] {
  return Array.from({ length: count }, (_, i) => {
    const r = seeded(i + 1);
    const merchant = MERCHANTS[i % MERCHANTS.length]!;
    const amountMajor = Math.round((5 + r * 480) * 100) / 100;
    const status = STATUSES[Math.floor(seeded(i + 7) * STATUSES.length)]!;
    return {
      id: `tx_${(1000 + i).toString()}`,
      createdAt: new Date(Date.UTC(2026, 4, 1 + (i % 28), i % 24, i % 60)).toISOString(),
      merchantId: merchant.id,
      customerEmail: `user${i % 50}@example.com`,
      amount: money(amountMajor, 'USD'),
      fee: money(Math.round(amountMajor * 0.029 * 100) / 100 + 0.3, 'USD'),
      status,
      method: METHODS[i % METHODS.length]!,
      country: COUNTRIES[i % COUNTRIES.length]!,
    };
  });
}

const TRANSACTIONS = buildTransactions(60);

const BALANCES: Balance[] = [
  {
    currency: 'USD',
    available: money(128_540.12, 'USD'),
    pending: money(12_300, 'USD'),
    reserved: money(4_500, 'USD'),
  },
  {
    currency: 'EUR',
    available: money(86_220.0, 'EUR'),
    pending: money(8_100, 'EUR'),
    reserved: money(2_000, 'EUR'),
  },
  {
    currency: 'GBP',
    available: money(31_980.5, 'GBP'),
    pending: money(0, 'GBP'),
    reserved: money(1_000, 'GBP'),
  },
];

interface FetchOptions {
  /** Milliseconds of artificial latency (default 600). */
  delayMs?: number;
  /** 0..1 chance the request rejects (default 0). */
  failRate?: number;
  /** Pass an AbortSignal to support cancellation. */
  signal?: AbortSignal;
}

function respond<T>(data: T, opts: FetchOptions = {}): Promise<T> {
  const { delayMs = 600, failRate = 0, signal } = opts;
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException('Aborted', 'AbortError'));
      return;
    }
    const timer = setTimeout(() => {
      if (Math.random() < failRate) {
        reject(new Error('Network error: request failed'));
        return;
      }
      resolve(data);
    }, delayMs);
    signal?.addEventListener('abort', () => {
      clearTimeout(timer);
      reject(new DOMException('Aborted', 'AbortError'));
    });
  });
}

export const mockApi = {
  getMerchants: (opts?: FetchOptions) => respond(MERCHANTS, opts),
  getTransactions: (opts?: FetchOptions) => respond(TRANSACTIONS, opts),
  getBalances: (opts?: FetchOptions) => respond(BALANCES, opts),
  /** Filtered server-side search — used for debounced search tasks. */
  searchTransactions: (query: string, opts?: FetchOptions) =>
    respond(
      TRANSACTIONS.filter(
        (t) =>
          t.id.includes(query) ||
          t.customerEmail.includes(query) ||
          t.country.toLowerCase().includes(query.toLowerCase()),
      ),
      opts,
    ),
  /** Simulated mutation for optimistic-update tasks. */
  updateTransactionStatus: (
    id: string,
    status: TransactionStatus,
    opts?: FetchOptions,
  ) => {
    const tx = TRANSACTIONS.find((t) => t.id === id);
    if (!tx) return Promise.reject(new Error(`Transaction ${id} not found`));
    return respond({ ...tx, status }, opts);
  },
};

/** Synchronous dataset for tasks that don't need network simulation. */
export const sampleTransactions = TRANSACTIONS;

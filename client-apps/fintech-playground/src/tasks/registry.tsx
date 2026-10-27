import type { ComponentType } from 'react';

import type { TaskMeta } from '../pages/task-page';

import { FeeCalculatorPage, meta as feeCalculator } from './01-fee-calculator/page';
import { InvoiceBuilderPage, meta as invoiceBuilder } from './02-invoice-builder/page';
import { CommissionRulesPage, meta as commissionRules } from './03-commission-rules/page';
import {
  meta as transactionsExplorer,
  TransactionsExplorerPage,
} from './04-transactions-explorer/page';
import { BalanceLoaderPage, meta as balanceLoader } from './05-balance-loader/page';
import { meta as payoutForm, PayoutFormPage } from './06-payout-form/page';
import { meta as settingsContext, SettingsContextPage } from './07-settings-context/page';
import {
  meta as recalculationHistory,
  RecalculationHistoryPage,
} from './08-recalculation-history/page';

export interface TaskEntry {
  meta: TaskMeta;
  path: string;
  Component: ComponentType;
}

export const TASKS: TaskEntry[] = [
  {
    meta: feeCalculator,
    path: `/task/${feeCalculator.id}`,
    Component: FeeCalculatorPage,
  },
  {
    meta: invoiceBuilder,
    path: `/task/${invoiceBuilder.id}`,
    Component: InvoiceBuilderPage,
  },
  {
    meta: commissionRules,
    path: `/task/${commissionRules.id}`,
    Component: CommissionRulesPage,
  },
  {
    meta: transactionsExplorer,
    path: `/task/${transactionsExplorer.id}`,
    Component: TransactionsExplorerPage,
  },
  {
    meta: balanceLoader,
    path: `/task/${balanceLoader.id}`,
    Component: BalanceLoaderPage,
  },
  { meta: payoutForm, path: `/task/${payoutForm.id}`, Component: PayoutFormPage },
  {
    meta: settingsContext,
    path: `/task/${settingsContext.id}`,
    Component: SettingsContextPage,
  },
  {
    meta: recalculationHistory,
    path: `/task/${recalculationHistory.id}`,
    Component: RecalculationHistoryPage,
  },
];

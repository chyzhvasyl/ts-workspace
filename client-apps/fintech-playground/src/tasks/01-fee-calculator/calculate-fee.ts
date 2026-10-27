import type { Money } from '../../shared/domain/money';
import { TieredCommission } from '../../shared/domain/money';
import type { CommissionRule, CommissionTier } from '../../shared/domain/types';

const calculatePercentageFee = (amount: Money, rateBps: number): number =>
  (amount.amountMinor * rateBps) / 10_000;

const calculateFixedFee = (amount: Money): number => amount.amountMinor;

const calculatePercentagePlusFixed = (
  amount: Money,
  fixed: Money,
  rateBps: number,
): number =>
  calculatePercentageFee(amount, rateBps) + calculateFixedFee(fixed.amountMinor);

const calculateTieredFee = (amount: Money, tiers: CommissionTier[]): number => {
  let maxTier = tiers[0];

  for (const tier of tiers) {
    if (maxTier.fromMinor <= amount.amountMinor && tier.fromMinor > maxTier.fromMinor) {
      maxTier = tier;
    }
  }

  return maxTier.fromMinor;
};

/**
 * 🎯 TODO (pure function — no React here).
 *
 * Given a gross `amount` and a `CommissionRule`, return the fee as Money.
 * Rules (rateBps is in basis points: 250 bps = 2.5%):
 *   - percentage:            fee = amount * rateBps / 10_000
 *   - fixed:                 fee = rule.fee
 *   - percentage_plus_fixed: fee = amount * rateBps / 10_000 + fixed
 *   - tiered:                pick the tier with the highest `fromMinor`
 *                            that is <= amount, then apply its rateBps
 *
 * Work in MINOR units (integers). Round with Math.round. Keep amount.currency.
 * This is the kind of domain logic Solidgate's finance team lives in.
 */
export function calculateFee(amount: Money, rule: CommissionRule): Money {
  // TODO: implement and replace this stub.
  throw new Error('calculateFee is not implemented yet');
}

/** Net amount the merchant receives = amount - fee. */
export function calculateNet(amount: Money, rule: CommissionRule): Money {
  // TODO: reuse calculateFee.
  throw new Error('calculateNet is not implemented yet');
}

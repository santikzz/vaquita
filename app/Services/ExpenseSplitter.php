<?php

namespace App\Services;

use InvalidArgumentException;

/**
 * Pure money splitting. Input and output are integer minor units (cents).
 * Rounding: integer floor division, then the remainder cents are handed out
 * one by one in ascending member id order so results are deterministic.
 * Returns [member_id => ['amount_minor' => int, 'share_units' => ?int]].
 */
class ExpenseSplitter
{
    public const METHOD_EQUAL = 'equal';

    public const METHOD_AMOUNTS = 'amounts';

    public const METHOD_SHARES = 'shares';

    public const METHODS = [self::METHOD_EQUAL, self::METHOD_AMOUNTS, self::METHOD_SHARES];

    public function split(int $amountMinor, string $method, array $input): array
    {
        if ($amountMinor < 1) {
            throw new InvalidArgumentException('Amount must be a positive integer of minor units.');
        }

        return match ($method) {
            self::METHOD_EQUAL => $this->splitEqual($amountMinor, $input),
            self::METHOD_AMOUNTS => $this->splitAmounts($amountMinor, $input),
            self::METHOD_SHARES => $this->splitShares($amountMinor, $input),
            default => throw new InvalidArgumentException("Unknown split method [{$method}]."),
        };
    }

    // input: list of member ids
    private function splitEqual(int $amountMinor, array $memberIds): array
    {
        $memberIds = array_values(array_unique(array_map('intval', $memberIds)));

        if ($memberIds === []) {
            throw new InvalidArgumentException('Equal split needs at least one member.');
        }

        sort($memberIds);

        $count = count($memberIds);
        $base = intdiv($amountMinor, $count);
        $remainder = $amountMinor % $count;

        $shares = [];
        foreach ($memberIds as $i => $memberId) {
            $shares[$memberId] = [
                'amount_minor' => $base + ($i < $remainder ? 1 : 0),
                'share_units' => null,
            ];
        }

        return $shares;
    }

    // input: [member_id => amount_minor], must sum exactly to the total
    private function splitAmounts(int $amountMinor, array $amounts): array
    {
        if ($amounts === []) {
            throw new InvalidArgumentException('Amounts split needs at least one member.');
        }

        $shares = [];
        $sum = 0;

        foreach ($amounts as $memberId => $amount) {
            $amount = (int) $amount;

            if ($amount < 0) {
                throw new InvalidArgumentException('Share amounts cannot be negative.');
            }

            $sum += $amount;
            $shares[(int) $memberId] = ['amount_minor' => $amount, 'share_units' => null];
        }

        if ($sum !== $amountMinor) {
            throw new InvalidArgumentException('Share amounts must sum exactly to the expense amount.');
        }

        return $shares;
    }

    // input: [member_id => share units], e.g. couples weigh 2
    private function splitShares(int $amountMinor, array $units): array
    {
        if ($units === []) {
            throw new InvalidArgumentException('Shares split needs at least one member.');
        }

        $totalUnits = 0;
        $normalized = [];

        foreach ($units as $memberId => $memberUnits) {
            $memberUnits = (int) $memberUnits;

            if ($memberUnits < 1) {
                throw new InvalidArgumentException('Share units must be positive integers.');
            }

            $totalUnits += $memberUnits;
            $normalized[(int) $memberId] = $memberUnits;
        }

        ksort($normalized);

        $shares = [];
        $assigned = 0;

        foreach ($normalized as $memberId => $memberUnits) {
            $amount = intdiv($amountMinor * $memberUnits, $totalUnits);
            $assigned += $amount;
            $shares[$memberId] = ['amount_minor' => $amount, 'share_units' => $memberUnits];
        }

        // hand out the rounding remainder one cent at a time, lowest member id first
        $remainder = $amountMinor - $assigned;
        foreach (array_keys($shares) as $memberId) {
            if ($remainder === 0) {
                break;
            }
            $shares[$memberId]['amount_minor']++;
            $remainder--;
        }

        return $shares;
    }
}

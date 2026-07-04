<?php

use App\Services\BalanceService;

beforeEach(function () {
    $this->service = new BalanceService;
});

test('no transfers when everyone is even', function () {
    expect($this->service->suggestTransfers([1 => 0, 2 => 0]))->toBe([]);
});

test('single debtor pays single creditor', function () {
    $transfers = $this->service->suggestTransfers([1 => 500, 2 => -500]);

    expect($transfers)->toBe([
        ['from_member_id' => 2, 'to_member_id' => 1, 'amount_minor' => 500],
    ]);
});

test('greedy matching keeps the transfer list short', function () {
    // 3 owes 300, 4 owes 100; 1 is owed 250, 2 is owed 150
    $transfers = $this->service->suggestTransfers([1 => 250, 2 => 150, 3 => -300, 4 => -100]);

    expect(count($transfers))->toBeLessThanOrEqual(3);

    // applying the transfers must zero every balance
    $balances = [1 => 250, 2 => 150, 3 => -300, 4 => -100];
    foreach ($transfers as $transfer) {
        $balances[$transfer['from_member_id']] += $transfer['amount_minor'];
        $balances[$transfer['to_member_id']] -= $transfer['amount_minor'];
    }

    expect(array_filter($balances))->toBe([]);
});

test('transfer amounts are always positive integers', function () {
    $transfers = $this->service->suggestTransfers([1 => 333, 2 => -111, 3 => -222]);

    foreach ($transfers as $transfer) {
        expect($transfer['amount_minor'])->toBeGreaterThan(0);
    }
});

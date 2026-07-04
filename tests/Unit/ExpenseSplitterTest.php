<?php

use App\Services\ExpenseSplitter;

beforeEach(function () {
    $this->splitter = new ExpenseSplitter;
});

// ---------------------------------------------------------------------------
// equal split
// ---------------------------------------------------------------------------

test('equal split divides evenly when possible', function () {
    $shares = $this->splitter->split(900, ExpenseSplitter::METHOD_EQUAL, [1, 2, 3]);

    expect($shares[1]['amount_minor'])->toBe(300);
    expect($shares[2]['amount_minor'])->toBe(300);
    expect($shares[3]['amount_minor'])->toBe(300);
});

test('equal split hands out remainder cents to the lowest member ids', function () {
    $shares = $this->splitter->split(1000, ExpenseSplitter::METHOD_EQUAL, [3, 1, 2]);

    expect($shares[1]['amount_minor'])->toBe(334);
    expect($shares[2]['amount_minor'])->toBe(333);
    expect($shares[3]['amount_minor'])->toBe(333);
});

test('equal split always sums exactly to the total', function () {
    foreach ([1, 7, 99, 1001, 12345] as $amount) {
        $shares = $this->splitter->split($amount, ExpenseSplitter::METHOD_EQUAL, [1, 2, 3, 4, 5, 6, 7]);
        expect(array_sum(array_column($shares, 'amount_minor')))->toBe($amount);
    }
});

test('equal split works for a single member', function () {
    $shares = $this->splitter->split(500, ExpenseSplitter::METHOD_EQUAL, [9]);

    expect($shares[9]['amount_minor'])->toBe(500);
});

test('equal split deduplicates member ids', function () {
    $shares = $this->splitter->split(1000, ExpenseSplitter::METHOD_EQUAL, [1, 1, 2]);

    expect($shares)->toHaveCount(2);
    expect($shares[1]['amount_minor'])->toBe(500);
});

test('equal split rejects an empty member list', function () {
    $this->splitter->split(1000, ExpenseSplitter::METHOD_EQUAL, []);
})->throws(InvalidArgumentException::class);

// ---------------------------------------------------------------------------
// amounts split
// ---------------------------------------------------------------------------

test('amounts split keeps the exact amounts given', function () {
    $shares = $this->splitter->split(1000, ExpenseSplitter::METHOD_AMOUNTS, [1 => 700, 2 => 300]);

    expect($shares[1]['amount_minor'])->toBe(700);
    expect($shares[2]['amount_minor'])->toBe(300);
});

test('amounts split rejects amounts that do not sum to the total', function () {
    $this->splitter->split(1000, ExpenseSplitter::METHOD_AMOUNTS, [1 => 700, 2 => 200]);
})->throws(InvalidArgumentException::class);

test('amounts split rejects negative amounts', function () {
    $this->splitter->split(1000, ExpenseSplitter::METHOD_AMOUNTS, [1 => 1100, 2 => -100]);
})->throws(InvalidArgumentException::class);

// ---------------------------------------------------------------------------
// shares split
// ---------------------------------------------------------------------------

test('shares split weighs members by units', function () {
    // couple counts double: 2 + 1 + 1 = 4 units over 1000
    $shares = $this->splitter->split(1000, ExpenseSplitter::METHOD_SHARES, [1 => 2, 2 => 1, 3 => 1]);

    expect($shares[1]['amount_minor'])->toBe(500);
    expect($shares[2]['amount_minor'])->toBe(250);
    expect($shares[3]['amount_minor'])->toBe(250);
    expect($shares[1]['share_units'])->toBe(2);
});

test('shares split distributes rounding remainder and sums exactly', function () {
    $shares = $this->splitter->split(1000, ExpenseSplitter::METHOD_SHARES, [1 => 1, 2 => 1, 3 => 1]);

    expect(array_sum(array_column($shares, 'amount_minor')))->toBe(1000);
    expect($shares[1]['amount_minor'])->toBe(334);
});

test('shares split rejects zero or negative units', function () {
    $this->splitter->split(1000, ExpenseSplitter::METHOD_SHARES, [1 => 0, 2 => 1]);
})->throws(InvalidArgumentException::class);

// ---------------------------------------------------------------------------
// guards
// ---------------------------------------------------------------------------

test('split rejects a non positive amount', function () {
    $this->splitter->split(0, ExpenseSplitter::METHOD_EQUAL, [1]);
})->throws(InvalidArgumentException::class);

test('split rejects an unknown method', function () {
    $this->splitter->split(1000, 'percentages', [1]);
})->throws(InvalidArgumentException::class);

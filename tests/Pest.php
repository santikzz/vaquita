<?php

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

// Feature tests boot the Laravel app and reset the database between tests.
pest()->extend(TestCase::class)
    ->use(RefreshDatabase::class)
    ->in('Feature');

// Unit tests run in isolation, no app/database.
pest()->extend(TestCase::class)->in('Unit');

<?php

namespace App\Console\Commands;

use Exception;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Redis;

class RedisCheck extends Command
{
    protected $signature = 'redis:check';

    protected $description = 'Check Redis connection';

    public function handle()
    {
        if (! extension_loaded('redis')) {
            $this->error('Redis PHP extension is not installed');

            return 1;
        }

        try {
            Redis::ping();
            $this->info('Redis connection successful');
        } catch (Exception $e) {
            $this->error('Redis connection failed: '.$e->getMessage());

            return 1;
        }
    }
}

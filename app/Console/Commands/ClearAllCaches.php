<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class ClearAllCaches extends Command
{
    protected $signature = 'cache:clear-all';

    protected $description = 'Clear application, config, route, view, and event caches';

    public function handle()
    {
        $this->call('cache:clear');
        $this->call('config:clear');
        $this->call('route:clear');
        $this->call('view:clear');
        $this->call('event:clear');

        $this->info('All caches cleared.');

        return Command::SUCCESS;
    }
}

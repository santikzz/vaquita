<?php

namespace App\Jobs;

use App\Services\SitemapService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class GenerateSitemap implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function handle(SitemapService $sitemapService): void
    {
        $sitemapService->generate();
        Log::info('Sitemap generated successfully');
    }

    public function failed(\Throwable $exception): void
    {
        Log::error('Sitemap generation failed: '.$exception->getMessage());
    }
}

<?php

namespace App\Services;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\File;

/**
 * Generates sitemap.xml (a sitemap index) + per-section sitemap files and robots.txt.
 *
 * Output:
 *   public/sitemap.xml            sitemap index pointing at every section
 *   public/sitemap/sitemap-*.xml  one or more files per section (chunked at MAX_URLS)
 *   public/robots.txt             allows public routes, disallows dashboard + api
 *
 * Run with:  php artisan sitemap:generate  (add --queue to run as a background job)
 *
 * --- How to add routes ---
 *
 * Static pages: add an entry to staticRoutes(). 'path' is relative to the app url.
 *
 *   ['path' => '/about', 'changefreq' => 'monthly', 'priority' => '0.5'],
 *
 * Dynamic pages from the database: add an entry to resources(). Each resource is
 * paginated automatically and split across as many files as needed.
 *
 *   [
 *       'name'       => 'posts',                                  // used in the filename
 *       'query'      => fn () => Post::published()->orderBy('id'),// Eloquent builder
 *       'url'        => fn ($post) => url("/blog/{$post->slug}"), // absolute url per row
 *       'lastmod'    => fn ($post) => $post->updated_at,          // Carbon|null
 *       'changefreq' => 'weekly',
 *       'priority'   => '0.7',
 *   ],
 *
 * Robots disallow rules live in robotsDisallow().
 */
class SitemapService
{
    private const MAX_URLS = 5000;

    private const CHUNK = 500;

    private string $dir;

    private array $sitemaps = [];

    public function generate(): void
    {
        $this->dir = public_path('sitemap');
        $this->sitemaps = [];

        File::ensureDirectoryExists($this->dir);

        foreach (glob("{$this->dir}/*.xml") as $file) {
            unlink($file);
        }

        $this->generateStatic();

        foreach ($this->resources() as $resource) {
            $this->generateResource($resource);
        }

        $this->generateIndex();
        $this->generateRobotsTxt();
    }

    /**
     * Static pages. Edit this list to add or remove fixed routes.
     */
    private function staticRoutes(): array
    {
        return [
            ['path' => '/', 'changefreq' => 'daily', 'priority' => '1.0'],
        ];
    }

    /**
     * Database-backed resources. Each entry: name, query, url, lastmod, changefreq, priority.
     * See the class header for the full shape.
     */
    private function resources(): array
    {
        return [
            // [
            //     'name'       => 'users',
            //     'query'      => fn () => \App\Models\User::query()->orderBy('id'),
            //     'url'        => fn ($user) => url("/users/{$user->id}"),
            //     'lastmod'    => fn ($user) => $user->updated_at,
            //     'changefreq' => 'weekly',
            //     'priority'   => '0.7',
            // ],
        ];
    }

    /**
     * Paths disallowed in robots.txt. Everything else is allowed.
     */
    private function robotsDisallow(): array
    {
        return [
            '/dashboard/',
            '/api/',
            '/login',
            '/register',
            '/forgot-password',
            '/reset-password',
            '/settings/',
        ];
    }

    private function generateStatic(): void
    {
        $file = "{$this->dir}/sitemap-static.xml";
        $handle = fopen($file, 'w');

        $this->writeHeader($handle);
        foreach ($this->staticRoutes() as $route) {
            $this->writeUrl($handle, url($route['path']), now()->toISOString(), $route['changefreq'], $route['priority']);
        }
        $this->writeFooter($handle);

        fclose($handle);
        $this->sitemaps[] = ['loc' => url('/sitemap/sitemap-static.xml'), 'lastmod' => now()->toISOString()];
    }

    private function generateResource(array $resource): void
    {
        $index = 1;
        $count = 0;
        $handle = null;
        $lastmod = now()->toISOString();
        $filename = fn ($i) => "sitemap-{$resource['name']}-".str_pad($i, 3, '0', STR_PAD_LEFT).'.xml';

        $query = $resource['query']();

        if (! $query instanceof Builder) {
            return;
        }

        $query->chunk(self::CHUNK, function ($rows) use (&$index, &$count, &$handle, &$lastmod, $filename, $resource) {
            foreach ($rows as $row) {
                if ($count === 0) {
                    $handle = fopen("{$this->dir}/{$filename($index)}", 'w');
                    $this->writeHeader($handle);
                }

                $rowLastmod = $resource['lastmod']($row)?->toISOString() ?? now()->toISOString();
                $this->writeUrl($handle, $resource['url']($row), $rowLastmod, $resource['changefreq'], $resource['priority']);
                $count++;

                if ($rowLastmod > $lastmod) {
                    $lastmod = $rowLastmod;
                }

                if ($count >= self::MAX_URLS) {
                    $this->writeFooter($handle);
                    fclose($handle);
                    $this->sitemaps[] = ['loc' => url("/sitemap/{$filename($index)}"), 'lastmod' => $lastmod];
                    $index++;
                    $count = 0;
                    $lastmod = now()->toISOString();
                }
            }
        });

        if ($count > 0) {
            $this->writeFooter($handle);
            fclose($handle);
            $this->sitemaps[] = ['loc' => url("/sitemap/{$filename($index)}"), 'lastmod' => $lastmod];
        }
    }

    private function generateIndex(): void
    {
        $handle = fopen(public_path('sitemap.xml'), 'w');

        fwrite($handle, '<?xml version="1.0" encoding="UTF-8"?>'."\n");
        fwrite($handle, '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'."\n");

        foreach ($this->sitemaps as $sitemap) {
            fwrite($handle, "  <sitemap>\n");
            fwrite($handle, '    <loc>'.htmlspecialchars($sitemap['loc'])."</loc>\n");
            fwrite($handle, "    <lastmod>{$sitemap['lastmod']}</lastmod>\n");
            fwrite($handle, "  </sitemap>\n");
        }

        fwrite($handle, '</sitemapindex>');
        fclose($handle);
    }

    private function generateRobotsTxt(): void
    {
        $lines = ['User-agent: *', 'Allow: /', ''];

        foreach ($this->robotsDisallow() as $path) {
            $lines[] = "Disallow: {$path}";
        }

        $lines[] = '';
        $lines[] = 'Sitemap: '.url('/sitemap.xml');

        file_put_contents(public_path('robots.txt'), implode("\n", $lines)."\n");
    }

    private function writeHeader($handle): void
    {
        fwrite($handle, '<?xml version="1.0" encoding="UTF-8"?>'."\n");
        fwrite($handle, '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'."\n");
    }

    private function writeFooter($handle): void
    {
        fwrite($handle, '</urlset>');
    }

    private function writeUrl($handle, string $url, string $lastmod, string $changefreq, string $priority): void
    {
        fwrite($handle, "  <url>\n");
        fwrite($handle, '    <loc>'.htmlspecialchars($url)."</loc>\n");
        fwrite($handle, "    <lastmod>{$lastmod}</lastmod>\n");
        fwrite($handle, "    <changefreq>{$changefreq}</changefreq>\n");
        fwrite($handle, "    <priority>{$priority}</priority>\n");
        fwrite($handle, "  </url>\n");
    }
}

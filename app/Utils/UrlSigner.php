<?php

/**
 * ---------------------------------------------------------
 * File app/Utils/UrlSigner.php
 * Author: Santiago Bugnón
 * Created: 27 Nov, 2025
 * Description:
 *      Utility class for signing and verifying URLs with expiration.
 *      Different from the built-in Laravel signed URLs, this implementation
 *      supports http/https mismatches which is useful in certain server setups.
 *
 *       Usuage examples:
 *
 *       - 1. Carbon instance
 *       UrlSigner::signUrl('/image/test', now()->addMinutes(10), []);
 *
 *       - 2. Raw timestamp
 *       UrlSigner::signUrl('/image/test', time() + 600, []);
 *
 *       - 3. Date string
 *       UrlSigner::signUrl('/image/test', '2025-10-29 12:30:00', []);
 *
 *       --
 *
 *       UrlSigner::verifySignature(); // call within controller method to verify incoming signed URL
 *
 * Intelectual property of Nebula Solutions.
 * ---------------------------------------------------------
 */

namespace App\Utils;

use Carbon\Carbon;
use DateTimeInterface;
use Illuminate\Support\Facades\Config;

class UrlSigner
{
    public static function signUrl(string $path, float|int|string|DateTimeInterface $expires, array $params = []): string
    {
        // $expires = now()->add($minutes)->timestamp; // generate expiration timestamp
        $route = route($path); // allow laravel named routes, fallback to path if not named route

        // normalize expiration timestamp to UNIX
        if ($expires instanceof DateTimeInterface) {
            $expires = $expires->getTimestamp();
        } elseif (! is_numeric($expires)) {
            $expires = Carbon::parse($expires)->timestamp;
        }

        $query = array_merge($params, ['expires' => $expires]);
        ksort($query); // sort parameters for consistent signature

        // build the URL to be signed
        $base = trim(parse_url(url($route), PHP_URL_PATH), '/');
        $data = $base.'?'.http_build_query($query);

        $signature = hash_hmac('sha256', $data, Config::get('app.key')); // create HMAC signature

        return url($route).'?'.http_build_query(array_merge($query, ['signature' => $signature]));
    }

    public static function verifySignature(): bool
    {
        $request = request();
        $signature = $request->query('signature');
        $expires = $request->query('expires');

        if (! $signature || ! $expires || now()->timestamp > $expires) {
            return false; // missing signature or expired
        }

        $query = $request->query();
        unset($query['signature']); // remove signature for verification
        ksort($query); // sort parameters for consistent signature

        $base = trim($request->path(), '/');
        $data = $base.'?'.http_build_query($query);

        $expected = hash_hmac('sha256', $data, Config::get('app.key')); // recreate expected signature

        return hash_equals($expected, $signature); // compare signatures securely
    }
}

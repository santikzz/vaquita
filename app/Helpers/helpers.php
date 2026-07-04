<?php

use App\Models\Settings;
use Illuminate\Support\Facades\Storage;

/**
 * Globally accessible helper functions.
 * Imported from composer.json via "files" autoloading.
 */

/**
 * Setting helper to get application settings.
 * eg: setting('site_name', 'Default Site Name')
 *     setting('currency', 'USD')
 */
if (! function_exists('setting')) {
    function setting(string $key, $default = null)
    {
        return Settings::get($key, $default);
    }
}

/**
 * Returns the public media disk name (avatars, logos, editor images).
 * Controlled via MEDIA_PUBLIC_DISK (falls back to MEDIA_DISK) in .env.
 */
if (! function_exists('mediaDisk')) {
    function mediaDisk(): string
    {
        return config('filesystems.media_public_disk', 'public');
    }
}

/**
 * Returns the private media disk name (uploaded documents). Files here are only
 * served through short-lived signed URLs, never a public URL. Controlled via
 * MEDIA_PRIVATE_DISK in .env.
 */
if (! function_exists('mediaPrivateDisk')) {
    function mediaPrivateDisk(): string
    {
        return config('filesystems.media_private_disk', 'private');
    }
}

/**
 * Resolves a stored file path to a full public URL using the public media disk.
 * Always store raw paths in the DB, never full URLs.
 */
if (! function_exists('mediaUrl')) {
    function mediaUrl(?string $path): ?string
    {
        if (! $path) {
            return null;
        }

        return Storage::disk(mediaDisk())->url($path);
    }
}

/**
 * Generates a short-lived signed URL for a private media file. $disposition
 * controls whether the browser previews ('inline') or downloads ('attachment')
 * the file. Returns null for empty paths.
 */
if (! function_exists('mediaTemporaryUrl')) {
    function mediaTemporaryUrl(?string $path, int $minutes, string $disposition = 'inline', ?string $filename = null): ?string
    {
        if (! $path) {
            return null;
        }

        $options = [];

        if ($disposition === 'attachment' && $filename) {
            $options['ResponseContentDisposition'] = 'attachment; filename="'.addslashes($filename).'"';
        }

        return Storage::disk(mediaPrivateDisk())->temporaryUrl($path, now()->addMinutes($minutes), $options);
    }
}

<?php

/**
 * ---------------------------------------------------------
 * File app/Utils/SafeStore.php
 * Author: Santiago Bugnón
 * Created: 3 Nov, 2025
 * Description:
 *    Utility class for securely storing files with UUID filenames
 *
 * Usuage Example:
 *
 *   $path = SafeStore::store($uploadedFile, 'avatars', 'public');
 *   $path -> "/storage/public/avatars/a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6.jpg"
 *
 * Intelectual property of Nebula Solutions.
 * ---------------------------------------------------------
 */

namespace App\Utils;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;

class SafeStore
{
    public static function store(UploadedFile $file, string $directory = 'images', string $disk = 'public'): string
    {
        $filename = Str::uuid().'.'.$file->extension();

        return $file->storeAs($directory, $filename, $disk);
    }
}

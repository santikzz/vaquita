<?php

/**
 * ---------------------------------------------------------
 * File app/Utils/UidGenerator.php
 * Author: Santiago Bugnón
 * Created: 12 Aug, 2025
 * Description:
 *      Utility class for generating unique alphanumeric UIDs for models.
 *
 * Example Usuage:
 *    $uid = UidGenerator::generate(User::class, 'uid', 16);
 *    echo $uid; // 'a1b2c3d4e5f6g7h8'
 *
 * Intelectual property of Nebula Solutions.
 * ---------------------------------------------------------
 */

namespace App\Utils;

use Illuminate\Support\Str;

class UidGenerator
{
    public static function generate(string $model, string $column = 'uid', int $length = 12): string
    {
        do {
            $uid = Str::random($length);
        } while ($model::where($column, $uid)->exists());

        return $uid;
    }
}

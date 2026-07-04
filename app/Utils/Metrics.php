<?php

/**
 * ---------------------------------------------------------
 * File app/Utils/Metrics.php
 * Author: Santiago Bugnón
 * Created: 30 Nov, 2025
 * Description:
 *      Utility class for measuring execution time, memory usage, and CPU usage.
 *
 * Example Usuage:
 *     $start = Metrics::start();
 *     // ... code to measure ...
 *     $metrics = Metrics::end($start, "Code Block Metrics", true); // set to true to log the metrics to laravel.log
 *
 * Intelectual property of Nebula Solutions.
 * ---------------------------------------------------------
 */

namespace App\Utils;

use Log;

class Metrics
{
    public static function start()
    {
        return [
            'time' => microtime(true),
            'memory' => memory_get_usage(),
            'cpu' => getrusage(),
        ];
    }

    public static function end($start, $label = 'Metrics', $log = false)
    {
        $endTime = microtime(true);
        $endMemory = memory_get_usage();
        $endCpu = getrusage();

        $timeDiff = $endTime - $start['time'];
        $memoryDiff = $endMemory - $start['memory'];
        $cpuDiff = [
            'user_time' => $endCpu['ru_utime.tv_sec'] + $endCpu['ru_utime.tv_usec'] / 1e6 - ($start['cpu']['ru_utime.tv_sec'] + $start['cpu']['ru_utime.tv_usec'] / 1e6),
            'system_time' => $endCpu['ru_stime.tv_sec'] + $endCpu['ru_stime.tv_usec'] / 1e6 - ($start['cpu']['ru_stime.tv_sec'] + $start['cpu']['ru_stime.tv_usec'] / 1e6),
        ];

        $metrics = [
            'time' => number_format($timeDiff * 1000, 2).' ms',
            'memory' => number_format($memoryDiff / 1024 ** 2, 2).' mb',
            'cpu' => number_format(($cpuDiff['user_time'] + $cpuDiff['system_time']) * 1000, 2).' ms',
        ];

        if ($log) {
            Log::debug($label, $metrics);
        }

        return $metrics;
    }
}

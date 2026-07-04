<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Would you like the install button to appear on all pages?
      Set true/false
    |--------------------------------------------------------------------------
    */

    // the app renders its own install button on the profile page
    'install-button' => false,

    /*
    |--------------------------------------------------------------------------
    | PWA Manifest Configuration
    |--------------------------------------------------------------------------
    |  php artisan erag:update-manifest
    */

    'manifest' => [
        'name' => 'Vaquita',
        'short_name' => 'Vaquita',
        // matches the logo tile background so the android splash blends seamlessly
        'background_color' => '#47745f',
        'display' => 'standalone',
        'description' => 'Vaquita es una app para dividir gastos entre amigos y familiares.',
        'theme_color' => '#008235',
        'icons' => [
            [
                'src' => 'logo-192.png',
                'sizes' => '192x192',
                'type' => 'image/png',
            ],
            [
                'src' => 'logo-512.png',
                'sizes' => '512x512',
                'type' => 'image/png',
            ],
            [
                'src' => 'logo-512.png',
                'sizes' => '512x512',
                'type' => 'image/png',
                'purpose' => 'maskable',
            ],
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Debug Configuration
    |--------------------------------------------------------------------------
    | Toggles the application's debug mode based on the environment variable
    */

    'debug' => env('APP_DEBUG', false),

    /*
    |--------------------------------------------------------------------------
    | Livewire Integration
    |--------------------------------------------------------------------------
    | Set to true if you're using Livewire in your application to enable
    | Livewire-specific PWA optimizations or features.
    */

    'livewire-app' => false,
];

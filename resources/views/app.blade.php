<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark'])>
<head>
    @PwaHead
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <script>
        (function () {
            const appearance = '{{ $appearance ?? "system" }}';
            if (appearance === 'system') {
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (prefersDark) {
                    document.documentElement.classList.add('dark');
                }
            }
        })();
    </script>
    <style>
        html {
            background-color: oklch(1 0 0);
        }
        html.dark {
            background-color: oklch(0.145 0 0);
        }
    </style>
    <link rel="icon" href="/logo_simple.png" sizes="any" type="image/png">

    {{-- iOS splash screens (Android generates its own from the manifest) --}}
    <link rel="apple-touch-startup-image" href="/splash/750x1334.png" media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)">
    <link rel="apple-touch-startup-image" href="/splash/828x1792.png" media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2)">
    <link rel="apple-touch-startup-image" href="/splash/1125x2436.png" media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)">
    <link rel="apple-touch-startup-image" href="/splash/1170x2532.png" media="(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3)">
    <link rel="apple-touch-startup-image" href="/splash/1179x2556.png" media="(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3)">
    <link rel="apple-touch-startup-image" href="/splash/1284x2778.png" media="(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3)">
    <link rel="apple-touch-startup-image" href="/splash/1290x2796.png" media="(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3)">
    <title data-inertia>{{ $title ?? config('app.name', 'Vaquita') }}</title>
    @viteReactRefresh
    @vite(['resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
    @inertiaHead
</head>
<body class="font-sans antialiased">
    @inertia
    @RegisterServiceWorkerScript
</body>
</html>
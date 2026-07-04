<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>

<body>
    <p>Hello, {{ $user->name }}, <a href="{{ $verificationUrl }}">click here to verify your email</a>.</p>
    <p>Thanks for registering on {{ config('app.name') }}!</p>
    <p>{{ $verificationUrl }}</p>
</body>

</html>
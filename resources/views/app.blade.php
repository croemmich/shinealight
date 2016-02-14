<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <link rel="Shortcut Icon" href="{{ elixir('img/favicon.ico') }}"/>
    <link href="{{ elixir('css/app.css') }}" rel="stylesheet">
    <script type="text/javascript">
        window.csrfToken = '{{ csrf_token() }}';
    </script>
    @yield('styles','')
</head>
<body>

@yield('content')

<!-- Scripts -->
<script src="{{ elixir('js/vendor.js') }}"></script>
<script src="{{ elixir('js/app.js') }}"></script>
@yield('scripts','')
</body>
</html>
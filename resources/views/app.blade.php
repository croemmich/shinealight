<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
    <meta name="theme-color" content="#000000">
    <title>Shine A Light - Officer Moszer</title>
    <meta name="description" content="">
    {{--<link rel="Shortcut Icon" href="{{ elixir('img/favicon.ico') }}"/>--}}
    <link href="{{ elixir('css/app.css') }}" rel="stylesheet">
    <script type="text/javascript">
        window.csrfToken = '{{ csrf_token() }}';
        window.apiBase = '{{ url('/api') }}';
        window.pusherKey = '{{ config('broadcasting.connections.pusher.key') }}';
        window.numPledges = {{ $numPledges }};
    </script>
    @yield('styles','')
</head>
<body>
<header>
    <div class="lj-overlay lj-overlay-color"></div>
    <nav>
        <a href="#home" class="active"><i class="fa fa-bookmark"></i><span>Home</span></a>
        <a href="#map"><i class="fa fa-map"></i><span>Map</span></a>
        <a href="#pledge"><i class="fa fa-map-marker"></i><span>Pledge</span></a>
    </nav>
    <div class="container">
        <div class="row">
            <div class="col-sm-6 lj-logo">
                <img src="{{ elixir('img/bluelight.png') }}" alt="blue light bulb logo">
                <span id="num-pledges" class="lg-num-pledges">{{ $numPledges }}</span> pledges so far!
            </div>
            <div class="col-sm-6 lj-socials">
                <ul>
                    <li><a class="fa fa-facebook" href="{{ config('social.facebook') }}"></a></li>
                    <li><a class="fa fa-twitter" href="{{ config('social.twitter') }}"></a></li>
                    <li><a class="fa fa-google-plus" href="{{ config('social.google') }}"></a></li>
                </ul>
            </div>
        </div>
        <div class="lj-changer">
            @include('pages.home')
            @include('pages.map')
            @include('pages.pledge')
        </div>
    </div>
</header>
<footer></footer>
<script src="https://maps.googleapis.com/maps/api/js?key={{ config('services.google.maps.key') }}&libraries=places"
        defer></script>
<script src="{{ elixir('js/vendor.js') }}" defer></script>
<script src="{{ elixir('js/app.js') }}" defer></script>
@yield('scripts','')
@if (config('services.google.analytics.code'))
<script type="text/javascript">
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
                (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
            m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
    ga('create', '{{ config('services.google.analytics.code') }}', 'auto');
    ga('send', 'pageview');
</script>
@endif
</body>
</html>
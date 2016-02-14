<?php

return [

  'facebook' => 'https://www.facebook.com/dialog/feed?app_id=' . env('FACEBOOK_APP_ID', 'REPLACE_ME') . '&link=' . urlencode(env('APP_URL', 'https://shinealight.us')),
  'twitter' => 'https://twitter.com/intent/tweet?text=' . urlencode("Shine a light for Officer Moszer\n" . env('APP_URL', 'https://shinealight.us')),
  'google' => 'https://plus.google.com/share?url=' . urlencode(env('APP_URL', 'https://shinealight.us')),

];

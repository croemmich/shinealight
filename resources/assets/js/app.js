/* Global App JS */

/*
 * Detect the user's timezone and set cookie
 */
jQuery(document).ready(function ($) {

    function setTimezoneCookie(timezone) {
        var date = new Date(2099, 1, 1);
        document.cookie='timezone=' + timezone + '; path=/; expires=' + date.toUTCString();
    }

    setTimezoneCookie(jstz.determine().name());

});
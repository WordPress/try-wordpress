<?php
/**
 * This is loaded as a mu-plugin in wp-env for development
 */

add_filter( 'rest_authentication_errors', '__return_true' );
add_filter( 'determine_current_user', function () { return 1; }, 99999 );

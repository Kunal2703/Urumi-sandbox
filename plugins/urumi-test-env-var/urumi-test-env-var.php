<?php
/*
Plugin Name: Urumi Test Env Var
Description: Displays the TESTING_VAR environment variable at /test_env_var
Version: 1.0.1
Author: Urumi
*/

defined( 'ABSPATH' ) || exit;

add_action( 'parse_request', function () {
    $path = trim( parse_url( $_SERVER['REQUEST_URI'], PHP_URL_PATH ), '/' );

    if ( $path !== 'test_env_var' ) {
        return;
    }

    header( 'Content-Type: text/plain; charset=utf-8' );

    if ( defined( 'TESTING_VAR' ) && TESTING_VAR !== '' ) {
        echo TESTING_VAR;
    } else {
        echo 'sorry bud nothing here';
    }

    exit;
} );

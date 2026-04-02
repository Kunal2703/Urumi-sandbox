<?php
/*
Plugin Name: Urumi Test Env Var
Description: Displays environment variables at /test_env_var, /var1, /var2, /var3
Version: 1.1.0
Author: Urumi
*/

defined( 'ABSPATH' ) || exit;

add_action( 'parse_request', function () {
    $path = trim( parse_url( $_SERVER['REQUEST_URI'], PHP_URL_PATH ), '/' );

    $routes = array(
        'test_env_var' => 'TESTING_VAR',
        'var1'         => 'VAR1',
        'var2'         => 'VAR2',
        'var3'         => 'VAR3',
    );

    if ( ! isset( $routes[ $path ] ) ) {
        return;
    }

    $constant = $routes[ $path ];

    header( 'Content-Type: text/plain; charset=utf-8' );

    if ( defined( $constant ) && constant( $constant ) !== '' ) {
        echo constant( $constant );
    } else {
        echo 'sorry bud nothing here';
    }

    exit;
} );

<?php
defined( 'ABSPATH' ) || exit;

/**
 * Custom WordPress Configuration for Urumi
 *
 * Environment variables are injected directly and vary per environment
 * (production, preview, staging). No secrets should be hardcoded here.
 *
 * To add a new variable:
 * 1. Add the environment variable to the server configuration (UC_ prefix)
 * 2. Add a urumi_define_from_env() call below
 * 3. Restart to pick up changes
 */

function urumi_define_from_env( $constant, $env_var, $severity = 'notice' ) {
    if ( defined( $constant ) ) {
        return;
    }
    $value = getenv( $env_var );
    if ( false === $value ) {
        if ( 'silent' === $severity ) {
            return;
        }
        $message = "wp-config-local: $env_var is not set";
        error_log( $message );
        if ( 'fatal' === $severity ) {
            http_response_code( 500 );
            die();
        }
        return;
    }
    define( $constant, $value );
}

// Testing
urumi_define_from_env( 'TESTING_VAR', 'UC_TESTING_VAR', 'silent' );

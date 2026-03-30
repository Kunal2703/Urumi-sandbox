<?php
/**
 * Urumi Magic Login
 *
 * @package UrumiMagicLogin
 */

/*
Plugin Name: Urumi Magic Login
Plugin URI: https://urumi.ai
Description: Magic Login for the Urumi Hosting Control Panel.
Author: Urumi
Version: 1.0.1
Author URI: https://urumi.ai/
License: GPL2
*/

/**
 * Urumi_Magic_Login_Plugin class
 */
final class Urumi_Magic_Login_Plugin {
  /** Constructor for the class */
  public function __construct() {
    /** Load after plugins have loaded - https://developer.wordpress.org/reference/hooks/plugins_loaded/ */
    if ( $this->is_ready_to_handle_mpcp_login_request() ) {
      // Handle login request.
      add_action( 'plugins_loaded', array( $this, 'handle_server_login_request' ) );
    }
  }

  /** Function for handling an incoming login request */
  public function handle_server_login_request() {
    // Get the Auth Token from the request.
    // Inbound URL Example: https://pressable.com/wp-login.php?mpcp_token=MS0wZWQ.
    $base64_token = $_REQUEST['mpcp_token'];

    // Base64 Decode the provided token.
    $token_details = base64_decode( $base64_token );

    // Get reference to user_id, token and site_id.
    list( $user_id, $token, $site_id, $user_agent ) = explode( '-', $token_details );

    // Reference to the WP User.
    $user = new WP_User( $user_id );

    // Reference the stored user meta value.
    // clear the user meta cache
    wp_cache_delete( $user->ID, 'user_meta' );
    $user_meta_value = get_user_meta( $user->ID, 'mpcp_auth_token', true );

    // Remove the stored token details from the user meta.
    delete_user_meta( $user->ID, 'mpcp_auth_token' );

    // Verify token is set on user.
    if ( empty( $user_meta_value ) ) {
      $message = 'User not found, please try logging in again.';
      wp_safe_redirect( add_query_arg( 'one_click_error', rawurlencode( $message ), $this->filter_redirect_url( $site_id, $user ) ) );
      exit;
    }

    // Validate expiration time on token.
    $time = time();
    if ( $user_meta_value['exp'] < $time ) {
      $message = 'Authentication token has expired, please try again.';
      wp_safe_redirect( add_query_arg( 'one_click_error', rawurlencode( $message ), $this->filter_redirect_url( $site_id, $user ) ) );
      exit;
    }

    // Validate user agent is matching.
    if ( md5( $_SERVER['HTTP_USER_AGENT'] ) !== $user_agent ) {
      $message = 'Sorry, we could not validate your request user agent, please try again.';
      wp_safe_redirect( add_query_arg( 'one_click_error', rawurlencode( $message ), $this->filter_redirect_url( $site_id, $user ) ) );
      exit;
    }

    // Validate URL token with stored token value.
    if ( md5( $token ) !== $user_meta_value['value'] ) {
      $message = 'Invalid authentication token provided, please try again.';
      wp_safe_redirect( add_query_arg( 'one_click_error', rawurlencode( $message ), $this->filter_redirect_url( $site_id, $user ) ) );
      exit;
    }

    // Set cookie for user.
    wp_set_auth_cookie( $user->ID );

    // Handle login action.
    do_action( 'wp_login', $user->user_login, $user );

    // Apply login redirect filter.
    $redirect_to = apply_filters( 'login_redirect', get_dashboard_url( $user->ID ), '', $user );

    // Redirect to the user's dashboard url.
    wp_safe_redirect( $redirect_to );

    exit;
  }

  /**
   * Decide if request should be handled
   *
   * @return bool True if eligible, False if not.
   */
  private function is_ready_to_handle_mpcp_login_request() {
    // Do not handle if WP is installing, or running a cron or handling AJAX request or if WPCLI request.
    if ( wp_installing() || wp_doing_cron() || wp_doing_ajax() || ( defined( 'WP_CLI' ) && WP_CLI ) ) {
      return false;
    }

    // Must include the MPCP login path with mpcp_token.
    if ( 'wp-login.php' === $GLOBALS['pagenow'] && isset( $_REQUEST['mpcp_token'] ) ) {
      return true;
    }

    return false;
  }

  /**
   * Filter for allowing customers to adjust the redirect url.
   *
   * @param $site_id
   * @param $user
   *
   * @return string Redirect Url.
   */
  private function filter_redirect_url( $site_id, $user ) {
    // On any error, redirect back to the standard wp-login.php page.
    $default_redirect_url = wp_login_url();
    return apply_filters( 'urumi_magic_login_custom_redirect_url', $default_redirect_url, $site_id, $user );
  }
}

/**
 * Define functionality-related WordPress constants,
 * as some 2FA providers could not find the constants.
 * This was added due to functionlity noticed in testing WP 2FA
 */
if ( ! defined( 'AUTOSAVE_INTERVAL' ) ) {
  define( 'AUTOSAVE_INTERVAL', MINUTE_IN_SECONDS );
}

// Run the plugin class.
new Urumi_Magic_Login_Plugin();

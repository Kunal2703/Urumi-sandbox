<?php
/**
 * Plugin Name: Urumi Cache Headers
 * Description: Sets optimal cache headers for CDN caching while preventing browser caching
 * Version: 1.1.0
 * Author: Urumi.ai
 * Author URI: https://urumi.ai
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Aggressively override cache headers using shutdown hook
 * This runs after all other plugins and WordPress core
 */
function urumi_override_cache_headers() {
    if (is_admin() || wp_doing_ajax() || wp_doing_cron()) {
        return;
    }

    $request_uri = $_SERVER['REQUEST_URI'] ?? '';

    // Check if this is a static asset
    $is_static = preg_match('/\.(js|css|woff2?|ttf|eot|svg|png|jpg|jpeg|gif|webp|ico)$/i', $request_uri);

    // Remove all existing cache headers
    if (function_exists('header_remove')) {
        header_remove('Cache-Control');
        header_remove('Pragma');
        header_remove('Expires');
    }

    if ($is_static) {
        // Static assets: 1 year browser cache, 24 hour CDN cache
        header('Cache-Control: public, max-age=31536000, s-maxage=86400, immutable', true);
    } else {
        // HTML pages: no browser cache, 30 min CDN cache
        header('Cache-Control: public, max-age=0, s-maxage=1800, must-revalidate', true);
    }

    header('Vary: Accept-Encoding', true);
}
add_action('shutdown', 'urumi_override_cache_headers', PHP_INT_MAX);

/**
 * Also set headers early in template_redirect
 */
function urumi_early_cache_headers() {
    if (is_admin()) {
        return;
    }

    $request_uri = $_SERVER['REQUEST_URI'] ?? '';
    $is_static = preg_match('/\.(js|css|woff2?|ttf|eot|svg|png|jpg|jpeg|gif|webp|ico)$/i', $request_uri);

    if ($is_static) {
        header('Cache-Control: public, max-age=31536000, s-maxage=86400, immutable', true);
    } else {
        header('Cache-Control: public, max-age=0, s-maxage=1800, must-revalidate', true);
    }

    header('Vary: Accept-Encoding', true);
}
add_action('template_redirect', 'urumi_early_cache_headers', 1);

/**
 * Add cache headers to REST API responses
 */
function urumi_rest_cache_headers($response) {
    $response->header('Cache-Control', 'public, max-age=0, s-maxage=300, must-revalidate', true);
    $response->header('Vary', 'Accept-Encoding', true);
    return $response;
}
add_filter('rest_post_dispatch', 'urumi_rest_cache_headers', 99);

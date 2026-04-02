<?php
/**
 * SSR Router - Detects route type and handles server-side rendering
 *
 * @package React_WooCommerce_Headless
 * @author Urumi.ai
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

class React_SSR_Router {

    /**
     * Current route information
     */
    private $route_type = 'home';
    private $route_data = array();

    /**
     * Initialize router
     */
    public function __construct() {
        $this->detect_route();
    }

    /**
     * Detect current route type from URL
     */
    private function detect_route() {
        $request_uri = $_SERVER['REQUEST_URI'];
        $parsed_url = parse_url($request_uri);
        $path = isset($parsed_url['path']) ? trim($parsed_url['path'], '/') : '';

        // Remove site subdirectory if exists
        $site_path = trim(parse_url(home_url(), PHP_URL_PATH), '/');
        if (!empty($site_path) && strpos($path, $site_path) === 0) {
            $path = trim(substr($path, strlen($site_path)), '/');
        }

        // Detect route type
        if (empty($path) || $path === 'home') {
            $this->route_type = 'vision'; // Vision is now the homepage
        } elseif (in_array($path, array('var1', 'var2', 'var3'))) {
            $this->route_type = 'envvar';
            $this->route_data['name'] = strtoupper($path);
        } elseif ($path === 'urumi-for-woocommerce') {
            $this->route_type = 'urumi-for-woocommerce';
        } elseif ($path === 'woocommerce-agency-page') {
            $this->route_type = 'woocommerce-agency'; // WooCommerce agency page
        } elseif ($path === 'blog') {
            $this->route_type = 'blog';
        } elseif (preg_match('#^blog/([^/]+)/?$#', $path, $matches)) {
            $this->route_type = 'blog-post';
            $this->route_data['slug'] = $matches[1];
        } elseif ($path === 'careers') {
            $this->route_type = 'careers';
        } elseif (preg_match('#^([^/]+)-case-study/?$#', $path, $matches)) {
            $this->route_type = 'case-study';
            $this->route_data['slug'] = $path;
        } elseif (in_array($path, array('terms-and-conditions', 'refund-policy', 'privacy-policy-2'))) {
            $this->route_type = 'page';
            $this->route_data['slug'] = $path;
        } elseif (preg_match('#^product/([^/]+)/?$#', $path, $matches)) {
            $this->route_type = 'product';
            $this->route_data['slug'] = $matches[1];
        } elseif ($path === 'cart') {
            $this->route_type = 'cart';
        } elseif ($path === 'checkout') {
            $this->route_type = 'checkout';
        } elseif (preg_match('#^order-confirmation/(\d+)/?$#', $path, $matches)) {
            $this->route_type = 'order-confirmation';
            $this->route_data['order_id'] = $matches[1];
        } elseif ($path === 'shop' || preg_match('#^product-category/([^/]+)/?$#', $path, $matches)) {
            $this->route_type = 'shop';
            if (isset($matches[1])) {
                $this->route_data['category'] = $matches[1];
            }
        } else {
            $this->route_type = 'vision'; // Default to homepage template
        }
    }

    /**
     * Get current route type
     */
    public function get_route_type() {
        return $this->route_type;
    }

    /**
     * Get route data
     */
    public function get_route_data($key = null) {
        if ($key) {
            return isset($this->route_data[$key]) ? $this->route_data[$key] : null;
        }
        return $this->route_data;
    }

    /**
     * Render full semantic HTML for bots, crawlers, and AI answer engines.
     * React removes #ssr-content on mount and renders interactively in #root.
     */
    public function render() {
        $template_file = get_template_directory() . '/template-parts/ssr-' . $this->route_type . '.php';

        echo '<article id="ssr-content" role="main">';
        if (file_exists($template_file)) {
            include $template_file;
        }
        echo '</article>';
        echo '<div id="root"></div>';
    }
}

<?php
/**
 * Plugin Name: Urumi Custom Sitemap Configuration
 * Description: Customizes WordPress sitemap to exclude WooCommerce pages, adjust priorities, and add docs.urumi.ai link
 * Version: 1.2.0
 * Author: Urumi.ai
 * Requires at least: 5.5
 * Requires PHP: 7.4
 */

if (!defined('ABSPATH')) {
    exit;
}

class Urumi_Custom_Sitemap {

    public function __construct() {
        // Exclude specific pages from sitemap
        add_filter('wp_sitemaps_posts_query_args', [$this, 'exclude_pages_from_sitemap'], 10, 2);

        // Adjust page priorities
        add_filter('wp_sitemaps_posts_entry', [$this, 'adjust_page_priorities'], 10, 3);

        // Add docs.urumi.ai link to pages sitemap by buffering output
        add_action('template_redirect', [$this, 'intercept_sitemap_output']);
    }

    /**
     * Exclude WooCommerce pages from sitemap
     */
    public function exclude_pages_from_sitemap($args, $post_type) {
        if ($post_type !== 'page') {
            return $args;
        }

        // Get WooCommerce page IDs
        $excluded_pages = [
            get_option('woocommerce_shop_page_id'),
            get_option('woocommerce_cart_page_id'),
            get_option('woocommerce_checkout_page_id'),
            get_option('woocommerce_myaccount_page_id'),
        ];

        // Remove empty values
        $excluded_pages = array_filter($excluded_pages);

        if (!empty($excluded_pages)) {
            $args['post__not_in'] = isset($args['post__not_in'])
                ? array_merge($args['post__not_in'], $excluded_pages)
                : $excluded_pages;
        }

        return $args;
    }

    /**
     * Adjust priorities for specific pages
     */
    public function adjust_page_priorities($sitemap_entry, $post, $post_type) {
        if ($post_type !== 'page') {
            return $sitemap_entry;
        }

        // High priority for Blogs page
        if ($post->post_name === 'blogs') {
            $sitemap_entry['priority'] = 0.9;
        }

        // Lower priority for legal pages
        $legal_pages = ['privacy-policy', 'privacy-policy-2', 'terms-and-conditions', 'refund-policy', 'refund_returns'];
        if (in_array($post->post_name, $legal_pages)) {
            $sitemap_entry['priority'] = 0.3;
        }

        // High priority for Home and Contact
        if (in_array($post->post_name, ['homepage', 'contact-us', 'about-us'])) {
            $sitemap_entry['priority'] = 0.9;
        }

        return $sitemap_entry;
    }

    /**
     * Intercept and modify sitemap output
     */
    public function intercept_sitemap_output() {
        global $wp_query;

        // Check if this is a sitemap request for pages
        if (!isset($wp_query->query_vars['sitemap']) ||
            !isset($wp_query->query_vars['sitemap-subtype']) ||
            $wp_query->query_vars['sitemap'] !== 'posts' ||
            $wp_query->query_vars['sitemap-subtype'] !== 'page') {
            return;
        }

        // Start output buffering
        ob_start([$this, 'add_docs_link_to_sitemap']);
    }

    /**
     * Add docs.urumi.ai and /blog to sitemap XML
     */
    public function add_docs_link_to_sitemap($buffer) {
        // Find the closing </urlset> tag and insert custom links before it
        $custom_entries = "\t<url>\n\t\t<loc>" . home_url('/blog') . "</loc>\n\t\t<priority>0.9</priority>\n\t</url>\n";
        $custom_entries .= "\t<url>\n\t\t<loc>https://docs.urumi.ai</loc>\n\t\t<priority>0.8</priority>\n\t</url>\n</urlset>";

        $buffer = str_replace('</urlset>', $custom_entries, $buffer);

        return $buffer;
    }
}

/**
 * Declare HPOS compatibility
 */
add_action('before_woocommerce_init', function() {
    if (class_exists(\Automattic\WooCommerce\Utilities\FeaturesUtil::class)) {
        \Automattic\WooCommerce\Utilities\FeaturesUtil::declare_compatibility('custom_order_tables', __FILE__, true);
    }
});

// Initialize the plugin
new Urumi_Custom_Sitemap();

<?php
/**
 * SSR Data Utilities - Fetch WooCommerce data for server-side rendering
 *
 * @package React_WooCommerce_Headless
 * @author Urumi.ai
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

class React_SSR_Data {

    /**
     * Get product by slug
     */
    public static function get_product_by_slug($slug) {
        // Check if WooCommerce is active
        if (!function_exists('wc_get_product')) {
            return null;
        }

        $args = array(
            'post_type' => 'product',
            'name' => $slug,
            'posts_per_page' => 1,
            'post_status' => 'publish'
        );

        $query = new WP_Query($args);

        if ($query->have_posts()) {
            $query->the_post();
            $product = wc_get_product(get_the_ID());
            wp_reset_postdata();
            return $product;
        }

        return null;
    }

    /**
     * Get products for listing
     */
    public static function get_products($args = array()) {
        // Check if WooCommerce is active
        if (!function_exists('wc_get_product')) {
            return array();
        }

        $defaults = array(
            'post_type' => 'product',
            'posts_per_page' => 12,
            'post_status' => 'publish',
            'orderby' => 'date',
            'order' => 'DESC'
        );

        $args = wp_parse_args($args, $defaults);
        $query = new WP_Query($args);
        $products = array();

        if ($query->have_posts()) {
            while ($query->have_posts()) {
                $query->the_post();
                $product = wc_get_product(get_the_ID());
                if ($product) {
                    $products[] = $product;
                }
            }
            wp_reset_postdata();
        }

        return $products;
    }

    /**
     * Format product data for rendering
     */
    public static function format_product_data($product) {
        // Check if WooCommerce is active
        if (!$product || !function_exists('wc_get_product')) {
            return null;
        }

        $image = wp_get_attachment_image_src($product->get_image_id(), 'full');
        $gallery_ids = $product->get_gallery_image_ids();
        $gallery_images = array();

        foreach ($gallery_ids as $image_id) {
            $gallery_image = wp_get_attachment_image_src($image_id, 'full');
            if ($gallery_image) {
                $gallery_images[] = array(
                    'src' => $gallery_image[0],
                    'alt' => get_post_meta($image_id, '_wp_attachment_image_alt', true)
                );
            }
        }

        return array(
            'id' => $product->get_id(),
            'name' => $product->get_name(),
            'slug' => $product->get_slug(),
            'price' => $product->get_price(),
            'regular_price' => $product->get_regular_price(),
            'sale_price' => $product->get_sale_price(),
            'description' => $product->get_description(),
            'short_description' => $product->get_short_description(),
            'sku' => $product->get_sku(),
            'stock_status' => $product->get_stock_status(),
            'in_stock' => $product->is_in_stock(),
            'image' => $image ? $image[0] : '',
            'images' => $gallery_images,
            'categories' => self::get_product_categories($product),
            'permalink' => get_permalink($product->get_id())
        );
    }

    /**
     * Get product categories
     */
    private static function get_product_categories($product) {
        $categories = array();
        $terms = get_the_terms($product->get_id(), 'product_cat');

        if ($terms && !is_wp_error($terms)) {
            foreach ($terms as $term) {
                $categories[] = array(
                    'id' => $term->term_id,
                    'name' => $term->name,
                    'slug' => $term->slug
                );
            }
        }

        return $categories;
    }

    /**
     * Get site information
     */
    public static function get_site_info() {
        return array(
            'name' => get_bloginfo('name'),
            'description' => get_bloginfo('description'),
            'url' => home_url(),
            'logo' => get_theme_mod('custom_logo') ? wp_get_attachment_image_src(get_theme_mod('custom_logo'), 'full')[0] : ''
        );
    }

    /**
     * Get blog posts for listing
     */
    public static function get_blog_posts($args = array()) {
        $defaults = array(
            'post_type' => 'post',
            'posts_per_page' => 20,
            'post_status' => 'publish',
            'orderby' => 'date',
            'order' => 'DESC'
        );

        $args = wp_parse_args($args, $defaults);
        $query = new WP_Query($args);
        $posts = array();

        if ($query->have_posts()) {
            while ($query->have_posts()) {
                $query->the_post();
                $posts[] = self::format_post_data(get_post());
            }
            wp_reset_postdata();
        }

        return $posts;
    }

    /**
     * Get single blog post by slug
     */
    public static function get_blog_post_by_slug($slug) {
        $args = array(
            'post_type' => 'post',
            'name' => $slug,
            'posts_per_page' => 1,
            'post_status' => 'publish'
        );

        $query = new WP_Query($args);

        if ($query->have_posts()) {
            $query->the_post();
            $post = self::format_post_data(get_post());
            wp_reset_postdata();
            return $post;
        }

        return null;
    }

    /**
     * Format blog post data for rendering
     */
    public static function format_post_data($post) {
        if (!$post) {
            return null;
        }

        $featured_image = get_the_post_thumbnail_url($post->ID, 'full');
        $author = get_the_author_meta('display_name', $post->post_author);

        // Inject heading ids and extract the TOC in a single DOMDocument
        // pass so PHP SSR and React see byte-identical anchor strings.
        $rendered = apply_filters('the_content', $post->post_content);
        $processed = React_SSR_Toc::process($rendered);

        return array(
            'id' => $post->ID,
            'title' => array(
                'rendered' => get_the_title($post->ID)
            ),
            'slug' => $post->post_name,
            'date' => $post->post_date,
            'modified' => $post->post_modified,
            'content' => array(
                'rendered' => $processed['html']
            ),
            'toc' => $processed['toc'],
            'excerpt' => array(
                'rendered' => has_excerpt($post->ID) ? apply_filters('the_excerpt', get_the_excerpt($post->ID)) : ''
            ),
            'author' => array(
                'name' => $author
            ),
            'featured_image' => $featured_image ? $featured_image : null,
            'link' => get_permalink($post->ID)
        );
    }

    /**
     * Get WordPress page by slug
     */
    public static function get_page_by_slug($slug) {
        $args = array(
            'post_type' => 'page',
            'name' => $slug,
            'posts_per_page' => 1,
            'post_status' => 'publish'
        );

        $query = new WP_Query($args);

        if ($query->have_posts()) {
            $query->the_post();
            $page = self::format_page_data(get_post());
            wp_reset_postdata();
            return $page;
        }

        return null;
    }

    /**
     * Format WordPress page data for rendering
     */
    public static function format_page_data($page) {
        if (!$page) {
            return null;
        }

        return array(
            'id' => $page->ID,
            'title' => array(
                'rendered' => get_the_title($page->ID)
            ),
            'slug' => $page->post_name,
            'date' => $page->post_date,
            'modified' => $page->post_modified,
            'content' => array(
                'rendered' => apply_filters('the_content', $page->post_content)
            ),
            'link' => get_permalink($page->ID)
        );
    }
}

<?php
/**
 * SSR Schema Generator - Generate structured data for SEO
 *
 * @package React_WooCommerce_Headless
 * @author Urumi.ai
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

class React_SSR_Schema {

    /**
     * Generate Product schema
     */
    public static function product_schema($product_data) {
        if (!$product_data) {
            return '';
        }

        $schema = array(
            '@context' => 'https://schema.org/',
            '@type' => 'Product',
            'name' => $product_data['name'],
            'description' => wp_strip_all_tags($product_data['short_description'] ?: $product_data['description']),
            'sku' => $product_data['sku'],
            'image' => array()
        );

        // Add main image
        if (!empty($product_data['image'])) {
            $schema['image'][] = $product_data['image'];
        }

        // Add gallery images
        foreach ($product_data['images'] as $image) {
            $schema['image'][] = $image['src'];
        }

        // Add offers
        $schema['offers'] = array(
            '@type' => 'Offer',
            'url' => $product_data['permalink'],
            'priceCurrency' => get_woocommerce_currency(),
            'price' => $product_data['price'],
            'availability' => $product_data['in_stock'] ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
            'itemCondition' => 'https://schema.org/NewCondition'
        );

        // Add brand if available
        $schema['brand'] = array(
            '@type' => 'Brand',
            'name' => get_bloginfo('name')
        );

        return self::output_schema($schema);
    }

    /**
     * Generate WebSite schema
     */
    public static function website_schema() {
        $schema = array(
            '@context' => 'https://schema.org/',
            '@type' => 'WebSite',
            'name' => get_bloginfo('name'),
            'description' => get_bloginfo('description'),
            'url' => home_url(),
            'potentialAction' => array(
                '@type' => 'SearchAction',
                'target' => home_url('/?s={search_term_string}'),
                'query-input' => 'required name=search_term_string'
            )
        );

        return self::output_schema($schema);
    }

    /**
     * Generate Organization schema
     */
    public static function organization_schema() {
        $schema = array(
            '@context' => 'https://schema.org/',
            '@type' => 'Organization',
            'name' => get_bloginfo('name'),
            'url' => home_url()
        );

        $logo = get_theme_mod('custom_logo');
        if ($logo) {
            $logo_url = wp_get_attachment_image_src($logo, 'full');
            if ($logo_url) {
                $schema['logo'] = $logo_url[0];
            }
        }

        return self::output_schema($schema);
    }

    /**
     * Generate Breadcrumb schema
     */
    public static function breadcrumb_schema($items) {
        $position = 1;
        $list_items = array();

        foreach ($items as $item) {
            $list_items[] = array(
                '@type' => 'ListItem',
                'position' => $position++,
                'name' => $item['name'],
                'item' => $item['url']
            );
        }

        $schema = array(
            '@context' => 'https://schema.org/',
            '@type' => 'BreadcrumbList',
            'itemListElement' => $list_items
        );

        return self::output_schema($schema);
    }

    /**
     * Output schema as JSON-LD
     */
    private static function output_schema($schema) {
        return '<script type="application/ld+json">' . wp_json_encode($schema, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT) . '</script>';
    }
}

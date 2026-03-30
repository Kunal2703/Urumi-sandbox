<?php
/**
 * React WooCommerce Headless Theme Functions
 *
 * @package React_WooCommerce_Headless
 * @author Urumi.ai
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Load SSR components
 */
require_once get_template_directory() . '/inc/ssr-router.php';
require_once get_template_directory() . '/inc/ssr-data.php';
require_once get_template_directory() . '/inc/ssr-schema.php';

/**
 * Theme setup
 */
function react_woo_headless_setup() {
    // Add WooCommerce support
    add_theme_support('woocommerce');
    add_theme_support('wc-product-gallery-zoom');
    add_theme_support('wc-product-gallery-lightbox');
    add_theme_support('wc-product-gallery-slider');

    // Add title tag support
    add_theme_support('title-tag');

    // Add post thumbnail support
    add_theme_support('post-thumbnails');
}
add_action('after_setup_theme', 'react_woo_headless_setup');

/**
 * Get built asset files from dist/assets folder
 * Supports code-split chunks (vendor-react, vendor-router, etc.)
 */
function react_woo_headless_get_assets() {
    $theme_dir = get_template_directory();
    $assets_dir = $theme_dir . '/dist/assets/';

    $assets = array(
        'js' => '',
        'css' => '',
        'chunks_js' => array(),
        'chunks_css' => array()
    );

    if (is_dir($assets_dir)) {
        $files = scandir($assets_dir);
        foreach ($files as $file) {
            // Main entry JS
            if (preg_match('/^index-([a-zA-Z0-9_-]+)\.js$/', $file)) {
                $assets['js'] = $file;
            }
            // Main entry CSS (matches index-*.css or style-*.css)
            if (preg_match('/^(index|style)-([a-zA-Z0-9_-]+)\.css$/', $file)) {
                $assets['css'] = $file;
            }
            // Vendor/chunk JS files (preload these)
            if (preg_match('/^vendor-(react|router)-([a-zA-Z0-9_-]+)\.js$/', $file)) {
                $assets['chunks_js'][] = $file;
            }
        }
    }

    return $assets;
}

/**
 * Add preload hints for critical assets (reduces white screen time)
 */
function react_woo_headless_preload_hints() {
    $theme_uri = get_template_directory_uri();
    $assets = react_woo_headless_get_assets();

    // Preload the main JS bundle
    if (!empty($assets['js'])) {
        echo '<link rel="modulepreload" href="' . esc_url($theme_uri . '/dist/assets/' . $assets['js']) . '">' . "\n";
    }

    // Preload vendor chunks (React, Router — needed immediately)
    foreach ($assets['chunks_js'] as $chunk) {
        echo '<link rel="modulepreload" href="' . esc_url($theme_uri . '/dist/assets/' . $chunk) . '">' . "\n";
    }
}
add_action('wp_head', 'react_woo_headless_preload_hints', 1);

/**
 * Enqueue React application assets
 */
function react_woo_headless_enqueue_scripts() {
    $theme_dir = get_template_directory();
    $theme_uri = get_template_directory_uri();

    // Check if dist folder exists (production build)
    $dist_dir = $theme_dir . '/dist/assets/';

    if (is_dir($dist_dir)) {
        // Production mode - load built assets
        $assets = react_woo_headless_get_assets();

        // Enqueue CSS
        if (!empty($assets['css'])) {
            $css_path = $theme_dir . '/dist/assets/' . $assets['css'];
            $css_ver  = file_exists($css_path) ? filemtime($css_path) : '1.5.6';
            wp_enqueue_style(
                'react-woo-style',
                $theme_uri . '/dist/assets/' . $assets['css'],
                array(),
                $css_ver
            );
        }

        // Enqueue JS
        if (!empty($assets['js'])) {
            $js_path = $theme_dir . '/dist/assets/' . $assets['js'];
            $js_ver  = file_exists($js_path) ? filemtime($js_path) : '1.5.6';
            wp_enqueue_script(
                'react-woo-app',
                $theme_uri . '/dist/assets/' . $assets['js'],
                array(),
                $js_ver,
                true
            );
        }
    } else {
        // Development mode - Vite dev server
        wp_enqueue_script(
            'react-woo-vite-client',
            'http://localhost:5173/@vite/client',
            array(),
            null,
            false
        );

        wp_enqueue_script(
            'react-woo-app',
            'http://localhost:5173/src/main.jsx',
            array('react-woo-vite-client'),
            null,
            true
        );
    }

    // Pass WordPress data to React
    wp_localize_script('react-woo-app', 'wpData', array(
        'restUrl' => esc_url_raw(rest_url()),
        'nonce' => wp_create_nonce('wp_rest'),
        'siteUrl' => get_site_url(),
        'themePath' => $theme_uri,
        'isSSR' => true, // Flag to indicate SSR is enabled
    ));
}
add_action('wp_enqueue_scripts', 'react_woo_headless_enqueue_scripts');

/**
 * Enable CORS for WooCommerce REST API (if needed)
 */
function react_woo_headless_cors() {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
}
add_action('rest_api_init', 'react_woo_headless_cors');

/**
 * Add module type to script tags for ES modules
 */
function react_woo_headless_script_type($tag, $handle, $src) {
    if ('react-woo-app' === $handle || 'react-woo-vite-client' === $handle) {
        $tag = '<script type="module" src="' . esc_url($src) . '"></script>';
    }
    return $tag;
}
add_filter('script_loader_tag', 'react_woo_headless_script_type', 10, 3);

/**
 * Remove admin bar for cleaner React UI
 */
add_filter('show_admin_bar', '__return_false');

/**
 * Disable WordPress emoji scripts
 * We want native emojis, not images
 */
function urumi_disable_emoji_scripts() {
    remove_action('wp_head', 'print_emoji_detection_script', 7);
    remove_action('admin_print_scripts', 'print_emoji_detection_script');
    remove_action('wp_print_styles', 'print_emoji_styles');
    remove_action('admin_print_styles', 'print_emoji_styles');
    remove_filter('the_content_feed', 'wp_staticize_emoji');
    remove_filter('comment_text_rss', 'wp_staticize_emoji');
    remove_filter('wp_mail', 'wp_staticize_emoji_for_email');
}
add_action('init', 'urumi_disable_emoji_scripts');

/**
 * Allow public access to WooCommerce products via REST API
 * This enables the headless React app to fetch products without authentication
 */
function react_woo_headless_allow_public_products($permission, $context, $object_id, $post_type) {
    // Allow public read access to products
    if ($post_type === 'product' && $context === 'read') {
        return true;
    }
    return $permission;
}
add_filter('woocommerce_rest_check_permissions', 'react_woo_headless_allow_public_products', 10, 4);

/**
 * Configure Yoast SEO for headless setup
 */
function react_woo_headless_yoast_config() {
    // Disable Yoast's schema output on product pages (we handle it with SSR)
    add_filter('wpseo_json_ld_output', function($data, $context) {
        // Only disable if we're rendering our own schema
        if (is_product()) {
            return array();
        }
        return $data;
    }, 10, 2);
}
add_action('init', 'react_woo_headless_yoast_config');

/**
 * Get context-aware SEO data for meta tags
 */
function urumi_get_seo_data($ssr_router) {
    $route_type = $ssr_router->get_route_type();
    $route_data = $ssr_router->get_route_data();

    $default_image = get_template_directory_uri() . '/public/urumi-logo.png';

    // Get current URL path
    $request_uri = $_SERVER['REQUEST_URI'];
    $parsed_url = parse_url($request_uri);
    $path = isset($parsed_url['path']) ? trim($parsed_url['path'], '/') : '';

    // Remove site subdirectory if exists
    $site_path = trim(parse_url(home_url(), PHP_URL_PATH), '/');
    if (!empty($site_path) && strpos($path, $site_path) === 0) {
        $path = trim(substr($path, strlen($site_path)), '/');
    }

    $seo_data = array(
        'title' => '',
        'description' => '',
        'url' => home_url($_SERVER['REQUEST_URI']),
        'canonical_url' => home_url($_SERVER['REQUEST_URI']), // Default to current URL
        'og_type' => 'website',
        'image' => $default_image,
        'image_width' => '822',
        'image_height' => '465',
        'noindex' => false // Default: allow indexing
    );

    switch ($route_type) {
        case 'vision':
            $seo_data['title'] = 'Urumi - Agentic AI eCommerce Platform | Intelligent WooCommerce Infrastructure';
            $seo_data['description'] = 'The first AI-native eCommerce platform. Autonomous infrastructure management, predictive scaling, zero-compromise performance, and AI-powered developer experience. Built for the future of WooCommerce.';
            $seo_data['canonical_url'] = home_url('/');
            $seo_data['url'] = home_url('/');
            $seo_data['keywords'] = 'agentic AI, AI eCommerce platform, intelligent infrastructure, autonomous scaling, WooCommerce AI, predictive commerce, AI hosting, zero-compromise performance, AI-native platform';
            $seo_data['og_title'] = 'Introducing the First Agentic AI eCommerce Platform';
            $seo_data['twitter_card'] = 'summary_large_image';
            $seo_data['twitter_title'] = 'Urumi - Agentic AI eCommerce Platform';
            $seo_data['twitter_description'] = 'eCommerce re-imagined for the AI era. Autonomous management, predictive scaling, and intelligent optimization.';
            break;

        case 'home':
            $seo_data['title'] = 'Urumi For WooCommerce - Enterprise Auto-Scaling Hosting | 99.99% Uptime Guarantee';
            $seo_data['description'] = 'Enterprise WooCommerce hosting with instant autoscaling, multi-zone reliability, zero-downtime deployments, and AI-powered performance optimization. Sub-100ms response times guaranteed. Built for high-traffic stores.';
            $seo_data['canonical_url'] = home_url('/urumi-for-woocommerce');
            $seo_data['url'] = home_url('/urumi-for-woocommerce');
            $seo_data['keywords'] = 'WooCommerce hosting, enterprise hosting, auto-scaling, multi-zone reliability, high availability, zero downtime, performance optimization, managed WooCommerce, scalable hosting, 99.99% uptime';
            $seo_data['og_title'] = 'Enterprise WooCommerce Hosting with Auto-Scaling & Multi-Zone Reliability';
            $seo_data['twitter_card'] = 'summary_large_image';
            $seo_data['twitter_title'] = 'Urumi For WooCommerce - Enterprise Hosting';
            $seo_data['twitter_description'] = 'Autoscaling, multi-zone reliability, zero-downtime deployments. Built for stores that can\'t afford downtime.';
            break;

        case 'blog':
            $seo_data['title'] = 'Blog - WooCommerce Performance & Infrastructure Insights | Urumi';
            $seo_data['description'] = 'Deep dives into WooCommerce performance optimization, infrastructure scaling, and e-commerce best practices from the Urumi engineering team.';
            $seo_data['url'] = home_url('/blog');
            break;

        case 'careers':
            $seo_data['title'] = 'Careers - Build the Agentic AI eCommerce Platform | Urumi';
            $seo_data['description'] = 'Join Urumi in building the first AI-native eCommerce platform. We\'re hiring generalist engineers and designers to work on autonomous infrastructure, AI agents, and intelligent commerce systems.';
            $seo_data['url'] = home_url('/careers');
            break;

        case 'blog-post':
            $slug = $route_data['slug'];
            $post = React_SSR_Data::get_blog_post_by_slug($slug);

            if ($post) {
                $seo_data['title'] = wp_strip_all_tags($post['title']['rendered']) . ' | Urumi Blog';

                // Get excerpt or generate from content
                if (!empty($post['excerpt']['rendered'])) {
                    $excerpt = wp_strip_all_tags($post['excerpt']['rendered']);
                } else {
                    $excerpt = wp_strip_all_tags($post['content']['rendered']);
                    $excerpt = wp_trim_words($excerpt, 30);
                }
                $seo_data['description'] = $excerpt;

                $seo_data['url'] = $post['link'];
                $seo_data['og_type'] = 'article';

                // Use featured image if available
                if (!empty($post['featured_image'])) {
                    $seo_data['image'] = $post['featured_image'];
                    // Try to get image dimensions
                    $image_id = attachment_url_to_postid($post['featured_image']);
                    if ($image_id) {
                        $image_meta = wp_get_attachment_image_src($image_id, 'full');
                        if ($image_meta) {
                            $seo_data['image_width'] = $image_meta[1];
                            $seo_data['image_height'] = $image_meta[2];
                        }
                    }
                }
            }
            break;

        case 'page':
            $slug = $route_data['slug'];
            $page = React_SSR_Data::get_page_by_slug($slug);

            if ($page) {
                // Special handling for case study pages
                if (strpos($slug, '-case-study') !== false) {
                    $customer_name = ucfirst(str_replace('-case-study', '', $slug));
                    $seo_data['title'] = "How Urumi Improved {$customer_name}'s Performance by 294% | Case Study";
                    $seo_data['description'] = "Learn how Urumi helped {$customer_name} achieve a 294% improvement in user satisfaction through performance optimization, fixing cold starts, N+1 queries, and caching issues.";
                    $seo_data['og_type'] = 'article';
                    $seo_data['keywords'] = 'WooCommerce performance optimization, site speed improvement, performance case study, eCommerce optimization, ' . $customer_name;
                } else {
                    $seo_data['title'] = wp_strip_all_tags($page['title']['rendered']) . ' | Urumi';

                    // Generate description from content
                    $content = wp_strip_all_tags($page['content']['rendered']);
                    $seo_data['description'] = wp_trim_words($content, 30);
                }

                $seo_data['url'] = $page['link'];

                // Policy pages should not be indexed (non-business pages)
                $policy_pages = array('terms-and-conditions', 'refund-policy', 'privacy-policy-2');
                if (in_array($slug, $policy_pages)) {
                    $seo_data['noindex'] = true;
                }
            }
            break;
    }

    return $seo_data;
}

/**
 * Get JSON-LD Schema data based on page context
 */
function urumi_get_schema_data($ssr_router, $seo_data) {
    $route_type = $ssr_router->get_route_type();
    $route_data = $ssr_router->get_route_data();

    $schema = array();

    switch ($route_type) {
        case 'home':
            $schema = array(
                '@context' => 'https://schema.org',
                '@type' => 'Organization',
                'name' => 'Urumi',
                'url' => home_url('/'),
                'logo' => get_template_directory_uri() . '/public/urumi-logo.png',
                'description' => 'Enterprise WooCommerce hosting with auto-scaling, multi-zone reliability, and performance guardrails',
                'sameAs' => array(
                    'https://twitter.com/urumi_ai',
                    'https://docs.urumi.ai'
                )
            );
            break;

        case 'blog':
            $schema = array(
                '@context' => 'https://schema.org',
                '@type' => 'Blog',
                'name' => 'Urumi Blog',
                'description' => 'WooCommerce performance and infrastructure insights',
                'url' => home_url('/blog'),
                'publisher' => array(
                    '@type' => 'Organization',
                    'name' => 'Urumi',
                    'logo' => array(
                        '@type' => 'ImageObject',
                        'url' => get_template_directory_uri() . '/public/urumi-logo.png'
                    )
                )
            );
            break;

        case 'careers':
            $schema = array(
                '@context' => 'https://schema.org',
                '@type' => 'JobPosting',
                'title' => 'Generalist Engineer',
                'description' => 'We\'re looking for a generalist engineer who can tackle any challenge thrown their way. You\'ll work across the stack—infrastructure, backend, frontend, DevOps, performance optimization, and customer-facing work.',
                'datePosted' => date('Y-m-d'),
                'employmentType' => 'FULL_TIME',
                'hiringOrganization' => array(
                    '@type' => 'Organization',
                    'name' => 'Urumi',
                    'sameAs' => home_url('/'),
                    'logo' => get_template_directory_uri() . '/public/urumi-logo.png'
                ),
                'jobLocation' => array(
                    '@type' => 'Place',
                    'address' => array(
                        '@type' => 'PostalAddress',
                        'addressLocality' => 'Remote',
                        'addressCountry' => 'Worldwide'
                    )
                ),
                'applicantLocationRequirements' => array(
                    '@type' => 'Country',
                    'name' => 'Worldwide'
                ),
                'jobLocationType' => 'TELECOMMUTE',
                'responsibilities' => 'Ship features across the full stack, debug complex performance issues, build CI/CD pipelines, work with customers on technical implementations, optimize WooCommerce stores for scale.',
                'skills' => 'PHP, JavaScript, React, Linux, Docker, cloud infrastructure, performance optimization',
                'workHours' => 'Full-time',
                'applicationContact' => array(
                    '@type' => 'ContactPoint',
                    'contactType' => 'Recruitment',
                    'url' => 'https://dashboard.urumi.ai/s/naman'
                )
            );
            break;

        case 'blog-post':
            $slug = $route_data['slug'];
            $post = React_SSR_Data::get_blog_post_by_slug($slug);

            if ($post) {
                $schema = array(
                    '@context' => 'https://schema.org',
                    '@type' => 'Article',
                    'headline' => wp_strip_all_tags($post['title']['rendered']),
                    'description' => wp_strip_all_tags($seo_data['description']),
                    'datePublished' => $post['date'],
                    'dateModified' => $post['modified'],
                    'author' => array(
                        '@type' => 'Person',
                        'name' => $post['author']['name']
                    ),
                    'publisher' => array(
                        '@type' => 'Organization',
                        'name' => 'Urumi',
                        'logo' => array(
                            '@type' => 'ImageObject',
                            'url' => get_template_directory_uri() . '/public/urumi-logo.png'
                        )
                    ),
                    'mainEntityOfPage' => array(
                        '@type' => 'WebPage',
                        '@id' => $post['link']
                    )
                );

                // Add image if available
                if (!empty($post['featured_image'])) {
                    $schema['image'] = array(
                        '@type' => 'ImageObject',
                        'url' => $post['featured_image']
                    );
                }
            }
            break;

        case 'page':
            $slug = $route_data['slug'];
            $page = React_SSR_Data::get_page_by_slug($slug);

            if ($page) {
                // Special schema for case study pages
                if (strpos($slug, '-case-study') !== false) {
                    $customer_name = ucfirst(str_replace('-case-study', '', $slug));
                    $schema = array(
                        '@context' => 'https://schema.org',
                        '@type' => 'Article',
                        'headline' => "How Urumi Improved {$customer_name}'s Performance by 294%",
                        'description' => $seo_data['description'],
                        'datePublished' => $page['date'],
                        'dateModified' => $page['modified'],
                        'author' => array(
                            '@type' => 'Organization',
                            'name' => 'Urumi',
                            'url' => home_url('/')
                        ),
                        'publisher' => array(
                            '@type' => 'Organization',
                            'name' => 'Urumi',
                            'logo' => array(
                                '@type' => 'ImageObject',
                                'url' => get_template_directory_uri() . '/public/urumi-logo.png'
                            )
                        ),
                        'mainEntityOfPage' => array(
                            '@type' => 'WebPage',
                            '@id' => $page['link']
                        ),
                        'about' => array(
                            '@type' => 'Thing',
                            'name' => 'WooCommerce Performance Optimization'
                        )
                    );
                } else {
                    $schema = array(
                        '@context' => 'https://schema.org',
                        '@type' => 'WebPage',
                        'name' => wp_strip_all_tags($page['title']['rendered']),
                        'description' => $seo_data['description'],
                        'url' => $page['link'],
                        'publisher' => array(
                            '@type' => 'Organization',
                            'name' => 'Urumi'
                        )
                    );
                }
            }
            break;
    }

    return $schema;
}

/**
 * Get Breadcrumb Schema
 */
function urumi_get_breadcrumb_schema($ssr_router) {
    $route_type = $ssr_router->get_route_type();
    $route_data = $ssr_router->get_route_data();

    // Don't show breadcrumbs on homepage
    if ($route_type === 'home') {
        return array();
    }

    $items = array();
    $position = 1;

    // Always start with Home
    $items[] = array(
        '@type' => 'ListItem',
        'position' => $position++,
        'name' => 'Home',
        'item' => home_url('/')
    );

    switch ($route_type) {
        case 'blog':
            $items[] = array(
                '@type' => 'ListItem',
                'position' => $position++,
                'name' => 'Blog'
            );
            break;

        case 'blog-post':
            $slug = $route_data['slug'];
            $post = React_SSR_Data::get_blog_post_by_slug($slug);

            // Add Blog link
            $items[] = array(
                '@type' => 'ListItem',
                'position' => $position++,
                'name' => 'Blog',
                'item' => home_url('/blog')
            );

            // Add current post
            if ($post) {
                $items[] = array(
                    '@type' => 'ListItem',
                    'position' => $position++,
                    'name' => wp_strip_all_tags($post['title']['rendered'])
                );
            }
            break;

        case 'page':
            $slug = $route_data['slug'];
            $page = React_SSR_Data::get_page_by_slug($slug);

            if ($page) {
                $items[] = array(
                    '@type' => 'ListItem',
                    'position' => $position++,
                    'name' => wp_strip_all_tags($page['title']['rendered'])
                );
            }
            break;
    }

    // Return empty if only home is in breadcrumb
    if (count($items) <= 1) {
        return array();
    }

    return array(
        '@context' => 'https://schema.org',
        '@type' => 'BreadcrumbList',
        'itemListElement' => $items
    );
}

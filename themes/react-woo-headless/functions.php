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
require_once get_template_directory() . '/inc/ssr-toc.php';

/**
 * Rewrite REST API post responses so the React client and PHP SSR see the
 * same content.rendered (with heading ids) and the same `toc` array.
 * Scoped to the REST `post` endpoint — RSS feeds, AMP, email digests, and
 * Gutenberg-internal renders continue to see the original HTML.
 */
add_filter('rest_prepare_post', function ($response, $post, $request) {
    $data = $response->get_data();
    if (!is_array($data) || empty($data['content']['rendered'])) {
        return $response;
    }

    // Single-post requests (?slug=… or /posts/{id}) need the TOC and the
    // rewritten content. Collection requests (the blog index, archive
    // listings) only render cards/excerpts — skip the DOMDocument pass to
    // avoid parsing N full bodies per page.
    if (empty($request->get_param('slug')) && empty($request->get_param('id'))) {
        return $response;
    }

    $processed = React_SSR_Toc::process($data['content']['rendered']);
    $data['content']['rendered'] = $processed['html'];
    $data['toc'] = $processed['toc'];

    $response->set_data($data);
    return $response;
}, 10, 3);

/**
 * ── Brand identity constants ──────────────────────────────────────────────
 *
 * Single source of truth for the brand name, logo, social handles, and
 * canonical descriptions that surface in every JSON-LD block. Used by
 * inc/ssr-schema.php helpers AND the inline schemas in urumi_get_schema_data
 * below so the entity stays consistent everywhere.
 *
 * Why these are functions and not `define()` constants: get_template_directory_uri()
 * is only safe after WordPress has loaded. Helpers can be called from any
 * filter / action / template-part safely.
 *
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * ⚠️ COPY-SYNC RULE — these strings are part of the four-surface sync
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * urumi_brand_description, urumi_founders bios, and the Organization
 * schema below feed JSON-LD that crawlers + AEO engines treat as canonical
 * entity data. They MUST match the same descriptions in:
 *
 *   - llms.txt (repo root, AEO answer file)
 *   - src/pages/*.jsx (hydrated React app — Vision, WC, CaseStudy, ...)
 *   - template-parts/ssr-*.php (SSR HTML — ssr-vision, ssr-woocommerce, ...)
 *   - inc/ssr-schema.php (peer schema helpers)
 *
 * Full rule + reference PRs (#22, #23) documented at the top of llms.txt.
 * Before editing a string here, grep the repo for it so every surface
 * stays in lockstep.
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

/** Canonical brand name. Matches Twitter handle, llms.txt, founder copy. */
function urumi_brand_name() {
    return 'Urumi';
}

/** Canonical logo URL — theme-deployed, version-controlled. */
function urumi_brand_logo() {
    return get_template_directory_uri() . '/public/urumi-logo.png';
}

/** Canonical one-line description for Organization/WebSite schemas. */
function urumi_brand_description() {
    return 'Managed WooCommerce operations platform built by ex-Automattic engineers who shipped WooCommerce core, with earlier founding-era experience at HackerRank (Y Combinator) where the team scaled from $2M to $30M ARR. Horizontal auto-scaling, 99.99% uptime, fully managed APM, performance fixes shipped as pull requests, and AI helpers (Builder/Revenue/Analytics + MCP Bring-Your-Own AI).';
}

/** sameAs profile URLs for entity consolidation across the web. */
function urumi_brand_same_as() {
    return array(
        'https://twitter.com/urumi_ai',
        'https://github.com/UrumiAI',
        'https://docs.urumi.ai',
    );
}

/** Founders as Person entities. Reused in Organization.founder + standalone refs. */
function urumi_founders() {
    return array(
        array(
            '@type' => 'Person',
            'name' => 'Naman Malhotra',
            'jobTitle' => 'Co-founder',
            'worksFor' => array(
                '@type' => 'Organization',
                'name' => urumi_brand_name(),
                'url' => home_url('/')
            ),
            'description' => 'Co-founder of Urumi. Built WooCommerce core at Automattic. Earlier: founding-era engineer at HackerRank (Y Combinator), where the team scaled the company from $2M to $30M ARR.',
            'sameAs' => 'https://www.linkedin.com/in/naman03malhotra'
        ),
        array(
            '@type' => 'Person',
            'name' => 'Vedanshu Jain',
            'jobTitle' => 'Co-founder',
            'worksFor' => array(
                '@type' => 'Organization',
                'name' => urumi_brand_name(),
                'url' => home_url('/')
            ),
            'description' => 'Co-founder of Urumi. Built WooCommerce core at Automattic. Earlier: founding-era engineer at HackerRank (Y Combinator), where the team scaled the company from $2M to $30M ARR.',
            'sameAs' => 'https://www.linkedin.com/in/vedanshuj/'
        ),
    );
}

/**
 * Canonical Organization schema — reused everywhere we need to identify Urumi.
 *
 * Location modeling matches the real distributed team:
 *   - HQ:           San Francisco, USA
 *   - Engineering:  Goa + Bangalore, India
 *   - Support + Growth: Europe (remote across the region)
 *
 * `address` carries the HQ PostalAddress (what LLMs cite when asked
 * "where is Urumi headquartered?"). `location` lists every operating
 * Place so multi-location queries ("does Urumi have an office in India?",
 * "is there a Bangalore team?") resolve cleanly.
 */
function urumi_organization_schema() {
    return array(
        '@context' => 'https://schema.org',
        '@type' => 'Organization',
        'name' => urumi_brand_name(),
        'url' => home_url('/'),
        'logo' => urumi_brand_logo(),
        'description' => urumi_brand_description(),
        // HQ address
        'address' => array(
            '@type' => 'PostalAddress',
            'addressLocality' => 'San Francisco',
            'addressRegion' => 'CA',
            'addressCountry' => 'US',
        ),
        // All operating locations
        'location' => array(
            array(
                '@type' => 'Place',
                'name' => 'San Francisco HQ',
                'address' => array(
                    '@type' => 'PostalAddress',
                    'addressLocality' => 'San Francisco',
                    'addressRegion' => 'CA',
                    'addressCountry' => 'US',
                ),
            ),
            array(
                '@type' => 'Place',
                'name' => 'Goa engineering office',
                'address' => array(
                    '@type' => 'PostalAddress',
                    'addressLocality' => 'Goa',
                    'addressCountry' => 'IN',
                ),
            ),
            array(
                '@type' => 'Place',
                'name' => 'Bangalore engineering office',
                'address' => array(
                    '@type' => 'PostalAddress',
                    'addressLocality' => 'Bangalore',
                    'addressRegion' => 'KA',
                    'addressCountry' => 'IN',
                ),
            ),
            array(
                '@type' => 'Place',
                'name' => 'Europe (support + growth, remote)',
                'address' => array(
                    '@type' => 'PostalAddress',
                    'addressRegion' => 'Europe',
                ),
            ),
        ),
        'sameAs' => urumi_brand_same_as(),
        'founder' => urumi_founders(),
    );
}

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
 * Backward-compat alias for the WooCommerce slug change.
 *
 * Both /woocommerce (canonical) and /urumi-for-woocommerce (legacy) serve the
 * same WC page. WordPress only has the legacy page registered in the database,
 * so this registers a rewrite that maps /woocommerce → the same internal page
 * lookup. The SSR router (which reads $_SERVER['REQUEST_URI'] directly) sees
 * the original path and serves template-parts/ssr-woocommerce.php for both.
 *
 * SEO: canonical_url in urumi_get_seo_data() always points to /woocommerce
 * regardless of which URL was hit, so search engines consolidate signals on
 * the new URL.
 *
 * The flush below auto-runs once after deploy when the version constant
 * changes. No manual Permalinks visit required. Bump the version string when
 * adding more rewrite rules to trigger another flush.
 */
function urumi_register_woocommerce_alias() {
    add_rewrite_rule(
        '^woocommerce/?$',
        'index.php?pagename=urumi-for-woocommerce',
        'top'
    );
}
add_action('init', 'urumi_register_woocommerce_alias');

/**
 * 301 redirect for the deleted /woocommerce-agencies page.
 *
 * The agency page was deleted in May 2026 — positioning was unresolved
 * (Urumi-as-agency vs hosting-for-agencies vs anti-agencies) and the
 * page was never linked from nav or footer. Both the canonical
 * /woocommerce-agencies slug and its legacy /woocommerce-agency-page
 * alias 301 to /woocommerce so any indexed inbound links + SEO equity
 * land on a live page instead of a 404.
 *
 * Runs before WordPress resolves the request so the redirect fires
 * regardless of whether a WP page with the matching slug still exists
 * in the DB (the WP page row may still be there for now — the
 * sitemap excludes it, this handler short-circuits the request).
 */
function urumi_redirect_agency_page() {
    $path = trim(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH), '/');
    if ($path === 'woocommerce-agencies' || $path === 'woocommerce-agency-page') {
        wp_redirect(home_url('/woocommerce'), 301);
        exit;
    }
}
add_action('template_redirect', 'urumi_redirect_agency_page', 1);

/**
 * Serve /llms.txt (and /llms-full.txt if we ever add one) with explicit,
 * agent-friendly headers. Cloudflare already serves it as text/plain
 * via .txt extension auto-detection, but:
 *   - charset is omitted (some strict parsers expect text/plain; charset=utf-8)
 *   - Cache-Control comes from CF defaults — pin it ourselves so we know
 *     answer engines aren't being told to revalidate every hit
 *   - X-Robots-Tag tells crawlers explicitly that the file is OK to index
 *     (some bot policies treat .txt files conservatively)
 *
 * Runs at template_redirect (very early in WP's request lifecycle) so it
 * intercepts the file before WP tries to find a post / 404 it. exit() so
 * WP doesn't append any wp_footer / debug output that would corrupt the
 * plain-text response.
 */
function urumi_serve_llms_txt() {
    $request_path = strtolower(parse_url($_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH) ?: '');
    if ($request_path !== '/llms.txt' && $request_path !== '/llms-full.txt') return;

    $candidate = ABSPATH . ltrim($request_path, '/');
    if (!file_exists($candidate)) return; // fall through to WP 404

    // filemtime / md5_file / filesize each return false on failure (e.g.
    // permission errors that file_exists() doesn't catch). Bail out and
    // let WP handle the request normally if any of the three fail —
    // sending Last-Modified: 1970-01-01 or ETag: "" / Content-Length: 0
    // would be worse for AEO retrieval than just falling through.
    $mtime    = filemtime($candidate);
    $hash     = md5_file($candidate);
    $filesize = filesize($candidate);
    if ($mtime === false || $hash === false || $filesize === false) return;
    $etag = '"' . $hash . '"';

    // Conditional GET — return 304 if the client has the current version.
    $if_modified_since = isset($_SERVER['HTTP_IF_MODIFIED_SINCE'])
        ? strtotime($_SERVER['HTTP_IF_MODIFIED_SINCE']) : false;
    $if_none_match     = $_SERVER['HTTP_IF_NONE_MATCH'] ?? '';
    if (($if_modified_since && $if_modified_since >= $mtime) || $if_none_match === $etag) {
        status_header(304);
        exit;
    }

    // Headers tuned for agent retrieval:
    //   - explicit text/plain; charset=utf-8 (no Content-Type sniffing)
    //   - public + 1h CF + 1h browser, sufficient for an AEO file that
    //     doesn't change every hour
    //   - X-Robots-Tag: index, follow — counters any blanket-deny defaults
    //   - Allow: GET, HEAD — answer engines often probe HEAD first
    header('Content-Type: text/plain; charset=utf-8');
    header('Cache-Control: public, max-age=3600, s-maxage=3600');
    header('X-Robots-Tag: index, follow');
    header('Allow: GET, HEAD');
    header('Last-Modified: ' . gmdate('D, d M Y H:i:s', $mtime) . ' GMT');
    header('ETag: ' . $etag);
    header('Vary: Accept-Encoding');

    if (strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'HEAD') {
        header('Content-Length: ' . $filesize);
        exit;
    }

    readfile($candidate);
    exit;
}
// Priority 0 so this runs before any other template_redirect callback
// (like the agency-page redirect above) gets a chance.
add_action('template_redirect', 'urumi_serve_llms_txt', 0);

function urumi_maybe_flush_rewrites() {
    $current_version = '2026-05-12-agency-delete';
    if (get_option('urumi_rewrites_version') !== $current_version) {
        urumi_register_woocommerce_alias();
        flush_rewrite_rules(false); // false = don't write .htaccess
        update_option('urumi_rewrites_version', $current_version);
    }
}
add_action('init', 'urumi_maybe_flush_rewrites', 99);

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
            // Vendor chunk JS files — preload the immediately-needed ones.
            // react/router are critical for first paint; motion/lottie/lenis
            // can wait for actual usage (most pages don't need lottie at all).
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

        // Enqueue CSS — pass null for version so WP does not append ?ver=.
        // The filename is already content-hashed (e.g. index-Bx_asrzg.css);
        // a wp filemtime ?ver= on top is redundant cache-busting and just
        // makes the resource URL noisier. (CSS is not modulepreloaded
        // currently, so this isn't fixing a double-fetch — purely hygiene
        // and consistency with the JS enqueue below.)
        if (!empty($assets['css'])) {
            wp_enqueue_style(
                'react-woo-style',
                $theme_uri . '/dist/assets/' . $assets['css'],
                array(),
                null
            );
        }

        // Enqueue JS — same null-version reasoning as CSS above. Without
        // this, modulepreload (no ?ver=) and the <script> tag (with ?ver=)
        // would point at different URLs and the browser would fetch the
        // entry chunk twice on every page load.
        if (!empty($assets['js'])) {
            wp_enqueue_script(
                'react-woo-app',
                $theme_uri . '/dist/assets/' . $assets['js'],
                array(),
                null,
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
 * Remove unnecessary WordPress CSS/JS from headless React theme.
 * Saves ~13KB inline CSS + 4 HTTP requests from Contact Form 7.
 */
function react_woo_headless_cleanup_assets() {
    // Remove WordPress block library styles (not used by React components)
    wp_dequeue_style('wp-block-library');
    wp_dequeue_style('wp-block-library-theme');
    wp_dequeue_style('classic-theme-styles');
    wp_dequeue_style('global-styles');
    wp_deregister_style('global-styles');
    // Also remove the action that enqueues global styles
    remove_action('wp_enqueue_scripts', 'wp_enqueue_global_styles');
    remove_action('wp_footer', 'wp_enqueue_global_styles', 1);

    // Remove Contact Form 7 assets on frontend (React handles forms)
    wp_dequeue_style('contact-form-7');
    wp_dequeue_script('contact-form-7');
    wp_dequeue_script('swv');
}
add_action('wp_enqueue_scripts', 'react_woo_headless_cleanup_assets', 100);

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
 * Get context-aware SEO data for meta tags
 */
function urumi_get_seo_data($ssr_router) {
    $route_type = $ssr_router->get_route_type();
    $route_data = $ssr_router->get_route_data();

    $default_image = get_template_directory_uri() . '/public/og-default.png';

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
        'image_width' => '1200',
        'image_height' => '630',
        'noindex' => false // Default: allow indexing
    );

    switch ($route_type) {
        case 'vision':
            $seo_data['title'] = 'Urumi — Agentic AI for WooCommerce';
            $seo_data['description'] = 'eCommerce re-imagined for the AI era. Urumi handles infrastructure, optimization, scaling, and technical complexity so merchants can focus on customers and growth. Built by ex-Automattic engineers who shipped WooCommerce core (earlier: HackerRank, YC, $2M → $30M ARR).';
            $seo_data['canonical_url'] = home_url('/');
            $seo_data['url'] = home_url('/');
            $seo_data['keywords'] = 'agentic AI eCommerce, AI eCommerce platform, WooCommerce AI, effortless eCommerce, autonomous infrastructure, AI-native platform, WooCommerce automation';
            $seo_data['og_title'] = 'Urumi — Agentic AI for WooCommerce';
            // Per-page OG image rendered from docs/og-sources/og-vision.html.
            // Editorial poster: cream paper, warm corner glow, hand-drawn
            // storefront vignette in the bottom-right (echoes the page's
            // Storefront Panorama), headline "eCommerce, on autopilot."
            $seo_data['image'] = get_template_directory_uri() . '/public/og-vision.png';
            $seo_data['og_image_alt'] = 'Urumi — eCommerce, on autopilot. Built by the team that made WooCommerce.';
            $seo_data['twitter_card'] = 'summary_large_image';
            $seo_data['twitter_title'] = 'Urumi — Agentic AI for WooCommerce';
            $seo_data['twitter_description'] = 'eCommerce re-imagined for the AI era. Infrastructure, optimization, and scaling handled by AI so you can focus on growth.';
            break;

        case 'woocommerce':
            $seo_data['title'] = 'WooCommerce, on autopilot — Urumi';
            $seo_data['description'] = 'We run the operations layer of your WooCommerce store — scaling, reliability, releases, performance. 99.99% uptime, auto-scaling through viral spikes, root-cause perf fixes shipped as PRs. Built by the people who built WooCommerce.';
            // Canonical always points to /woocommerce. /urumi-for-woocommerce is
            // preserved as a backward-compat alias serving the same content;
            // canonical signals consolidate authority on the new URL.
            $seo_data['canonical_url'] = home_url('/woocommerce');
            $seo_data['url'] = home_url('/woocommerce');
            $seo_data['keywords'] = 'managed WooCommerce hosting, WooCommerce operations, enterprise WooCommerce, auto-scaling WooCommerce, 99.99% uptime, WooCommerce performance, ex-WooCommerce developers, Google Cloud WooCommerce, WooCommerce CI/CD';
            // og_title + twitter_title aligned to the new canonical <title>
            // ("WooCommerce, on autopilot — Urumi") — no stray period before
            // the em-dash, no separate "Operations layer for high-traffic
            // stores" tail. Matches what gets indexed as the page title.
            $seo_data['og_title'] = 'WooCommerce, on autopilot — Urumi';
            // Per-page OG image rendered from docs/og-sources/og-woocommerce.html.
            // Editorial poster mirroring the Vision OG: cream paper, warm
            // corner glow, hand-drawn ops-floor vignette in the bottom-right
            // (echoes the page's Operations Panorama), headline "WooCommerce,
            // on autopilot." + the three concrete grüum metrics as subtitle.
            $seo_data['image'] = get_template_directory_uri() . '/public/og-woocommerce.png';
            $seo_data['og_image_alt'] = 'WooCommerce, on autopilot — Urumi. 5.7s → 0.4s, 99.99% uptime, 16× baseline load absorbed.';
            $seo_data['twitter_card'] = 'summary_large_image';
            $seo_data['twitter_title'] = 'WooCommerce, on autopilot — Urumi';
            $seo_data['twitter_description'] = 'Horizontal scaling, 99.99% uptime, safe releases, and performance guardrails. 5.7s → 0.4s load times for grüum, 16× baseline load absorbed. Built by the people who built WooCommerce.';
            break;

        case 'case-study':
            $slug = isset($route_data['slug']) ? $route_data['slug'] : '';
            // Slug → display name. Preserves diacritics (grüum, müsli, etc.) that
            // a naive ucfirst(str_replace) would strip.
            $case_study_brands = array(
                'gruum-case-study' => 'grüum',
            );
            $customer_name = isset($case_study_brands[$slug])
                ? $case_study_brands[$slug]
                : ucfirst(str_replace('-case-study', '', $slug));
            $seo_data['title'] = "{$customer_name} | Urumi Case Study";
            $seo_data['description'] = "grüum's cached response times dropped from 4s to 0.3s. Uncached from 5.7s to 0.4s. Learn how Urumi fixed cold starts, N+1 queries, and caching misconfigurations to achieve a 294% improvement in user satisfaction.";
            $seo_data['canonical_url'] = home_url('/' . $slug);
            $seo_data['url'] = home_url('/' . $slug);
            $seo_data['og_type'] = 'article';
            $seo_data['keywords'] = 'WooCommerce performance optimization, WooCommerce case study, site speed improvement, eCommerce performance, grüum, 294% improvement';
            $seo_data['og_title'] = "294% Improvement in User Satisfaction - grüum Case Study";
            $seo_data['twitter_card'] = 'summary_large_image';
            $seo_data['twitter_title'] = "How Urumi Fixed grüum's WooCommerce Performance";
            $seo_data['twitter_description'] = 'Cached response times: 4s to 0.3s. Uncached: 5.7s to 0.4s. 294% improvement in user satisfaction. Read the full case study.';
            break;

        case 'blog':
            $seo_data['title'] = 'Urumi Blog — WooCommerce performance & infrastructure';
            $seo_data['description'] = 'Deep dives into WooCommerce performance optimization, infrastructure scaling, and e-commerce best practices from the Urumi engineering team.';
            $seo_data['url'] = home_url('/blog');
            $seo_data['canonical_url'] = home_url('/blog');
            $seo_data['keywords'] = 'WooCommerce performance, WooCommerce optimization, eCommerce infrastructure, WooCommerce scaling, WordPress performance';
            $seo_data['og_title'] = 'WooCommerce Performance & Infrastructure Insights';
            $seo_data['twitter_card'] = 'summary_large_image';
            $seo_data['twitter_title'] = 'Urumi Blog - WooCommerce Performance Insights';
            $seo_data['twitter_description'] = 'Performance optimization, infrastructure scaling, and e-commerce best practices from ex-WooCommerce core developers.';
            break;

        case 'careers':
            $seo_data['title'] = 'Careers at Urumi — Build the future of eCommerce';
            $seo_data['description'] = 'Join Urumi. HQ in San Francisco, engineering in Goa + Bangalore, support and growth across Europe. We\'re hiring DevOps engineers, generalist engineers, designers, and sales to build AI-powered infrastructure that makes eCommerce effortless. Work with ex-Automattic WooCommerce core engineers (earlier: HackerRank, YC, $2M → $30M ARR).';
            $seo_data['url'] = home_url('/careers');
            $seo_data['canonical_url'] = home_url('/careers');
            $seo_data['keywords'] = 'Urumi careers, WooCommerce jobs, DevOps engineer Goa, DevOps engineer Bangalore, San Francisco startup jobs, remote Europe jobs, AI eCommerce jobs, startup jobs India, generalist engineer';
            $seo_data['og_title'] = 'Careers at Urumi - Make eCommerce Effortless';
            $seo_data['twitter_card'] = 'summary_large_image';
            $seo_data['twitter_title'] = 'Careers at Urumi - Build AI-Powered eCommerce';
            $seo_data['twitter_description'] = 'Hiring across San Francisco, Goa, Bangalore, and remote Europe: DevOps, engineers, designers, growth. Build AI infrastructure with ex-Automattic WooCommerce core engineers (earlier: HackerRank, YC, $2M → $30M ARR).';
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

                // Strip query strings so canonical doesn't fork on ?utm_*, ?ref= etc.
                $clean_link = strtok($post['link'], '?');
                $seo_data['url'] = $clean_link;
                $seo_data['canonical_url'] = $clean_link;
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
                $seo_data['title'] = wp_strip_all_tags($page['title']['rendered']) . ' | Urumi';

                // Generate description from content
                $content = wp_strip_all_tags($page['content']['rendered']);
                $seo_data['description'] = wp_trim_words($content, 30);

                // Strip query strings so canonical doesn't fork on tracking params.
                $clean_link = strtok($page['link'], '?');
                $seo_data['url'] = $clean_link;
                $seo_data['canonical_url'] = $clean_link;

                // Policy pages should not be indexed (non-business pages)
                $policy_pages = array('terms-and-conditions', 'refund-policy', 'privacy-policy-2');
                if (in_array($slug, $policy_pages)) {
                    $seo_data['noindex'] = true;
                }
            }
            break;
    }

    // Belt-and-suspenders: force noindex on all non-production environments
    // (QA / preview / staging). The urumi-magic mu-plugin class-staging-robots
    // already filters /robots.txt but doesn't touch the per-page meta tag;
    // this closes the gap so crawlers that bypass robots.txt (and human
    // share-previews) still see noindex on every staging page.
    //
    // Mirrors the gating convention used by class-staging-robots.php:
    // ENV_NAME is defined per-tenant by wp-config-local.php; 'production' is
    // the live customer site, everything else is non-prod.
    if (defined('ENV_NAME') && ENV_NAME !== 'production') {
        $seo_data['noindex'] = true;
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
        case 'vision':
            // Use the canonical Organization helper so brand name, logo,
            // sameAs, founder bios, and foundingLocation stay consistent
            // with every other emission of Urumi-the-entity on the site.
            $schema = urumi_organization_schema();
            break;

        case 'woocommerce':
            // Same canonical Organization. The Service / FAQPage / Offer
            // schemas for this route are emitted by template-parts/ssr-woocommerce.php.
            $schema = urumi_organization_schema();
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
                    'name' => urumi_brand_name(),
                    'url' => home_url('/'),
                    'logo' => array(
                        '@type' => 'ImageObject',
                        'url' => urumi_brand_logo()
                    )
                )
            );
            break;

        case 'careers':
            // Careers page emits a full JobPosting ItemList from
            // template-parts/ssr-careers.php (4 jobs). Don't double-up here —
            // a single conflicting JobPosting at the page level would
            // contradict the list. Leave $schema empty for this route.
            break;

        case 'blog-post':
            $slug = $route_data['slug'];
            $post = React_SSR_Data::get_blog_post_by_slug($slug);

            if ($post) {
                // Person byline: enrich the author with worksFor + LinkedIn
                // sameAs when the author matches one of our known founders.
                // For other authors we still emit Person, just without the
                // sameAs link — better than reverting to Organization.
                $author_name = $post['author']['name'];
                $author = array(
                    '@type' => 'Person',
                    'name' => $author_name,
                    'worksFor' => array(
                        '@type' => 'Organization',
                        'name' => urumi_brand_name(),
                        'url' => home_url('/'),
                    ),
                );
                $founder_links = array(
                    'Naman Malhotra' => 'https://www.linkedin.com/in/naman03malhotra',
                    'Vedanshu Jain'  => 'https://www.linkedin.com/in/vedanshuj/',
                );
                if (isset($founder_links[$author_name])) {
                    $author['sameAs'] = $founder_links[$author_name];
                }

                $schema = array(
                    '@context' => 'https://schema.org',
                    '@type' => 'Article',
                    'headline' => wp_strip_all_tags($post['title']['rendered']),
                    'description' => wp_strip_all_tags($seo_data['description']),
                    'datePublished' => $post['date'],
                    'dateModified' => $post['modified'],
                    'author' => $author,
                    'publisher' => array(
                        '@type' => 'Organization',
                        'name' => urumi_brand_name(),
                        'url' => home_url('/'),
                        'logo' => array(
                            '@type' => 'ImageObject',
                            'url' => urumi_brand_logo()
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

        case 'case-study':
            // Case-study pages get their own route_type from ssr-router.php.
            // Reuse the customer-name map from urumi_get_seo_data() so the
            // Article headline matches the <title> (preserves diacritics).
            $slug = isset($route_data['slug']) ? $route_data['slug'] : '';
            $case_study_brands = array(
                'gruum-case-study' => 'grüum',
            );
            $customer_name = isset($case_study_brands[$slug])
                ? $case_study_brands[$slug]
                : ucfirst(str_replace('-case-study', '', $slug));
            $page = React_SSR_Data::get_page_by_slug($slug);
            $date_published = $page ? $page['date']     : date('c');
            $date_modified  = $page ? $page['modified'] : date('c');
            $main_entity_id = $page ? $page['link']     : home_url('/' . $slug);
            // Case study is founder-authored — attribute to Vedanshu (CTO)
            // by default since case studies are typically written by the
            // engineer who led the migration. Flip to Naman if the actual
            // byline is different.
            $schema = array(
                '@context' => 'https://schema.org',
                '@type' => 'Article',
                'headline' => "How Urumi Increased {$customer_name}'s User Satisfaction by 294%",
                'description' => $seo_data['description'],
                'datePublished' => $date_published,
                'dateModified' => $date_modified,
                'author' => array(
                    '@type' => 'Person',
                    'name' => 'Vedanshu Jain',
                    'jobTitle' => 'Co-founder',
                    'worksFor' => array(
                        '@type' => 'Organization',
                        'name' => urumi_brand_name(),
                        'url' => home_url('/'),
                    ),
                    'sameAs' => 'https://www.linkedin.com/in/vedanshuj/',
                ),
                'publisher' => array(
                    '@type' => 'Organization',
                    'name' => urumi_brand_name(),
                    'url' => home_url('/'),
                    'logo' => array(
                        '@type' => 'ImageObject',
                        'url' => urumi_brand_logo()
                    )
                ),
                'mainEntityOfPage' => array(
                    '@type' => 'WebPage',
                    '@id' => $main_entity_id
                ),
                'about' => array(
                    '@type' => 'Thing',
                    'name' => 'WooCommerce Performance Optimization'
                )
            );
            break;

        case 'page':
            $slug = $route_data['slug'];
            $page = React_SSR_Data::get_page_by_slug($slug);

            if ($page) {
                // (Legacy) Special schema for case study pages that hit the
                // 'page' route_type — kept for safety in case a case-study
                // slug ever falls through to this branch. The 'case-study'
                // case above handles the normal route.
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
        case 'woocommerce':
            $items[] = array(
                '@type' => 'ListItem',
                'position' => $position++,
                'name' => 'WooCommerce hosting'
            );
            break;

        case 'careers':
            $items[] = array(
                '@type' => 'ListItem',
                'position' => $position++,
                'name' => 'Careers'
            );
            break;

        case 'case-study':
            $slug = isset($route_data['slug']) ? $route_data['slug'] : '';
            $case_study_brands = array(
                'gruum-case-study' => 'grüum case study',
            );
            $crumb_name = isset($case_study_brands[$slug])
                ? $case_study_brands[$slug]
                : 'Case study';
            $items[] = array(
                '@type' => 'ListItem',
                'position' => $position++,
                'name' => $crumb_name
            );
            break;

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

/**
 * ── wp-sitemap.xml polish ───────────────────────────────────────────────
 *
 * WordPress 5.5+ auto-generates a sitemap index at /wp-sitemap.xml from
 * every public post, page, taxonomy term, and user. Out of the box that
 * gives Urumi a sitemap with three problems:
 *
 *   1. Lists legacy alias slugs instead of canonicals:
 *      - /urumi-for-woocommerce   should be /woocommerce
 *      (The /woocommerce-agency-page slug is excluded outright now —
 *      the page it pointed at was deleted; see urumi_redirect_agency_page.)
 *
 *   2. Lists pages we explicitly noindex or that don't exist as real
 *      marketing pages (policy pages, /vision legacy, /blogs-2 legacy,
 *      /my-account, /contact-us). Indexing noindex pages from a sitemap
 *      is a soft signal but still wastes crawl budget.
 *
 *   3. Ships user + tag/category sub-sitemaps. With one author and
 *      auto-generated tag pages we don't render meaningfully, those
 *      surfaces are crawl-trap noise.
 *
 * This block fixes all three via the wp_sitemaps_* filters (no plugin
 * dependency, no rewrite-rule changes).
 * ────────────────────────────────────────────────────────────────────── */

/** Legacy WP-page slug → React-route canonical path. */
function urumi_sitemap_canonical_url_map() {
    return array(
        'urumi-for-woocommerce'   => '/woocommerce',
    );
}

/** Pages that should never appear in the sitemap. */
function urumi_sitemap_excluded_slugs() {
    return array(
        // Already noindex (urumi_get_seo_data sets noindex=true for these)
        'privacy-policy-2',
        'terms-and-conditions',
        'refund-policy',
        // WooCommerce account / utility (not part of marketing surface)
        'my-account',
        // Legacy / dead pages from earlier site iterations
        'contact-us',
        'blogs-2',
        'vision',
        // Deleted page — both old slugs now 301 → /woocommerce
        'woocommerce-agency-page',
    );
}

/**
 * Rewrite legacy alias slugs to canonical URLs in sitemap entries.
 * Mirrors the canonical_url logic in urumi_get_seo_data() so the
 * sitemap and <link rel="canonical"> agree.
 */
add_filter('wp_sitemaps_posts_entry', function($entry, $post) {
    $map = urumi_sitemap_canonical_url_map();
    if (isset($map[$post->post_name])) {
        $entry['loc'] = home_url($map[$post->post_name]);
    }
    return $entry;
}, 10, 2);

/**
 * Exclude noindex / dead pages from the page sitemap by slug.
 * We add IDs to post__not_in rather than relying on the noindex meta
 * because WordPress doesn't surface our custom $seo_data['noindex']
 * flag to its sitemap provider.
 */
add_filter('wp_sitemaps_posts_query_args', function($args, $post_type) {
    if ($post_type !== 'page') {
        return $args;
    }
    $ids = array();
    foreach (urumi_sitemap_excluded_slugs() as $slug) {
        $page = get_page_by_path($slug);
        if ($page) {
            $ids[] = $page->ID;
        }
    }
    if (!empty($ids)) {
        $args['post__not_in'] = isset($args['post__not_in'])
            ? array_merge((array) $args['post__not_in'], $ids)
            : $ids;
    }
    return $args;
}, 10, 2);

/**
 * Drop the user sitemap entirely. We have one public author whose
 * archive page (/blog/author/vedanshu) the React app doesn't render
 * as anything useful — let it 404 quietly instead of advertising it.
 */
add_filter('wp_sitemaps_add_provider', function($provider, $name) {
    if ($name === 'users') {
        return false;
    }
    return $provider;
}, 10, 2);

/**
 * Drop the post_tag taxonomy sitemap. Tag archive pages are auto-
 * generated and we don't render them. Keep the category sitemap —
 * those pages have intentional categories that aid blog discovery.
 */
add_filter('wp_sitemaps_taxonomies', function($taxonomies) {
    unset($taxonomies['post_tag']);
    return $taxonomies;
});

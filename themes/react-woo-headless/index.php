<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <!-- Favicons -->
    <link rel="icon" type="image/x-icon" href="<?php echo esc_url(get_template_directory_uri()); ?>/public/favicon.ico">
    <link rel="icon" type="image/png" sizes="16x16" href="<?php echo esc_url(get_template_directory_uri()); ?>/public/favicon-16x16.png">
    <link rel="icon" type="image/png" sizes="32x32" href="<?php echo esc_url(get_template_directory_uri()); ?>/public/favicon-32x32.png">
    <link rel="apple-touch-icon" sizes="180x180" href="<?php echo esc_url(get_template_directory_uri()); ?>/public/apple-touch-icon.png">

    <?php
    // Initialize SEO router to get context-aware meta data
    $ssr_router = new React_SSR_Router();
    $seo_data = urumi_get_seo_data($ssr_router);

    // Override WordPress title tag with our route-aware value
    if (!empty($seo_data['title'])) {
        add_filter('pre_get_document_title', function() use ($seo_data) {
            return $seo_data['title'];
        }, 999);
    }

    // Remove WP core duplicates — we output our own robots and canonical
    remove_action('wp_head', 'wp_robots', 1);
    remove_action('wp_head', 'rel_canonical');
    ?>

    <!-- DNS Prefetch & Preconnect -->
    <link rel="dns-prefetch" href="//app.urumi.ai">
    <link rel="dns-prefetch" href="//dashboard.urumi.ai">
    <link rel="dns-prefetch" href="//docs.urumi.ai">
    <link rel="dns-prefetch" href="//urumi.ai">
    <link rel="preconnect" href="https://app.urumi.ai" crossorigin>
    <link rel="preconnect" href="https://dashboard.urumi.ai" crossorigin>

    <!-- Type system: Switzer + Gambarino + JetBrains Mono via Fontshare.
         Loaded async with the classic media="print" onload="this.media='all'"
         pattern so the Fontshare CSS does NOT block first paint. The URL
         already has &display=swap, so the browser renders fallback text
         immediately and swaps to Switzer/Gambarino when the woff2 arrives.
         <noscript> fallback for the no-JS path keeps fonts working even
         when the onload swap can't fire.
         Legacy stylesheets that still name Playfair/Montserrat/Funnel
         Sans fall through the CSS cascade to the system serif/sans —
         pre-design-system holdovers, no font fetch happens for them. -->
    <link rel="preconnect" href="https://api.fontshare.com">
    <link rel="preconnect" href="https://cdn.fontshare.com" crossorigin>
    <link rel="stylesheet" href="https://api.fontshare.com/v2/css?f%5B%5D=switzer@300,400,500,600,700&f%5B%5D=gambarino@400&f%5B%5D=jetbrains-mono@400,500,600&display=swap" media="print" onload="this.media='all'">
    <noscript><link rel="stylesheet" href="https://api.fontshare.com/v2/css?f%5B%5D=switzer@300,400,500,600,700&f%5B%5D=gambarino@400&f%5B%5D=jetbrains-mono@400,500,600&display=swap"></noscript>

    <?php if ($ssr_router->get_route_type() === 'vision'): ?>
    <!-- /woocommerce HTML prefetch — fires only after the page has
         finished its primary load. Browsers with requestIdleCallback
         wait for true main-thread idle; older browsers fall back to
         the window 'load' event so the prefetch never competes with
         critical assets even on slow connections. -->
    <script>
      (function () {
        var url = <?php echo wp_json_encode(home_url('/woocommerce')); ?>;
        var inject = function () {
          var link = document.createElement('link');
          link.rel = 'prefetch';
          link.href = url;
          link.as = 'document';
          document.head.appendChild(link);
        };
        if ('requestIdleCallback' in window) {
          window.requestIdleCallback(inject, { timeout: 4000 });
        } else if (document.readyState === 'complete') {
          inject();
        } else {
          window.addEventListener('load', inject, { once: true });
        }
      })();
    </script>
    <?php endif; ?>

    <!-- SEO Meta Tags -->
    <meta name="description" content="<?php echo esc_attr($seo_data['description']); ?>">
    <?php if (!empty($seo_data['keywords'])): ?>
    <meta name="keywords" content="<?php echo esc_attr($seo_data['keywords']); ?>">
    <?php endif; ?>
    <meta name="author" content="Urumi.ai">
    <?php if (!empty($seo_data['noindex']) && $seo_data['noindex']): ?>
    <meta name="robots" content="noindex, follow">
    <?php else: ?>
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
    <?php endif; ?>

    <!-- Open Graph Tags -->
    <meta property="og:locale" content="<?php echo esc_attr(get_locale()); ?>">
    <meta property="og:type" content="<?php echo esc_attr($seo_data['og_type']); ?>">
    <meta property="og:title" content="<?php echo esc_attr(!empty($seo_data['og_title']) ? $seo_data['og_title'] : $seo_data['title']); ?>">
    <meta property="og:description" content="<?php echo esc_attr($seo_data['description']); ?>">
    <meta property="og:url" content="<?php echo esc_url($seo_data['url']); ?>">
    <meta property="og:site_name" content="Urumi">
    <?php if (!empty($seo_data['image'])): ?>
    <meta property="og:image" content="<?php echo esc_url($seo_data['image']); ?>">
    <meta property="og:image:width" content="<?php echo esc_attr($seo_data['image_width']); ?>">
    <meta property="og:image:height" content="<?php echo esc_attr($seo_data['image_height']); ?>">
    <meta property="og:image:alt" content="<?php echo esc_attr(!empty($seo_data['og_image_alt']) ? $seo_data['og_image_alt'] : 'Urumi — Managed WooCommerce operations on autopilot'); ?>">
    <?php endif; ?>

    <!-- Twitter Card Tags -->
    <meta name="twitter:card" content="<?php echo esc_attr(!empty($seo_data['twitter_card']) ? $seo_data['twitter_card'] : 'summary_large_image'); ?>">
    <meta name="twitter:site" content="@urumi_ai">
    <meta name="twitter:creator" content="@urumi_ai">
    <meta name="twitter:title" content="<?php echo esc_attr(!empty($seo_data['twitter_title']) ? $seo_data['twitter_title'] : $seo_data['title']); ?>">
    <meta name="twitter:description" content="<?php echo esc_attr(!empty($seo_data['twitter_description']) ? $seo_data['twitter_description'] : $seo_data['description']); ?>">
    <?php if (!empty($seo_data['image'])): ?>
    <meta name="twitter:image" content="<?php echo esc_url($seo_data['image']); ?>">
    <meta name="twitter:image:alt" content="<?php echo esc_attr(!empty($seo_data['og_image_alt']) ? $seo_data['og_image_alt'] : 'Urumi — Managed WooCommerce operations on autopilot'); ?>">
    <?php endif; ?>

    <!-- Additional SEO Tags -->
    <!-- theme-color mirrors design-system tokens: cream (--color-bg light) / coffee (--color-bg dark). -->
    <meta name="theme-color" content="#FDFAF6" media="(prefers-color-scheme: light)">
    <meta name="theme-color" content="#100904" media="(prefers-color-scheme: dark)">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">

    <!-- Canonical URL -->
    <link rel="canonical" href="<?php echo esc_url($seo_data['canonical_url']); ?>">

    <!-- hreflang: single-language site, declare en + x-default to lock targeting -->
    <link rel="alternate" hreflang="en" href="<?php echo esc_url($seo_data['canonical_url']); ?>">
    <link rel="alternate" hreflang="x-default" href="<?php echo esc_url($seo_data['canonical_url']); ?>">

    <!-- llms.txt discovery — advertised as an alternate plain-text view of
         the site for LLM answer engines / agent crawlers that probe <head>
         for AEO files. Several emerging conventions are covered:
           * rel="alternate" type="text/plain"    — generic alt-format hint
           * rel="llms"                            — informal LLM-specific rel
           * meta name="llms-txt"                  — meta-tag fallback
         All three point at the same file so different crawlers find it. -->
    <link rel="alternate" type="text/plain" title="LLM-readable summary" href="<?php echo esc_url(home_url('/llms.txt')); ?>">
    <link rel="llms" href="<?php echo esc_url(home_url('/llms.txt')); ?>">
    <meta name="llms-txt" content="<?php echo esc_url(home_url('/llms.txt')); ?>">

    <!-- JSON-LD Schema -->
    <?php
    $schema_data = urumi_get_schema_data($ssr_router, $seo_data);
    if (!empty($schema_data)): ?>
    <script type="application/ld+json">
    <?php echo wp_json_encode($schema_data, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT); ?>
    </script>
    <?php endif; ?>

    <!-- Breadcrumb Schema -->
    <?php
    $breadcrumb_schema = urumi_get_breadcrumb_schema($ssr_router);
    if (!empty($breadcrumb_schema)): ?>
    <script type="application/ld+json">
    <?php echo wp_json_encode($breadcrumb_schema, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT); ?>
    </script>
    <?php endif; ?>

    <!-- Mark <html> as JS-ready synchronously before the SSR style block
         parses. The `html.js-ready #ssr-content { display: none }` rule
         below then hides the SSR HTML before first paint, eliminating the
         pre-React flash. Crawlers and JS-off users (rare but real) never
         see the class added, so the SSR remains visible to them. -->
    <script>document.documentElement.className += ' js-ready';</script>

    <!-- SSR Content Styles: readable for bots, removed once React loads.
         Hardcoded to LIGHT-theme design-system tokens (CSS variables aren't
         available before React mounts). Mirrors urumi.ai/themes/.../src/
         design-system/tokens.css :root values. -->
    <style id="ssr-styles">
        /* Hide SSR content from sighted users with JS enabled. Crawlers
         * still parse the HTML; JS-off users get the visible fallback. */
        html.js-ready #ssr-content { display: none; }

        body { background: #FDFAF6; }
        #ssr-content *, #ssr-content *::before, #ssr-content *::after {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }
        #ssr-content {
            font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif;
            color: #100904;                                /* --color-fg */
            background: #FDFAF6;                           /* --color-bg */
            line-height: 1.7;
            max-width: 800px;
            margin: 0 auto;
            padding: 2rem 1.5rem;
        }
        #ssr-content h1 { font-size: 2.2rem; font-weight: 700; margin-bottom: 1rem; line-height: 1.2; letter-spacing: -0.02em; }
        #ssr-content h2 { font-size: 1.6rem; font-weight: 700; margin-top: 2.5rem; margin-bottom: 0.75rem; letter-spacing: -0.02em; }
        #ssr-content h3 { font-size: 1.2rem; font-weight: 600; margin-top: 1.5rem; margin-bottom: 0.5rem; letter-spacing: -0.015em; }
        #ssr-content h4 { font-size: 1.1rem; font-weight: 600; margin-top: 1.2rem; margin-bottom: 0.4rem; }
        #ssr-content p { margin-bottom: 1rem; }
        #ssr-content ul { padding-left: 1.5rem; margin-bottom: 1rem; }
        #ssr-content li { margin-bottom: 0.4rem; }
        #ssr-content table { width: 100%; border-collapse: collapse; margin: 1.5rem 0; }
        #ssr-content th, #ssr-content td { padding: 0.75rem 1rem; text-align: left; border-bottom: 1px solid rgba(16, 9, 4, 0.11); }
        #ssr-content th { font-weight: 600; background: #EDE5D8; }   /* --color-surface-3 */
        #ssr-content blockquote { border-left: 3px solid #DC5000; padding-left: 1rem; margin: 1.5rem 0; font-style: italic; color: rgba(16, 9, 4, 0.55); }
        #ssr-content .ssr-section { margin-bottom: 2.5rem; }
        #ssr-content .ssr-metric { display: inline-block; margin-right: 2rem; margin-bottom: 0.5rem; }
        #ssr-content .ssr-metric strong { font-size: 1.4rem; color: #DC5000; }   /* --color-accent */
        #ssr-content a { color: #DC5000; text-decoration: underline; text-underline-offset: 3px; }
        #ssr-content a:hover { color: #C04500; }                                  /* --color-accent-hover */
        #ssr-content strong { font-weight: 600; color: #100904; }
        #ssr-content dt { font-weight: 600; margin-top: 1rem; }
        #ssr-content dd { margin-left: 0; margin-bottom: 0.5rem; color: rgba(16, 9, 4, 0.55); }
        #ssr-content cite { display: block; margin-top: 0.5rem; font-size: 0.85rem; font-style: normal; letter-spacing: 0.06em; text-transform: uppercase; color: rgba(16, 9, 4, 0.55); }
        #ssr-content .ssr-toc { border-inline-start: 3px solid #DC5000; padding-inline-start: 1rem; margin: 1.5rem 0 2rem; }
        #ssr-content .ssr-toc-label { font-size: 0.85rem; letter-spacing: 0.06em; text-transform: uppercase; color: rgba(16, 9, 4, 0.55); margin-bottom: 0.5rem; }
        #ssr-content .ssr-toc-list { list-style: decimal inside; padding-left: 0; margin: 0; }
        #ssr-content .ssr-toc-list li { margin-bottom: 0.25rem; }
        #ssr-content .ssr-toc-list a { color: #100904; text-decoration: none; }
        #ssr-content .ssr-toc-list a:hover { color: #DC5000; text-decoration: underline; }
    </style>

    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
    <?php wp_body_open(); ?>

    <!-- SSR: Full semantic content for bots, crawlers, and AI answer engines -->
    <!-- React removes this element on mount and renders interactively in #root -->
    <?php $ssr_router->render(); ?>

    <?php wp_footer(); ?>
</body>
</html>

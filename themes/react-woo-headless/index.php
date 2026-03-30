<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <?php
    // Initialize SEO router to get context-aware meta data
    $ssr_router = new React_SSR_Router();
    $seo_data = urumi_get_seo_data($ssr_router);
    ?>

    <!-- DNS Prefetch & Preconnect -->
    <link rel="dns-prefetch" href="//app.urumi.ai">
    <link rel="dns-prefetch" href="//dashboard.urumi.ai">
    <link rel="dns-prefetch" href="//docs.urumi.ai">
    <link rel="dns-prefetch" href="//urumi.ai">
    <link rel="preconnect" href="https://app.urumi.ai" crossorigin>
    <link rel="preconnect" href="https://dashboard.urumi.ai" crossorigin>

    <!-- Google Fonts — non-blocking with preconnect + swap -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Montserrat:wght@300;400;500;600&family=Space+Grotesk:wght@400;500;600;700&family=IBM+Plex+Serif:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Funnel+Sans:wght@300;400;500;600;700;800&display=swap" media="print" onload="this.media='all'">
    <noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Montserrat:wght@300;400;500;600&family=Space+Grotesk:wght@400;500;600;700&family=IBM+Plex+Serif:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Funnel+Sans:wght@300;400;500;600;700;800&display=swap"></noscript>

    <?php if ($ssr_router->get_route_type() === 'vision'): ?>
    <!-- Preload WooCommerce page for faster navigation -->
    <link rel="prefetch" href="<?php echo esc_url(home_url('/urumi-for-woocommerce')); ?>" as="document">
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
    <meta property="og:image:alt" content="<?php echo esc_attr($seo_data['title']); ?>">
    <?php endif; ?>

    <!-- Twitter Card Tags -->
    <meta name="twitter:card" content="<?php echo esc_attr(!empty($seo_data['twitter_card']) ? $seo_data['twitter_card'] : 'summary_large_image'); ?>">
    <meta name="twitter:site" content="@urumi_ai">
    <meta name="twitter:creator" content="@urumi_ai">
    <meta name="twitter:title" content="<?php echo esc_attr(!empty($seo_data['twitter_title']) ? $seo_data['twitter_title'] : $seo_data['title']); ?>">
    <meta name="twitter:description" content="<?php echo esc_attr(!empty($seo_data['twitter_description']) ? $seo_data['twitter_description'] : $seo_data['description']); ?>">
    <?php if (!empty($seo_data['image'])): ?>
    <meta name="twitter:image" content="<?php echo esc_url($seo_data['image']); ?>">
    <meta name="twitter:image:alt" content="<?php echo esc_attr($seo_data['title']); ?>">
    <?php endif; ?>

    <!-- Additional SEO Tags -->
    <meta name="theme-color" content="#4338ca">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">

    <!-- Canonical URL -->
    <link rel="canonical" href="<?php echo esc_url($seo_data['canonical_url']); ?>">

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

    <!-- SSR Content Styles: readable for bots, removed once React loads -->
    <style id="ssr-styles">
        #ssr-content {
            font-family: 'Funnel Sans', 'Space Grotesk', system-ui, -apple-system, sans-serif;
            color: #1a1a2e;
            line-height: 1.7;
            max-width: 800px;
            margin: 0 auto;
            padding: 2rem 1.5rem;
        }
        #ssr-content h1 { font-size: 2.2rem; font-weight: 700; margin-bottom: 1rem; line-height: 1.2; }
        #ssr-content h2 { font-size: 1.6rem; font-weight: 600; margin-top: 2.5rem; margin-bottom: 0.75rem; }
        #ssr-content h3 { font-size: 1.2rem; font-weight: 600; margin-top: 1.5rem; margin-bottom: 0.5rem; }
        #ssr-content h4 { font-size: 1.1rem; font-weight: 600; margin-top: 1.2rem; margin-bottom: 0.4rem; }
        #ssr-content p { margin-bottom: 1rem; }
        #ssr-content ul { padding-left: 1.5rem; margin-bottom: 1rem; }
        #ssr-content li { margin-bottom: 0.4rem; }
        #ssr-content table { width: 100%; border-collapse: collapse; margin: 1.5rem 0; }
        #ssr-content th, #ssr-content td { padding: 0.75rem 1rem; text-align: left; border-bottom: 1px solid #e5e7eb; }
        #ssr-content th { font-weight: 600; background: #f9fafb; }
        #ssr-content blockquote { border-left: 3px solid #4338ca; padding-left: 1rem; margin: 1.5rem 0; font-style: italic; color: #374151; }
        #ssr-content .ssr-section { margin-bottom: 2.5rem; }
        #ssr-content .ssr-metric { display: inline-block; margin-right: 2rem; margin-bottom: 0.5rem; }
        #ssr-content .ssr-metric strong { font-size: 1.4rem; color: #4338ca; }
        #ssr-content a { color: #4338ca; text-decoration: underline; }
        #ssr-content dt { font-weight: 600; margin-top: 1rem; }
        #ssr-content dd { margin-left: 0; margin-bottom: 0.5rem; color: #4b5563; }
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

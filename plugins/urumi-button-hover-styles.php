<?php
/**
 * Plugin Name: Urumi Button Hover Styles & Performance Optimization
 * Description: Adds hover background color style variations for button blocks and optimizes page loading performance with async JS and lazy loading
 * Version: 1.1.0
 * Author: Urumi.ai
 * Requires at least: 6.0
 * Tested up to: 6.8
 * WC requires at least: 8.0
 * WC tested up to: 9.8
 */

// Prevent direct access
if (!defined("ABSPATH")) {
    exit;
}

// HPOS Compatibility Declaration
add_action("before_woocommerce_init", function() {
    if (class_exists("\Automattic\WooCommerce\Utilities\FeaturesUtil")) {
        \Automattic\WooCommerce\Utilities\FeaturesUtil::declare_compatibility("custom_order_tables", __FILE__, true);
    }
});

/**
 * Register button hover background color block styles
 */
function urumi_register_button_hover_styles() {
    $script = "
    wp.domReady( function() {
        wp.blocks.registerBlockStyle('core/button', {
            name: 'hover-bg-primary',
            label: 'Hover Purple'
        });

        wp.blocks.registerBlockStyle('core/button', {
            name: 'hover-bg-secondary', 
            label: 'Hover Green'
        });

        wp.blocks.registerBlockStyle('core/button', {
            name: 'hover-bg-accent',
            label: 'Hover Turquoise'
        });

        wp.blocks.registerBlockStyle('core/button', {
            name: 'hover-bg-gradient',
            label: 'Hover Gradient'
        });
        wp.blocks.registerBlockStyle('core/button', {
            name: 'hover-bg-transparent',
            label: 'Hover Transparent White'
        });
    });
    ";
    
    wp_add_inline_script("wp-blocks", $script);
}

/**
 * Add CSS for hover styles
 */
function urumi_add_button_hover_css() {
    $css = "
    .wp-block-button.is-style-hover-bg-primary .wp-block-button__link {
        transition: background-color 0.3s ease, color 0.3s ease;
    }
    .wp-block-button.is-style-hover-bg-primary .wp-block-button__link:hover {
        background-color: var(--wp--preset--color--custom-han-purple) !important;
        color: white !important;
    }

    .wp-block-button.is-style-hover-bg-secondary .wp-block-button__link {
        transition: background-color 0.3s ease, color 0.3s ease;
    }
    .wp-block-button.is-style-hover-bg-secondary .wp-block-button__link:hover {
        background-color: var(--wp--preset--color--custom-green-crayola) !important;
        color: white !important;
    }

    .wp-block-button.is-style-hover-bg-accent .wp-block-button__link {
        transition: background-color 0.3s ease, color 0.3s ease;
    }
    .wp-block-button.is-style-hover-bg-accent .wp-block-button__link:hover {
        background-color: var(--wp--preset--color--custom-turquoise-surf) !important;
        color: white !important;
    }

    .wp-block-button.is-style-hover-bg-gradient .wp-block-button__link {
        transition: background 0.3s ease, color 0.3s ease;
    }
    .wp-block-button.is-style-hover-bg-gradient .wp-block-button__link:hover {
        background: var(--wp--preset--gradient--purple-pink-orange) !important;
        color: white !important;
    }
    .wp-block-button.is-style-hover-bg-transparent .wp-block-button__link {
        transition: background-color 0.3s ease, color 0.3s ease;
    }
    .wp-block-button.is-style-hover-bg-transparent .wp-block-button__link:hover {
        background-color: #ffffff1a !important;
    }
    ";
    
    wp_add_inline_style("wp-block-button", $css);
}

add_action("enqueue_block_editor_assets", "urumi_register_button_hover_styles");
add_action("wp_enqueue_scripts", "urumi_add_button_hover_css");
add_action("enqueue_block_assets", "urumi_add_button_hover_css");

// ========================================
// SPLINE HERO SECTION FUNCTIONALITY
// ========================================

/**
 * Enqueue Spline viewer script
 */
function urumi_enqueue_spline_scripts() {
    // Only load Spline on the home page
    if (is_front_page()) {
        wp_enqueue_script(
            'spline-viewer',
            'https://unpkg.com/@splinetool/viewer@1.10.44/build/spline-viewer.js',
            array(),
            '1.10.44',
            true
        );
    }
}
//add_action('wp_enqueue_scripts', 'urumi_enqueue_spline_scripts');

/**
 * Add module type and async loading to Spline script
 */
function urumi_add_module_type($tag, $handle, $src) {
    if ($handle === 'spline-viewer') {
        $tag = str_replace('<script', '<script type="module" async', $tag);
    }
    return $tag;
}
//add_filter('script_loader_tag', 'urumi_add_module_type', 10, 3);

/**
 * Add Spline hero CSS styles
 */
function urumi_add_spline_hero_css() {
    // Only load Spline CSS on home page
    if (!is_front_page()) {
        return;
    }
    $css = "
    .urumi-spline-hero {
        position: relative;
        height: 600px;
        overflow: hidden;
        background: #000;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0;
        padding: 0;
    }
    
    .urumi-spline-viewer {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 1;
        pointer-events: none;
        display: block;
    }
    
    .urumi-hero-content {
        position: relative;
        z-index: 10;
        text-align: center;
        padding: 2rem;
        color: white;
        max-width: 800px;
    }
    
    .urumi-hero-title {
        font-size: 3rem;
        margin-bottom: 1rem;
        text-shadow: 0 4px 8px rgba(0,0,0,0.8);
        font-weight: bold;
        line-height: 1.2;
    }
    
    .urumi-hero-subtitle {
        font-size: 1.5rem;
        margin-bottom: 2rem;
        text-shadow: 0 2px 4px rgba(0,0,0,0.6);
        opacity: 0.9;
        line-height: 1.4;
    }
    
    .urumi-hero-buttons {
        margin-top: 2rem;
    }
    
    .urumi-hero-btn {
        display: inline-block;
        padding: 14px 28px;
        margin: 8px;
        border-radius: 0.75rem;
        text-decoration: none;
        font-weight: 600;
        font-size: 1rem;
        transition: all 0.3s ease;
        border: 2px solid transparent;
        cursor: pointer;
        position: relative;
    }
    
    /* Primary button - using existing Urumi gradient border style */
    .urumi-hero-btn.primary {
        background: linear-gradient(white, white) padding-box,
                   linear-gradient(107.74deg, #2fa0ec 12.12%, #7040ea 100%) border-box;
        border: 2px solid transparent;
        color: #7040ea;
        font-weight: 700;
    }
    
    .urumi-hero-btn.primary:hover {
        background-color: #6832f0;
        color: white;
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(112, 64, 234, 0.4);
    }
    
    /* Secondary button - matching existing transparent style */
    .urumi-hero-btn.secondary {
        border: 2px solid rgba(255,255,255,0.3);
        color: white;
        background: rgba(255,255,255,0.1);
        backdrop-filter: blur(10px);
    }
    
    .urumi-hero-btn.secondary:hover {
        border-color: white;
        background: rgba(255,255,255,0.2);
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(255,255,255,0.2);
    }
    
    .urumi-spline-loading {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: rgba(255,255,255,0.7);
        font-size: 1.1rem;
        z-index: 5;
    }
    
    @media (max-width: 768px) {
        .urumi-hero-title { 
            font-size: 2.2rem; 
        }
        .urumi-hero-subtitle { 
            font-size: 1.2rem; 
        }
        .urumi-hero-content { 
            padding: 1rem; 
        }
        .urumi-hero-btn {
            padding: 12px 20px;
            font-size: 0.9rem;
        }
    }
    
    @media (max-width: 480px) {
        .urumi-hero-title { 
            font-size: 1.8rem; 
        }
        .urumi-hero-subtitle { 
            font-size: 1rem; 
        }
        .urumi-hero-btn {
            display: block;
            margin: 8px auto;
            max-width: 200px;
        }
    }
    ";
    
    wp_add_inline_style('wp-block-button', $css);
}
//add_action('wp_enqueue_scripts', 'urumi_add_spline_hero_css');
//add_action('enqueue_block_assets', 'urumi_add_spline_hero_css');

/**
 * Spline Hero Shortcode
 */
function urumi_spline_hero_shortcode($atts) {
    $atts = shortcode_atts(array(
        'spline_url' => 'https://prod.spline.design/pi9p1zbkZyLoF3M6/scene.splinecode',
        'title' => 'Welcome to Urumi.ai',
        'subtitle' => 'Your AI-powered WordPress hosting platform',
        'primary_btn_text' => 'Get Started',
        'primary_btn_url' => '#',
        'secondary_btn_text' => 'Learn More', 
        'secondary_btn_url' => '#',
        'height' => '600px'
    ), $atts);
    
    ob_start();
    ?>
    <div class="urumi-spline-hero" style="height: <?php echo esc_attr($atts['height']); ?>;">
        <spline-viewer 
            class="urumi-spline-viewer" 
            url="<?php echo esc_url($atts['spline_url']); ?>"
            loading-anim-type="spinner-big-light">
        </spline-viewer>
        
        <div class="urumi-spline-loading">Loading 3D Scene...</div>
        
        <div class="urumi-hero-content">
            <h1 class="urumi-hero-title"><?php echo esc_html($atts['title']); ?></h1>
            <p class="urumi-hero-subtitle"><?php echo esc_html($atts['subtitle']); ?></p>
            
            <div class="urumi-hero-buttons">
                <?php if (!empty($atts['primary_btn_text'])): ?>
                <a href="<?php echo esc_url($atts['primary_btn_url']); ?>" 
                   class="urumi-hero-btn primary">
                    <?php echo esc_html($atts['primary_btn_text']); ?>
                </a>
                <?php endif; ?>
                
                <?php if (!empty($atts['secondary_btn_text'])): ?>
                <a href="<?php echo esc_url($atts['secondary_btn_url']); ?>" 
                   class="urumi-hero-btn secondary">
                    <?php echo esc_html($atts['secondary_btn_text']); ?>
                </a>
                <?php endif; ?>
            </div>
        </div>
    </div>
    <?php
    return ob_get_clean();
}
//add_shortcode('urumi_spline_hero', 'urumi_spline_hero_shortcode');

/**
 * Add Spline initialization script to footer
 */
function urumi_spline_init_script() {
    // Only run on home page
    if (!is_front_page()) {
        return;
    }
    ?>
    <script>
    document.addEventListener('DOMContentLoaded', function() {
        const initSplineViewers = () => {
            const viewers = document.querySelectorAll('spline-viewer');
            
            viewers.forEach(viewer => {
                console.log('Initializing Spline viewer');
                
                const loadingEl = viewer.parentElement.querySelector('.urumi-spline-loading');
                
                viewer.addEventListener('load', () => {
                    console.log('Spline scene loaded successfully');
                    if (loadingEl) loadingEl.style.display = 'none';
                });
                
                viewer.addEventListener('error', (e) => {
                    console.error('Spline viewer error:', e);
                    if (loadingEl) {
                        loadingEl.textContent = '3D Scene unavailable';
                        loadingEl.style.color = '#ff6b6b';
                    }
                });
                
                // Ensure viewer is visible
                viewer.style.display = 'block';
                viewer.style.opacity = '1';
            });
        };
        
        if (customElements.get('spline-viewer')) {
            initSplineViewers();
        } else {
            customElements.whenDefined('spline-viewer').then(initSplineViewers);
        }
    });
    </script>
    <?php
}
//add_action('wp_footer', 'urumi_spline_init_script');

/**
 * PRODUCTION VERSION: Target.wp-block-cover__background only
 */
function urumi_spline_background_integration() {
    // Only run on home page
    if (!is_front_page()) {
        return;
    }
    ?>
    <script>
    document.addEventListener('DOMContentLoaded', function() {
        const coverBackgrounds = document.querySelectorAll('.wp-block-cover__background');
        
        if (coverBackgrounds.length > 0) {
            console.log('Urumi: Integrating Spline in', coverBackgrounds.length, 'cover backgrounds');
            
            coverBackgrounds.forEach((backgroundEl, index) => {
                // Skip if already has spline viewer
                if (backgroundEl.querySelector('spline-viewer')) {
                    return;
                }
                
                // Create Spline viewer
                const splineViewer = document.createElement('spline-viewer');
                splineViewer.setAttribute('url', 'https://prod.spline.design/pi9p1zbkZyLoF3M6/scene.splinecode');
                splineViewer.className = 'urumi-background-spline';
                splineViewer.setAttribute('loading-anim-type', 'spinner-big-light');
                
                // Position behind background content
                splineViewer.style.cssText = `
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: -1;
                    pointer-events: none;
                    opacity: 0.9;
                `;

                
                // Ensure background element can contain positioned children
                const currentPos = window.getComputedStyle(backgroundEl).position;
                if (currentPos === 'static') {
                    backgroundEl.style.position = 'relative';
                }

                // Insert as first child (behind video/image)
                backgroundEl.insertBefore(splineViewer, backgroundEl.firstChild);
                
                // Event handlers
                splineViewer.addEventListener('load', () => {
                    console.log('Urumi: Spline scene loaded successfully');
                });
                
                splineViewer.addEventListener('error', (e) => {
                    console.log('Urumi: Spline failed to load, removing element');
                    splineViewer.remove();
                });
            });
        }
    });
    </script>
    
    <style>
    /* Ensure hero content stays visible on top */
    .wp-block-cover__inner-container {
        position: relative !important;
        z-index: 9 !important;
    }
    
    /* Preserve video/image positioning above Spline */
    .wp-block-cover__background video,
    .wp-block-cover__background img {
        position: relative !important;
        z-index: 5 !important;
    }
    
    
    /* Hide Spline on mobile devices for better performance */
    @media (max-width: 320px) {
        .urumi-background-spline {
            display: none !important;
        }
    }
    
    /* Show Spline only on desktop and tablet */
     @media (min-width: 321px) {
        .urumi-background-spline {
            display: block !important;
        }
    }
    </style>
    <?php
}
add_action('wp_head', 'urumi_spline_background_integration', 5);

// ========================================
// GLASS EFFECT STICKY NAVIGATION
// ========================================

/**
 * Add Glass Effect Sticky Navigation CSS
 */
function urumi_add_glass_nav_css() {
    $css = "
    /* Glass Effect Base Styles */
    .header-parent-div, .header-main-div {
        transition: all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
        position: relative;
        z-index: 1000;
    }

    /* Initial Glass Effect */
    .header-parent-div {
        background: rgba(0, 0, 0, 0.1) !important;
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }

    /* Enhanced Glass Effect on Scroll */
    .header-parent-div.scrolled,
    .header-main-div.is-sticky .header-parent-div {
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        right: 0 !important;
        background: rgba(0, 0, 0, 0.25) !important;
        backdrop-filter: blur(24px);
        -webkit-backdrop-filter: blur(24px);
        border-bottom: 1px solid rgba(255, 255, 255, 0.15);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.37);
        animation: slideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        z-index: 9999;
    }

    /* More intense blur on heavy scroll */
    .header-parent-div.heavy-scroll {
        background: rgba(0, 0, 0, 0.35) !important;
        backdrop-filter: blur(30px);
        -webkit-backdrop-filter: blur(30px);
        border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5);
    }

    /* Smooth slide-down animation */
    @keyframes slideDown {
        from {
            transform: translateY(-100%);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }

    /* Ensure content doesn't jump when header becomes fixed */
    body.sticky-nav-active {
        padding-top: 80px;
    }

    /* Mobile adjustments */
    @media (max-width: 768px) {
        body.sticky-nav-active {
            padding-top: 60px;
        }
    }
    ";
    
    wp_add_inline_style('wp-block-navigation', $css);
}
add_action('wp_enqueue_scripts', 'urumi_add_glass_nav_css');
add_action('enqueue_block_assets', 'urumi_add_glass_nav_css');

/**
 * Add Glass Navigation JavaScript
 */
function urumi_add_glass_nav_script() {
    ?>
    <script>
    document.addEventListener('DOMContentLoaded', function() {
        const header = document.querySelector('.header-parent-div');
        const body = document.body;
        
        if (!header) return;
        
        let scrollTimeout;
        let lastScrollY = 0;
        let scrollVelocity = 0;
        
        // Throttled scroll handler for better performance
        function handleScroll() {
            const currentScrollY = window.scrollY;
            scrollVelocity = Math.abs(currentScrollY - lastScrollY);
            lastScrollY = currentScrollY;
            
            // Add/remove classes based on scroll position
            if (currentScrollY > 50) {
                header.classList.add('scrolled');
                body.classList.add('sticky-nav-active');
                
                // Add heavy-scroll class for more intense blur
                if (scrollVelocity > 5 || currentScrollY > 200) {
                    header.classList.add('heavy-scroll');
                }
            } else {
                header.classList.remove('scrolled', 'heavy-scroll');
                body.classList.remove('sticky-nav-active');
            }
            
            // Clear heavy-scroll after scroll stops
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                header.classList.remove('heavy-scroll');
            }, 150);
        }
        
        // Use requestAnimationFrame for smooth scroll handling
        let ticking = false;
        function requestTick() {
            if (!ticking) {
                requestAnimationFrame(() => {
                    handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        }
        
        // Attach scroll listener
        window.addEventListener('scroll', requestTick, { passive: true });
        
        // Handle resize to recalculate header height
        window.addEventListener('resize', () => {
            if (header.classList.contains('scrolled')) {
                body.style.paddingTop = header.offsetHeight + 'px';
            }
        });
        
        console.log('Urumi: Glass effect sticky navigation initialized');
    });
    </script>
    <?php
}
add_action('wp_footer', 'urumi_add_glass_nav_script');

/**
 * Add black background to wp-site-blocks
 */
function urumi_add_site_blocks_bg() {
    $css = "
    .wp-site-blocks {
        background-color: #000000 !important;
    }
    ";
    
    wp_add_inline_style('wp-block-navigation', $css);
}
add_action('wp_enqueue_scripts', 'urumi_add_site_blocks_bg');
add_action('enqueue_block_assets', 'urumi_add_site_blocks_bg');

/**
 * Add background color to wp-block-template-part
 */
function urumi_add_template_part_bg() {
    $css = "
    .wp-block-template-part {
        background-color: hsl(220 13% 9% / 0.6) !important;
    }
    ";
    
    wp_add_inline_style('wp-block-navigation', $css);
}
add_action('wp_enqueue_scripts', 'urumi_add_template_part_bg');
add_action('enqueue_block_assets', 'urumi_add_template_part_bg');




/**
 * Remove background color from has-custom-black-background-color class
 */
function urumi_remove_custom_black_bg() {
    $css = "
    .has-custom-black-background-color {
        background-color: transparent !important;
    }w
    ";
    
    wp_add_inline_style('wp-block-navigation', $css);
}
add_action('wp_enqueue_scripts', 'urumi_remove_custom_black_bg');
add_action('enqueue_block_assets', 'urumi_remove_custom_black_bg');

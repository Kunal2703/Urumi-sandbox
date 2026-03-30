<?php
/** Enqueue Styles for Urumi Theme */

function enqueue_urumi_style() {
    wp_enqueue_style( 
        'urumi-style', 
        get_template_directory_uri() . '/style.css', 
        [], 
        filemtime(get_template_directory() . '/style.css') 
    );
}
add_action( 'enqueue_block_assets', 'enqueue_urumi_style' );

/** Enqueue Scripts for Urumi Theme */
function enqueue_urumi_script() {
    wp_enqueue_script(
        'urumi-script',
        get_template_directory_uri() . '/script.js',
        [],
        filemtime(get_template_directory() . '/script.js')
    );

    // Enqueue TOC Generator for single posts
    if ( is_single() ) {
        wp_enqueue_script(
            'urumi-toc-generator',
            get_template_directory_uri() . '/toc-generator.js',
            [],
            filemtime(get_template_directory() . '/toc-generator.js'),
            true
        );
    }
}
add_action( 'enqueue_block_assets', 'enqueue_urumi_script' );

function urumi_enqueue_editor_assets() {
    // Gradient Text
    wp_enqueue_script(
        "urumi-gradient-text",
        get_template_directory_uri() . "/block-styles/gradient-text.js",
        ["wp-blocks", "wp-element", "wp-editor", "wp-rich-text"],
        filemtime(get_template_directory() . "/block-styles/gradient-text.js")
    );

    // Gradient Border
    wp_enqueue_script(
        "urumi-gradient-border",
        get_template_directory_uri() . "/block-styles/gradient-border.js",
        ["wp-blocks", "wp-dom-ready", "wp-edit-post"],
        filemtime(get_template_directory() . "/block-styles/gradient-border.js")
    );

    // Load CSS inside editor too
    wp_enqueue_style(
        "urumi-editor-styles",
        get_template_directory_uri() . "/style.css",
        [],
        filemtime(get_template_directory() . "/style.css")
    );
}
add_action("enqueue_block_editor_assets", "urumi_enqueue_editor_assets");

function wpexplorer_customize_admin_bar_menu( $admin_bar ) {
    if ( ! current_user_can( 'manage_options' ) ) {
        return;
    }

    $admin_bar->add_menu( [
        'id'     => 'custom-css-menu-item',
        'title'  => 'Style.CSS',
        'href'   => '/wp-admin/theme-editor.php?file=style.css&theme=urumi',
        'parent' => null,
    ] );

    $admin_bar->add_menu( [
        'id'     => 'custom-js-menu-item',
        'title'  => 'Script.JS',
        'href'   => '/wp-admin/theme-editor.php?file=script.js&theme=urumi',
        'parent' => null,
    ] );
	
	$admin_bar->add_menu( [
        'id'     => 'custom-header',
        'title'  => 'Edit-Header',
        'href'   => '/wp-admin/site-editor.php?p=%2Fwp_template_part%2Furumi%2F%2Fheader&canvas=edit',
        'parent' => null,
    ] );
	
	$admin_bar->add_menu( [
        'id'     => 'custom-footer',
        'title'  => 'Edit-Footer',
        'href'   => '/wp-admin/site-editor.php?p=%2Fwp_template_part%2Furumi%2F%2Ffooter&canvas=edit',
        'parent' => null,
    ] );
}
add_action( 'admin_bar_menu', 'wpexplorer_customize_admin_bar_menu', 1000 );


/** Enqueue Spline Viewer Script */
function enqueue_spline_viewer() {
    wp_enqueue_script( 
        "spline-viewer", 
        "https://unpkg.com/@splinetool/viewer@1.10.44/build/spline-viewer.js", 
        [], 
        "1.10.44",
        true
    );
    
    // Add module type to script tag
    add_filter("script_loader_tag", function($tag, $handle) {
        if ($handle === "spline-viewer") {
            return str_replace("<script", "<script type=\"module\"", $tag);
        }
        return $tag;
    }, 10, 2);
}
add_action( "wp_enqueue_scripts", "enqueue_spline_viewer" );


/** Enqueue Custom Spline Init Script */
function enqueue_spline_init() {
    wp_enqueue_script( 
        "spline-init", 
        get_template_directory_uri() . "/spline-init.js", 
        ["spline-viewer"], 
        "1.0.0",
        true
    );
}
add_action( "wp_enqueue_scripts", "enqueue_spline_init" );

/**
 * Redirect /blog to /blogs
 */
function urumi_blog_redirect() {
    if ( is_404() && $_SERVER['REQUEST_URI'] === '/blog' ) {
        wp_redirect( '/blogs/', 301 );
        exit;
    }
}
add_action( 'template_redirect', 'urumi_blog_redirect' );

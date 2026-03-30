<?php
/**
 * Plugin Name: Urumi Open Graph Tags & Schema
 * Plugin URI: https://urumi.ai
 * Description: Outputs Open Graph, Twitter Card meta tags, and JSON-LD Schema markup with breadcrumbs for social media and SEO
 * Version: 1.3.0
 * Author: Urumi.ai
 * Author URI: https://urumi.ai
 * License: GPL v2 or later
 * Text Domain: urumi-og-tags
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

class Urumi_OG_Tags {

    /**
     * Initialize the plugin
     */
    public function __construct() {
        add_action('wp_head', array($this, 'output_og_tags'), 5);
        add_action('wp_head', array($this, 'output_schema'), 10);
        add_action('add_meta_boxes', array($this, 'add_meta_box'));
        add_action('save_post', array($this, 'save_meta_box'));
    }

    /**
     * Add meta box to post/page editor
     */
    public function add_meta_box() {
        $screens = array('post', 'page');
        foreach ($screens as $screen) {
            add_meta_box(
                'urumi_og_tags',
                'Open Graph / Social Media Tags',
                array($this, 'render_meta_box'),
                $screen,
                'normal',
                'default'
            );
        }
    }

    /**
     * Render the meta box content
     */
    public function render_meta_box($post) {
        wp_nonce_field('urumi_og_tags_nonce', 'urumi_og_tags_nonce');

        $og_title = get_post_meta($post->ID, '_urumi_og_title', true);
        $og_description = get_post_meta($post->ID, '_urumi_og_description', true);
        $og_image = get_post_meta($post->ID, '_urumi_og_image', true);
        ?>
        <style>
            .urumi-og-field { margin-bottom: 15px; }
            .urumi-og-field label { display: block; font-weight: 600; margin-bottom: 5px; }
            .urumi-og-field input[type="text"],
            .urumi-og-field textarea { width: 100%; }
            .urumi-og-field small { display: block; color: #666; margin-top: 3px; }
        </style>

        <div class="urumi-og-field">
            <label for="urumi_og_title">Custom OG Title</label>
            <input type="text" id="urumi_og_title" name="urumi_og_title" value="<?php echo esc_attr($og_title); ?>" />
            <small>Leave blank to use post title. Recommended: 60-90 characters</small>
        </div>

        <div class="urumi-og-field">
            <label for="urumi_og_description">Custom OG Description</label>
            <textarea id="urumi_og_description" name="urumi_og_description" rows="3"><?php echo esc_textarea($og_description); ?></textarea>
            <small>Leave blank to use post excerpt. Recommended: 150-160 characters</small>
        </div>

        <div class="urumi-og-field">
            <label for="urumi_og_image">Custom OG Image URL</label>
            <input type="text" id="urumi_og_image" name="urumi_og_image" value="<?php echo esc_attr($og_image); ?>" />
            <small>Leave blank to use featured image. Recommended size: 1200x630px</small>
        </div>
        <?php
    }

    /**
     * Save meta box data
     */
    public function save_meta_box($post_id) {
        // Check nonce
        if (!isset($_POST['urumi_og_tags_nonce']) || !wp_verify_nonce($_POST['urumi_og_tags_nonce'], 'urumi_og_tags_nonce')) {
            return;
        }

        // Check autosave
        if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
            return;
        }

        // Check permissions
        if (!current_user_can('edit_post', $post_id)) {
            return;
        }

        // Save custom fields
        $fields = array('urumi_og_title', 'urumi_og_description', 'urumi_og_image');
        foreach ($fields as $field) {
            if (isset($_POST[$field])) {
                $value = sanitize_text_field($_POST[$field]);
                if ($field === 'urumi_og_description') {
                    $value = sanitize_textarea_field($_POST[$field]);
                }
                update_post_meta($post_id, '_' . $field, $value);
            }
        }
    }

    /**
     * Output Open Graph and Twitter Card tags
     */
    public function output_og_tags() {
        // Don't output in admin
        if (is_admin()) {
            return;
        }

        $og_data = $this->get_og_data();

        echo "\n<!-- Open Graph Tags by Urumi.ai -->\n";

        // Basic OG tags
        $this->output_tag('og:locale', get_locale());
        $this->output_tag('og:type', $og_data['type']);
        $this->output_tag('og:title', $og_data['title']);
        $this->output_tag('og:description', $og_data['description']);
        $this->output_tag('og:url', $og_data['url']);
        $this->output_tag('og:site_name', get_bloginfo('name'));

        // Image tags
        if (!empty($og_data['image'])) {
            $this->output_tag('og:image', $og_data['image']);

            if (!empty($og_data['image_width'])) {
                $this->output_tag('og:image:width', $og_data['image_width']);
            }
            if (!empty($og_data['image_height'])) {
                $this->output_tag('og:image:height', $og_data['image_height']);
            }
        }

        // Article-specific tags
        if ($og_data['type'] === 'article' && !empty($og_data['article'])) {
            if (!empty($og_data['article']['published_time'])) {
                $this->output_tag('article:published_time', $og_data['article']['published_time']);
            }
            if (!empty($og_data['article']['modified_time'])) {
                $this->output_tag('article:modified_time', $og_data['article']['modified_time']);
            }
            if (!empty($og_data['article']['author'])) {
                $this->output_tag('article:author', $og_data['article']['author']);
            }
            if (!empty($og_data['article']['section'])) {
                $this->output_tag('article:section', $og_data['article']['section']);
            }
            if (!empty($og_data['article']['tags'])) {
                foreach ($og_data['article']['tags'] as $tag) {
                    $this->output_tag('article:tag', $tag);
                }
            }
        }

        // Twitter Card tags
        $this->output_tag('twitter:card', 'summary_large_image', 'name');
        $this->output_tag('twitter:site', '@urumi_ai', 'name');
        $this->output_tag('twitter:title', $og_data['title'], 'name');
        $this->output_tag('twitter:description', $og_data['description'], 'name');

        if (!empty($og_data['image'])) {
            $this->output_tag('twitter:image', $og_data['image'], 'name');
        }

        echo "<!-- / Open Graph Tags -->\n\n";
    }

    /**
     * Output JSON-LD Schema markup
     */
    public function output_schema() {
        // Don't output in admin
        if (is_admin()) {
            return;
        }

        $schema = $this->get_schema_data();

        if (!empty($schema)) {
            echo "\n<!-- JSON-LD Schema by Urumi.ai -->\n";
            echo '<script type="application/ld+json">' . "\n";
            echo wp_json_encode($schema, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
            echo "\n" . '</script>' . "\n";
        }

        // Output breadcrumbs separately
        $breadcrumbs = $this->get_breadcrumb_schema();
        if (!empty($breadcrumbs)) {
            echo '<script type="application/ld+json">' . "\n";
            echo wp_json_encode($breadcrumbs, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
            echo "\n" . '</script>' . "\n";
        }

        echo "<!-- / JSON-LD Schema -->\n\n";
    }

    /**
     * Get Schema data based on current page context
     */
    private function get_schema_data() {
        global $post;

        $schema = array();

        // Homepage / Front Page - Organization Schema
        if (is_front_page() || is_home()) {
            $schema = array(
                '@context' => 'https://schema.org',
                '@type' => 'Organization',
                'name' => 'Urumi.AI',
                'url' => home_url('/'),
                'logo' => home_url('/wp-content/uploads/2025/08/demo-poster.webp'),
                'description' => get_bloginfo('description'),
                'sameAs' => array(
                    'https://twitter.com/urumi_ai'
                )
            );
        }
        // Single Post - Article Schema
        elseif (is_single()) {
            $author = get_the_author_meta('display_name');
            $categories = get_the_category();
            $tags = get_the_tags();

            $schema = array(
                '@context' => 'https://schema.org',
                '@type' => 'Article',
                'headline' => get_the_title(),
                'description' => $this->get_excerpt(),
                'datePublished' => get_the_date('c'),
                'dateModified' => get_the_modified_date('c'),
                'author' => array(
                    '@type' => 'Person',
                    'name' => $author,
                    'url' => get_author_posts_url(get_the_author_meta('ID'))
                ),
                'publisher' => array(
                    '@type' => 'Organization',
                    'name' => get_bloginfo('name'),
                    'logo' => array(
                        '@type' => 'ImageObject',
                        'url' => home_url('/wp-content/uploads/2025/08/demo-poster.webp')
                    )
                ),
                'mainEntityOfPage' => array(
                    '@type' => 'WebPage',
                    '@id' => get_permalink()
                )
            );

            // Add featured image if available
            if (has_post_thumbnail()) {
                $image = wp_get_attachment_image_src(get_post_thumbnail_id(), 'full');
                if ($image) {
                    $schema['image'] = array(
                        '@type' => 'ImageObject',
                        'url' => $image[0],
                        'width' => $image[1],
                        'height' => $image[2]
                    );
                }
            }

            // Add article section (category)
            if (!empty($categories)) {
                $schema['articleSection'] = $categories[0]->name;
            }

            // Add keywords (tags)
            if (!empty($tags)) {
                $keywords = array();
                foreach ($tags as $tag) {
                    $keywords[] = $tag->name;
                }
                $schema['keywords'] = implode(', ', $keywords);
            }
        }
        // Pages - WebPage Schema
        elseif (is_page()) {
            $schema = array(
                '@context' => 'https://schema.org',
                '@type' => 'WebPage',
                'name' => get_the_title(),
                'description' => $this->get_excerpt(),
                'url' => get_permalink(),
                'publisher' => array(
                    '@type' => 'Organization',
                    'name' => get_bloginfo('name')
                )
            );

            // Add featured image if available
            if (has_post_thumbnail()) {
                $image = wp_get_attachment_image_src(get_post_thumbnail_id(), 'full');
                if ($image) {
                    $schema['image'] = array(
                        '@type' => 'ImageObject',
                        'url' => $image[0],
                        'width' => $image[1],
                        'height' => $image[2]
                    );
                }
            }
        }
        // Category/Archive - CollectionPage Schema
        elseif (is_category() || is_tag() || is_tax()) {
            $term = get_queried_object();
            $schema = array(
                '@context' => 'https://schema.org',
                '@type' => 'CollectionPage',
                'name' => $term->name,
                'description' => $term->description ?: 'Browse our ' . $term->name . ' collection',
                'url' => get_term_link($term)
            );
        }

        return $schema;
    }

    /**
     * Get Breadcrumb Schema
     */
    private function get_breadcrumb_schema() {
        global $post;

        // Don't show breadcrumbs on homepage
        if (is_front_page()) {
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

        // Blog Posts - Home > Blog > Category > Post
        if (is_single() && !is_attachment()) {
            // Add Blog link
            $blog_page_id = get_option('page_for_posts');
            if ($blog_page_id) {
                $items[] = array(
                    '@type' => 'ListItem',
                    'position' => $position++,
                    'name' => get_the_title($blog_page_id),
                    'item' => get_permalink($blog_page_id)
                );
            } else {
                $items[] = array(
                    '@type' => 'ListItem',
                    'position' => $position++,
                    'name' => 'Blog',
                    'item' => home_url('/blog/')
                );
            }

            // Add all categories in hierarchy
            $categories = get_the_category();
            if (!empty($categories)) {
                // Get primary category (first one)
                $category = $categories[0];

                // Build category hierarchy (parent categories first)
                $category_hierarchy = array();
                $current_cat = $category;

                while ($current_cat) {
                    array_unshift($category_hierarchy, $current_cat);
                    $current_cat = $current_cat->parent ? get_category($current_cat->parent) : null;
                }

                // Add each category to breadcrumb
                foreach ($category_hierarchy as $cat) {
                    $items[] = array(
                        '@type' => 'ListItem',
                        'position' => $position++,
                        'name' => $cat->name,
                        'item' => get_category_link($cat->term_id)
                    );
                }
            }

            // Add current post (without link, it's the current page)
            $items[] = array(
                '@type' => 'ListItem',
                'position' => $position++,
                'name' => get_the_title()
            );
        }
        // Pages
        elseif (is_page() && !is_front_page()) {
            $page_id = get_queried_object_id();

            // Build parent page hierarchy
            if ($page_id) {
                $parent_ids = get_post_ancestors($page_id);
                if (!empty($parent_ids)) {
                    $parent_ids = array_reverse($parent_ids);
                    foreach ($parent_ids as $parent_id) {
                        $items[] = array(
                            '@type' => 'ListItem',
                            'position' => $position++,
                            'name' => get_the_title($parent_id),
                            'item' => get_permalink($parent_id)
                        );
                    }
                }
            }

            // Add current page
            $items[] = array(
                '@type' => 'ListItem',
                'position' => $position++,
                'name' => get_the_title()
            );
        }
        // Category Archives - Home > Blog > Category
        elseif (is_category()) {
            // Add Blog link
            $blog_page_id = get_option('page_for_posts');
            if ($blog_page_id) {
                $items[] = array(
                    '@type' => 'ListItem',
                    'position' => $position++,
                    'name' => get_the_title($blog_page_id),
                    'item' => get_permalink($blog_page_id)
                );
            } else {
                $items[] = array(
                    '@type' => 'ListItem',
                    'position' => $position++,
                    'name' => 'Blog',
                    'item' => home_url('/blog/')
                );
            }

            // Add category hierarchy
            $category = get_queried_object();
            $category_hierarchy = array();
            $current_cat = $category;

            while ($current_cat) {
                array_unshift($category_hierarchy, $current_cat);
                $current_cat = $current_cat->parent ? get_category($current_cat->parent) : null;
            }

            foreach ($category_hierarchy as $cat) {
                $is_last = ($cat->term_id === $category->term_id);
                $item = array(
                    '@type' => 'ListItem',
                    'position' => $position++,
                    'name' => $cat->name
                );

                if (!$is_last) {
                    $item['item'] = get_category_link($cat->term_id);
                }

                $items[] = $item;
            }
        }
        // Tag Archives - Home > Blog > Tag
        elseif (is_tag()) {
            $blog_page_id = get_option('page_for_posts');
            if ($blog_page_id) {
                $items[] = array(
                    '@type' => 'ListItem',
                    'position' => $position++,
                    'name' => get_the_title($blog_page_id),
                    'item' => get_permalink($blog_page_id)
                );
            } else {
                $items[] = array(
                    '@type' => 'ListItem',
                    'position' => $position++,
                    'name' => 'Blog',
                    'item' => home_url('/blog/')
                );
            }

            $tag = get_queried_object();
            $items[] = array(
                '@type' => 'ListItem',
                'position' => $position++,
                'name' => $tag->name
            );
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
     * Get OG data based on current page context
     */
    private function get_og_data() {
        global $post;

        $data = array(
            'type' => 'website',
            'title' => '',
            'description' => '',
            'url' => '',
            'image' => '',
            'image_width' => '',
            'image_height' => '',
        );

        // Homepage / Front Page
        if (is_front_page() || is_home()) {
            $data['title'] = 'Urumi.AI - Agentic AI for WooCommerce';
            $data['description'] = "Transform your online store with Urumi.AI's agentic AI platform. Automate operations, personalize customer experiences, and scale your eCommerce business effortlessly. Start selling smarter today.";
            $data['url'] = home_url('/');
            $data['image'] = home_url('/wp-content/uploads/2025/08/demo-poster.webp');
            $data['image_width'] = '1241';
            $data['image_height'] = '621';
        }
        // Single Product (WooCommerce)
        elseif (function_exists('is_product') && is_product()) {
            $product = wc_get_product(get_the_ID());
            $data['type'] = 'product';
            $data['title'] = get_the_title();
            $data['description'] = wp_strip_all_tags($product->get_short_description() ?: $product->get_description());
            $data['description'] = wp_trim_words($data['description'], 30);
            $data['url'] = get_permalink();

            // Get product image
            $image_id = $product->get_image_id();
            if ($image_id) {
                $image = wp_get_attachment_image_src($image_id, 'full');
                if ($image) {
                    $data['image'] = $image[0];
                    $data['image_width'] = $image[1];
                    $data['image_height'] = $image[2];
                }
            }
        }
        // Single Post
        elseif (is_single()) {
            $data['type'] = 'article';

            // Check for custom field overrides
            $custom_title = get_post_meta(get_the_ID(), '_urumi_og_title', true);
            $custom_description = get_post_meta(get_the_ID(), '_urumi_og_description', true);
            $custom_image = get_post_meta(get_the_ID(), '_urumi_og_image', true);

            $data['title'] = !empty($custom_title) ? $custom_title : get_the_title();
            $data['description'] = !empty($custom_description) ? $custom_description : $this->get_excerpt();
            $data['url'] = get_permalink();

            // Article metadata
            $data['article'] = array(
                'published_time' => get_the_date('c'),
                'modified_time' => get_the_modified_date('c'),
                'author' => get_author_posts_url(get_the_author_meta('ID')),
                'section' => '',
                'tags' => array(),
            );

            // Get primary category
            $categories = get_the_category();
            if (!empty($categories)) {
                $data['article']['section'] = $categories[0]->name;
            }

            // Get post tags
            $tags = get_the_tags();
            if (!empty($tags)) {
                foreach ($tags as $tag) {
                    $data['article']['tags'][] = $tag->name;
                }
            }

            // Get featured image or custom image
            if (!empty($custom_image)) {
                $data['image'] = $custom_image;
                // Try to get dimensions if it's a local image
                $image_id = attachment_url_to_postid($custom_image);
                if ($image_id) {
                    $image_meta = wp_get_attachment_image_src($image_id, 'full');
                    if ($image_meta) {
                        $data['image_width'] = $image_meta[1];
                        $data['image_height'] = $image_meta[2];
                    }
                }
            } elseif (has_post_thumbnail()) {
                $image = wp_get_attachment_image_src(get_post_thumbnail_id(), 'full');
                if ($image) {
                    $data['image'] = $image[0];
                    $data['image_width'] = $image[1];
                    $data['image_height'] = $image[2];
                }
            }
        }
        // Pages
        elseif (is_page()) {
            // Check for custom field overrides
            $custom_title = get_post_meta(get_the_ID(), '_urumi_og_title', true);
            $custom_description = get_post_meta(get_the_ID(), '_urumi_og_description', true);
            $custom_image = get_post_meta(get_the_ID(), '_urumi_og_image', true);

            $data['title'] = !empty($custom_title) ? $custom_title : get_the_title();
            $data['description'] = !empty($custom_description) ? $custom_description : $this->get_excerpt();
            $data['url'] = get_permalink();

            // Get featured image or custom image
            if (!empty($custom_image)) {
                $data['image'] = $custom_image;
                // Try to get dimensions if it's a local image
                $image_id = attachment_url_to_postid($custom_image);
                if ($image_id) {
                    $image_meta = wp_get_attachment_image_src($image_id, 'full');
                    if ($image_meta) {
                        $data['image_width'] = $image_meta[1];
                        $data['image_height'] = $image_meta[2];
                    }
                }
            } elseif (has_post_thumbnail()) {
                $image = wp_get_attachment_image_src(get_post_thumbnail_id(), 'full');
                if ($image) {
                    $data['image'] = $image[0];
                    $data['image_width'] = $image[1];
                    $data['image_height'] = $image[2];
                }
            }
        }
        // Category/Archive
        elseif (is_category() || is_tag() || is_tax()) {
            $term = get_queried_object();
            $data['title'] = $term->name . ' - ' . get_bloginfo('name');
            $data['description'] = $term->description ?: 'Browse our ' . $term->name . ' collection';
            $data['url'] = get_term_link($term);
        }
        // Fallback
        else {
            $data['title'] = get_bloginfo('name');
            $data['description'] = get_bloginfo('description');
            $data['url'] = home_url('/');
        }

        // Fallback image if none set
        if (empty($data['image'])) {
            $data['image'] = home_url('/wp-content/uploads/2025/08/demo-poster.webp');
            $data['image_width'] = '1241';
            $data['image_height'] = '621';
        }

        // Sanitize and escape
        $data['title'] = wp_strip_all_tags($data['title']);
        $data['description'] = wp_strip_all_tags($data['description']);

        return $data;
    }

    /**
     * Get excerpt for current post/page
     */
    private function get_excerpt() {
        global $post;

        if (!empty($post->post_excerpt)) {
            return wp_strip_all_tags($post->post_excerpt);
        }

        $excerpt = wp_strip_all_tags($post->post_content);
        return wp_trim_words($excerpt, 30);
    }

    /**
     * Output a meta tag
     */
    private function output_tag($property, $content, $attr = 'property') {
        if (empty($content)) {
            return;
        }

        $content = esc_attr($content);
        echo "\t<meta {$attr}=\"{$property}\" content=\"{$content}\" />\n";
    }
}

// Initialize the plugin
new Urumi_OG_Tags();

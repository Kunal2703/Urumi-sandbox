<?php
/**
 * Plugin Name: Urumi Related Posts Filter
 * Description: Excludes current post from related articles query
 * Version: 1.0.0
 * Author: Urumi.ai
 */

declare(strict_types=1);

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Exclude current post from related articles query
 */
function urumi_exclude_current_post_from_query($query_args, $block, $page) {
    // Only apply on single post pages
    if (!is_singular('post')) {
        return $query_args;
    }

    // Check if this is a related articles query (queryId = 1)
    if (isset($block->context['queryId']) && $block->context['queryId'] === 1) {
        $current_post_id = get_the_ID();

        // Add current post to exclude array
        if (!isset($query_args['post__not_in'])) {
            $query_args['post__not_in'] = [];
        }

        $query_args['post__not_in'][] = $current_post_id;
    }

    return $query_args;
}

add_filter('query_loop_block_query_vars', 'urumi_exclude_current_post_from_query', 10, 3);

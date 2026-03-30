<?php
/**
 * SSR Template - Individual Blog Post (/blog/{slug})
 *
 * Full semantic HTML for bots, crawlers, and AI answer engines (AEO).
 * Renders the complete blog post content including title, author, date, and body.
 *
 * ⚠️ PAIRED WITH: src/pages/BlogPost.jsx
 * When updating content structure, BOTH files must be kept in sync!
 *
 * @package React_WooCommerce_Headless
 * @author Urumi.ai
 */

$slug = $this->get_route_data('slug');
$post = React_SSR_Data::get_blog_post_by_slug($slug);

if ($post):
?>

<div class="ssr-section">
    <h1><?php echo wp_strip_all_tags($post['title']['rendered']); ?></h1>
    <p><small>By <?php echo esc_html($post['author']['name']); ?> | Published <?php echo esc_html(date('F j, Y', strtotime($post['date']))); ?><?php if ($post['date'] !== $post['modified']): ?> | Updated <?php echo esc_html(date('F j, Y', strtotime($post['modified']))); ?><?php endif; ?></small></p>
</div>

<?php if (!empty($post['featured_image'])): ?>
<div class="ssr-section">
    <img src="<?php echo esc_url($post['featured_image']); ?>" alt="<?php echo esc_attr(wp_strip_all_tags($post['title']['rendered'])); ?>" style="max-width:100%;height:auto;">
</div>
<?php endif; ?>

<div class="ssr-section">
    <?php echo wp_kses_post($post['content']['rendered']); ?>
</div>

<div class="ssr-section">
    <p><a href="<?php echo esc_url(home_url('/blog')); ?>">Back to Blog</a></p>
</div>

<!-- Team Credentials -->
<div class="ssr-section">
    <h2>Built by ex-WooCommerce core developers</h2>
    <p>We're ex-WooCommerce core developers and ex-Google/Meta engineers who've scaled systems handling millions of requests per minute. We built the parts of WooCommerce that matter in production: performance, payments, and reliability. That's why we can operate your store end-to-end, not just host it.</p>
    <ul>
        <li><strong>Naman Malhotra</strong> - <a href="https://www.linkedin.com/in/naman03malhotra" rel="noopener">LinkedIn</a></li>
        <li><strong>Vedanshu Jain</strong> - <a href="https://www.linkedin.com/in/vedanshuj/" rel="noopener">LinkedIn</a></li>
    </ul>
</div>

<!-- Footer Navigation -->
<div class="ssr-section">
    <h3>Product</h3>
    <ul>
        <li><a href="<?php echo esc_url(home_url('/urumi-for-woocommerce')); ?>">For WooCommerce</a></li>
        <li><a href="https://docs.urumi.ai/" rel="noopener">Docs</a></li>
        <li><a href="<?php echo esc_url(home_url('/blog')); ?>">Blog</a></li>
    </ul>

    <h3>Company</h3>
    <ul>
        <li><a href="<?php echo esc_url(home_url('/careers')); ?>">Careers</a></li>
    </ul>

    <h3>Case Studies</h3>
    <ul>
        <li><a href="<?php echo esc_url(home_url('/gruum-case-study')); ?>">Gruum</a></li>
    </ul>

    <p><a href="<?php echo esc_url(home_url('/privacy-policy-2')); ?>">Privacy Policy</a> | <a href="<?php echo esc_url(home_url('/terms-and-conditions')); ?>">Terms of Service</a></p>
    <p>&copy; <?php echo date('Y'); ?> Urumi. All Rights Reserved</p>
</div>

<!-- Last Updated (for LLMs) -->
<?php echo '<!-- Last updated: ' . date('F j, Y') . ' -->'; ?>

<?php else: ?>
<div class="ssr-section">
    <h1>Post Not Found</h1>
    <p>The blog post you're looking for could not be found.</p>
    <p><a href="<?php echo esc_url(home_url('/blog')); ?>">Browse all posts</a></p>
</div>
<?php endif; ?>

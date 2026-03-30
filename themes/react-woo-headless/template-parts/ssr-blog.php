<?php
/**
 * SSR Template - Blog Listing (/blog)
 *
 * Full semantic HTML for bots, crawlers, and AI answer engines (AEO).
 * Renders all blog posts with titles, excerpts, dates, and authors.
 *
 * ⚠️ PAIRED WITH: src/pages/Blog.jsx
 * When updating content structure, BOTH files must be kept in sync!
 *
 * @package React_WooCommerce_Headless
 * @author Urumi.ai
 */

$posts = React_SSR_Data::get_blog_posts();
?>

<div class="ssr-section">
    <h1>Urumi Blog</h1>
    <p>Deep dives into WooCommerce performance optimization, infrastructure scaling, and e-commerce best practices from the Urumi engineering team.</p>
</div>

<?php if (!empty($posts)): ?>
    <?php foreach ($posts as $post): ?>
    <div class="ssr-section">
        <h2><a href="<?php echo esc_url(home_url('/blog/' . $post['slug'])); ?>"><?php echo wp_strip_all_tags($post['title']['rendered']); ?></a></h2>
        <p><small>By <?php echo esc_html($post['author']['name']); ?> | <?php echo esc_html(date('F j, Y', strtotime($post['date']))); ?></small></p>
        <?php
        if (!empty($post['excerpt']['rendered'])) {
            echo '<p>' . wp_strip_all_tags($post['excerpt']['rendered']) . '</p>';
        } else {
            echo '<p>' . wp_trim_words(wp_strip_all_tags($post['content']['rendered']), 40) . '</p>';
        }
        ?>
    </div>
    <?php endforeach; ?>
<?php else: ?>
    <p>No blog posts found.</p>
<?php endif; ?>

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

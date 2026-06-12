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
    <h1>Scaling WooCommerce without compromise.</h1>
    <p>Deep dives into WooCommerce performance, infrastructure, and scaling insights from the Urumi team.</p>
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

<!-- Final CTA -->
<div class="ssr-section">
    <h2>Run your store on Urumi.</h2>
    <p>Production-ready today. Built for high-traffic WooCommerce stores where downtime moves revenue.</p>
    <p>
        <a href="<?php echo esc_url(home_url('/woocommerce')); ?>">See the WooCommerce platform</a>
        &nbsp;·&nbsp;
        <a href="<?php echo esc_url(home_url('/woocommerce')); ?>#demo-form-section">Talk to founders</a>
    </p>
    <p>Agent live · 99.99% uptime · shipping today.</p>
</div>

<!-- Team Credentials -->
<div class="ssr-section">
    <h2>Built by ex-Automattic WooCommerce core engineers</h2>
    <p>We built WooCommerce core at Automattic — the parts that matter in production: performance, payments, reliability. Earlier we were founding-era engineers at HackerRank (Y Combinator), where the team scaled the company from $2M to $30M ARR. That's why we can operate your store end-to-end, not just host it.</p>
    <ul>
        <li><strong>Naman Malhotra</strong> - <a href="https://www.linkedin.com/in/naman03malhotra" rel="noopener">LinkedIn</a></li>
        <li><strong>Vedanshu Jain</strong> - <a href="https://www.linkedin.com/in/vedanshuj/" rel="noopener">LinkedIn</a></li>
    </ul>
</div>

<!-- Footer Navigation -->
<div class="ssr-section">
    <h3>Product</h3>
    <ul>
        <li><a href="<?php echo esc_url(home_url('/woocommerce')); ?>">For WooCommerce</a></li>
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

<!-- Built by a dentist -->
<div class="ssr-section">
    <p class="faqcta-dentist-credit">
        <span class="faqcta-dentist-credit__tooth">🦷</span> Can you believe it? This page was built by a dentist using <a href="<?php echo esc_url( 'https://urumi.ai' ); ?>" class="faqcta-dentist-credit__link" rel="noopener noreferrer" target="_blank">urumi.ai</a>
    </p>
</div>

<!-- Last Updated (for LLMs) -->
<?php echo '<!-- Last updated: ' . date('F j, Y') . ' -->'; ?>

<?php
/**
 * SSR Template - Individual Blog Post (/blog/{slug})
 *
 * Full semantic HTML for bots, crawlers, and AI answer engines (AEO).
 * Renders the complete blog post content including title, author, date, and body.
 *
 * ⚠️ PAIRED WITH: src/pages/BlogPost.jsx + src/components/BlogPostTOC.jsx
 * When updating content structure, ALL files must be kept in sync!
 *
 * @package React_WooCommerce_Headless
 * @author Urumi.ai
 */

$slug = $this->get_route_data('slug');
$post = React_SSR_Data::get_blog_post_by_slug($slug);

if ($post):
?>

<div class="ssr-section">
    <p><a href="<?php echo esc_url(home_url('/blog')); ?>">← All articles</a></p>
    <p><small><?php echo esc_html(date('F j, Y', strtotime($post['date']))); ?><?php if ($post['date'] !== $post['modified']): ?> · Updated <?php echo esc_html(date('F j, Y', strtotime($post['modified']))); ?><?php endif; ?> · <?php echo esc_html($post['author']['name']); ?></small></p>
    <h1><?php echo wp_strip_all_tags($post['title']['rendered']); ?></h1>
    <?php if (!empty($post['excerpt']['rendered'])): ?>
    <p><?php echo wp_strip_all_tags($post['excerpt']['rendered']); ?></p>
    <?php endif; ?>
</div>

<?php if (!empty($post['featured_image'])): ?>
<div class="ssr-section">
    <img src="<?php echo esc_url($post['featured_image']); ?>" alt="<?php echo esc_attr(wp_strip_all_tags($post['title']['rendered'])); ?>" style="max-width:100%;height:auto;">
</div>
<?php endif; ?>

<?php
// Permit `id` attribute on headings — wp_kses_post allows it by default,
// but be explicit so a stricter kses config can't silently strip the
// anchors we just injected in React_SSR_Toc::process().
$toc = isset($post['toc']) && is_array($post['toc']) ? $post['toc'] : array();
$show_toc = count($toc) >= React_SSR_Toc::MIN_HEADINGS;
?>

<?php if ($show_toc): ?>
<nav class="ssr-toc" aria-label="Table of contents">
    <p class="ssr-toc-label"><strong>On this page</strong></p>
    <ol class="ssr-toc-list">
        <?php foreach ($toc as $item): ?>
        <li><a href="#<?php echo esc_attr($item['id']); ?>"><?php echo esc_html($item['text']); ?></a></li>
        <?php endforeach; ?>
    </ol>
</nav>
<?php endif; ?>

<div class="ssr-section">
    <?php echo wp_kses_post($post['content']['rendered']); ?>
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

<?php else: ?>
<div class="ssr-section">
    <h1>Post Not Found</h1>
    <p>The blog post you're looking for could not be found.</p>
    <p><a href="<?php echo esc_url(home_url('/blog')); ?>">Browse all posts</a></p>
</div>
<?php endif; ?>

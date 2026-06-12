<?php
/**
 * SSR Template - WordPress Page (case studies, policies, etc.)
 *
 * Full semantic HTML for bots, crawlers, and AI answer engines (AEO).
 * Renders the complete page content from WordPress.
 *
 * @package React_WooCommerce_Headless
 * @author Urumi.ai
 */

$slug = $this->get_route_data('slug');
$page = React_SSR_Data::get_page_by_slug($slug);

if ($page):
?>

<div class="ssr-section">
    <h1><?php echo wp_strip_all_tags($page['title']['rendered']); ?></h1>
    <p><small>Last updated: <?php echo esc_html(date('F j, Y', strtotime($page['modified']))); ?></small></p>
</div>

<div class="ssr-section">
    <?php echo wp_kses_post($page['content']['rendered']); ?>
</div>

<!-- Built by a dentist -->
<div class="ssr-section">
    <p class="faqcta-dentist-credit">
        <span class="faqcta-dentist-credit__tooth">🦷</span> Can you believe it? This page was built by a dentist using <a href="<?php echo esc_url( 'https://urumi.ai' ); ?>" class="faqcta-dentist-credit__link" rel="noopener noreferrer" target="_blank">urumi.ai</a>
    </p>
</div>

<?php else: ?>
<div class="ssr-section">
    <h1>Page Not Found</h1>
    <p>The page you are looking for could not be found.</p>
    <p><a href="<?php echo esc_url(home_url('/')); ?>">Return to homepage</a></p>
</div>
<?php endif; ?>

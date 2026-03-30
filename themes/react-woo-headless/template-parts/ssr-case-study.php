<?php
/**
 * SSR Template - Case Study (/gruum-case-study)
 *
 * Full semantic HTML for bots, crawlers, and AI answer engines (AEO).
 * Content mirrors the React CaseStudy.jsx component.
 *
 * ⚠️ PAIRED WITH: src/pages/CaseStudy.jsx
 * When updating content, BOTH files must be kept in sync!
 *
 * @package React_WooCommerce_Headless
 * @author Urumi.ai
 */

// Structured data schemas
echo React_SSR_Schema::website_schema();
echo React_SSR_Schema::organization_schema();

$case_study_schema = array(
    '@context' => 'https://schema.org',
    '@type' => 'Article',
    'headline' => "How Urumi increased grüum's user satisfaction rate by 294%",
    'author' => array(
        '@type' => 'Organization',
        'name' => 'Urumi'
    ),
    'publisher' => array(
        '@type' => 'Organization',
        'name' => 'Urumi',
        'url' => home_url()
    ),
    'description' => "Case study: How Urumi resolved grüum's WooCommerce performance issues, achieving 294% improvement in user satisfaction, cached response times from 4s to 0.3s, and eliminating checkout failures."
);
echo '<script type="application/ld+json">' . wp_json_encode($case_study_schema, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT) . '</script>';
?>

<!-- Case Study Header -->
<div class="ssr-section">
    <h1>How Urumi Increased grüum's User Satisfaction Rate by 294%</h1>
</div>

<!-- The Context -->
<div class="ssr-section">
    <h2>The Context</h2>
    <p>When Urumi engaged with <a href="https://gruum.com" rel="noopener">grüum.com</a>, the team wanted to resolve performance instability that was directly affecting customer experience. Cached LCP would climb to 5-7 seconds, and intermittent cold starts could take up to ~40 seconds.</p>
    <blockquote>
        <p>"I'm very happy with the results," says George, founder of grüum. "The biggest performance improvements we've seen from you guys."</p>
    </blockquote>
</div>

<!-- The Shift -->
<div class="ssr-section">
    <h2>The Shift</h2>
    <p>Urumi worked directly with George and the grüum team to identify root causes across caching, server configuration, and application hot paths. The focus was on fixing both the "everyday" slow paths and the unpredictable extremes that make a site feel unreliable.</p>
    <p>From this work, grüum saw a shift around:</p>
    <ul>
        <li>Cloudflare + caching misconfigurations were identified and fixed</li>
        <li>Performance hot paths were identified and fixed, with a patch provided to the WooCommerce Product Bundles team</li>
        <li>Server configuration was optimized so workers could use the available infra more effectively</li>
        <li>Latency-inducing N+1 query issues were fixed (traces went to almost 0 post-deploy)</li>
        <li>Cold starts caused by unoptimized PHP worker config were eliminated</li>
    </ul>
    <p>The grüum team immediately saw the difference. Cached requests went from <strong>4s to 0.3s</strong>. Uncached requests dropped from <strong>5.7s to 2.7s</strong>.</p>
</div>

<!-- The Outcomes -->
<div class="ssr-section">
    <h2>The Outcomes</h2>
    <p>After Urumi's changes were deployed, grüum's New Relic data showed <strong>~294% improvement</strong> in % satisfied users.</p>
    <p>The grüum team validated the improvements with stress tests mimicking real user journeys (browse, login, add to cart, order):</p>
    <ul>
        <li><strong>Average response time:</strong> 740ms with p95 at 3.03s</li>
        <li><strong>Stress testing:</strong> Avg 770.09ms, Median 314.14ms, P90 1620ms</li>
        <li><strong>Peak throughput:</strong> 358.49 req/s (uncached), p90 under ~2s at 300 VU</li>
    </ul>
    <p>They went from customers abandoning checkout due to timeouts to completing orders without friction.</p>
</div>

<!-- What's Next -->
<div class="ssr-section">
    <h2>What's Next</h2>
    <p>Our engagement with grüum is ongoing for further optimization to improve performance and stability. We also ran a GCP POC vs their current Hetzner setup, which brought P99 to <strong>&lt;900ms</strong> (uncached) and showed improvements like avg <strong>740ms → 378ms</strong> and p95 <strong>3.03s → 1.27s</strong>.</p>
    <blockquote>
        <p>"The results speak for themselves — I'm really happy we worked with Urumi," says George, founder of grüum.</p>
    </blockquote>
</div>

<!-- Key Metrics Summary -->
<div class="ssr-section">
    <h2>Key Results</h2>
    <ul>
        <li><strong>294%</strong> improvement in user satisfaction</li>
        <li><strong>4s → 0.3s</strong> cached response time</li>
        <li><strong>5.7s → 2.7s</strong> uncached response time</li>
        <li><strong>358 req/s</strong> peak throughput (uncached)</li>
        <li><strong>Checkout fixed</strong> — no more abandoned orders from timeouts</li>
    </ul>
    <p><a href="<?php echo esc_url(home_url('/urumi-for-woocommerce')); ?>">Learn more about Urumi for WooCommerce</a></p>
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

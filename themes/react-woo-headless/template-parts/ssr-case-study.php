<?php
/**
 * SSR Template — Case Study (/gruum-case-study)
 *
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * ⚠️ COPY-SYNC RULE — read before editing customer-facing copy
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * Numbers, quotes, taglines, product claims, and capability statements in
 * this SSR template must match what we say everywhere else they appear,
 * or the site contradicts itself across audiences. Every edit needs FOUR
 * sweeps:
 *
 *   1. THIS FILE — SSR HTML (what crawlers + no-JS visitors see)
 *   2. src/pages/CaseStudy.jsx — hydrated React app (what humans see)
 *   3. llms.txt (repo root) — AEO answer file (ChatGPT, Claude, Perplexity,
 *                              Google AI Overviews cite this verbatim)
 *   4. SEO/schema layer — inc/ssr-schema.php (JSON-LD: Organization,
 *      Service, Review, FAQPage, HowTo) + functions.php brand functions
 *      (urumi_brand_description, urumi_organization_schema, founder bios)
 *
 * Before editing a number or quote, grep the repo for it so you catch
 * every surface. PR #22 (req/day standardization) and PR #23 (llms.txt
 * follow-up) are reference precedents for what a four-surface sweep
 * looks like in practice.
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *
 * @package React_WooCommerce_Headless
 * @author Urumi.ai
 */
?>

<!-- Hero -->
<div class="ssr-section">
    <p>Case study · grüum</p>
    <h1>How Urumi increased grüum's user satisfaction by 294%.</h1>
    <p>Cached requests went 4s → 0.3s. Uncached 5.7s → 0.4s. The platform held 1.2M req/day in production. The team stopped losing checkouts to timeouts and started shipping through their busiest weeks without an incident. Here's how.</p>
    <p>
        <a href="<?php echo esc_url(home_url('/woocommerce')); ?>">See the WooCommerce platform</a>
        &nbsp;·&nbsp;
        <a href="<?php echo esc_url(home_url('/woocommerce')); ?>#demo-form-section">Talk to founders</a>
    </p>
</div>

<!-- Headline metrics -->
<div class="ssr-section">
    <h2>Headline numbers</h2>
    <ul>
        <li><strong>294%</strong> better user satisfaction</li>
        <li><strong>4s → 0.3s</strong> cached response time</li>
        <li><strong>5.7s → 0.4s</strong> uncached response time</li>
        <li><strong>1.2M req/day</strong> sustained production traffic</li>
    </ul>
</div>

<!-- Engagement timeline -->
<div class="ssr-section">
    <h2>Engagement timeline</h2>
    <ol>
        <li><strong>Week 0 — Discovery + audit.</strong> Founders walked grüum's store with George — traffic patterns, plugin stack, the cold starts. Written audit + fix plan delivered.</li>
        <li><strong>Week 1–2 — Cache + server config.</strong> Cloudflare misconfig fixed, server tuned, PHP worker config rebuilt. Cached responses dropped 4s → 0.3s.</li>
        <li><strong>Week 3–4 — Hot paths + N+1 fixes.</strong> Application hot paths optimised, N+1 queries eliminated, WooCommerce Product Bundles patch shipped. Uncached 5.7s → 0.4s.</li>
        <li><strong>Week 5+ — Migration + ongoing ops.</strong> Migrated to Urumi.ai infrastructure with zero downtime. P99 to &lt;900ms. Engagement ongoing.</li>
    </ol>
</div>

<!-- 01 / The context -->
<div class="ssr-section">
    <h2>The context</h2>
    <p>When Urumi engaged with <a href="https://gruum.com" rel="noopener">grüum.com</a>, the team wanted to resolve performance instability that was directly affecting customer experience. Cached LCP would climb to 5–7 seconds, and intermittent cold starts could take up to ~40 seconds.</p>
    <blockquote>
        <p>"I'm very happy with the results. The biggest performance improvements we've seen is from you guys."</p>
        <cite>George Lagonikas · Founder &amp; CTO, grüum</cite>
    </blockquote>
</div>

<!-- 02 / The shift -->
<div class="ssr-section">
    <h2>The shift</h2>
    <p><em>In plain English: their site got fast and stayed fast. The engineer's view of what we found and what we fixed is below.</em></p>
    <p>Urumi worked directly with George and the grüum team to identify root causes across caching, server configuration, and application hot paths. The focus was on fixing both the "everyday" slow paths and the unpredictable extremes that make a site feel unreliable.</p>
    <p>From this work, grüum saw a shift around:</p>
    <ul>
        <li>Cloudflare + caching misconfigurations were identified and fixed.</li>
        <li>Performance hot paths were identified and fixed; a patch was provided to the WooCommerce Product Bundles team.</li>
        <li>Server configuration was optimized so workers could use the available infra more effectively.</li>
        <li>Latency-inducing N+1 query issues were fixed (traces went to almost 0 post-deploy).</li>
        <li>Cold starts caused by unoptimized PHP worker config were eliminated.</li>
    </ul>
    <p>Cached requests went from <strong>4s to 0.3s</strong>. Uncached requests dropped from <strong>5.7s to 0.4s</strong>.</p>
</div>

<!-- 03 / The outcomes -->
<div class="ssr-section">
    <h2>The outcomes</h2>
    <p>After Urumi's changes were deployed, grüum's New Relic data showed <strong>~294% improvement</strong> in % satisfied users.</p>
    <p>The grüum team validated the improvements with stress tests mimicking real user journeys (browse → login → add to cart → order):</p>
    <ul>
        <li>Average response time: 740ms with p95 at 3.03s</li>
        <li>Stress testing: Avg 770.09ms, Median 314.14ms, P90 1620ms</li>
        <li>Sustained well beyond grüum's 1.2M req/day production load, with p90 under ~2s at 300 VU</li>
    </ul>
    <p>They went from customers abandoning checkout due to timeouts to completing orders without friction.</p>
</div>

<!-- 04 / For stores like yours -->
<div class="ssr-section">
    <h2>What this means for stores like yours.</h2>
    <p>grüum's numbers came from fixing the things that quietly slow every high-traffic WooCommerce store — misconfigured caching, N+1 database queries, untuned PHP workers, cold starts that the team only notices when checkout drops.</p>
    <p>The free audit starts with the same diagnostic. We look at your traffic patterns, your plugin stack, your custom code, and the exact moments your store slows down for customers. Within a week you have a written audit + fix plan — yours to share internally, whether or not we end up running your operations.</p>
    <blockquote>
        <p>"The results speak for themselves—I'm really happy we worked with Urumi."</p>
        <cite>George Lagonikas · Founder &amp; CTO, grüum</cite>
    </blockquote>
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

<!-- Built by a dentist -->
<div class="ssr-section">
    <p class="faqcta-dentist-credit">
        <span class="faqcta-dentist-credit__tooth">🦷</span> Can you believe it? This page was built by a dentist using <a href="<?php echo esc_url( 'https://urumi.ai' ); ?>" class="faqcta-dentist-credit__link" rel="noopener noreferrer" target="_blank">urumi.ai</a>
    </p>
</div>

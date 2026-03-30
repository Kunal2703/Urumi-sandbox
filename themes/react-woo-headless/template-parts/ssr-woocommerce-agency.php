<?php
/**
 * SSR Template - WooCommerce Agency Page (/woocommerce-agency-page)
 *
 * Full semantic HTML for bots, crawlers, and AI answer engines (AEO).
 * Matches the React components: AgencyHero, HorizontalSwipeSection,
 * PainpointFlipCards, and FaqCta.
 *
 * @package React_WooCommerce_Headless
 * @author Urumi.ai
 */

// Structured data schemas
echo React_SSR_Schema::website_schema();
echo React_SSR_Schema::organization_schema();

$service_schema = array(
    '@context' => 'https://schema.org/',
    '@type' => 'Service',
    'serviceType' => 'WooCommerce Agency Hosting',
    'provider' => array(
        '@type' => 'Organization',
        'name' => 'Urumi',
        'url' => home_url()
    ),
    'areaServed' => 'Worldwide',
    'description' => 'Enterprise WooCommerce hosting built by ex-WooCommerce Core and ex-Google/Meta engineers. Auto-scaling, 99.99% uptime, and managed operations.'
);
echo '<script type="application/ld+json">' . wp_json_encode($service_schema, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT) . '</script>';

$faq_items = array(
    array(
        'question' => 'How is Urumi different from regular WooCommerce hosting?',
        'answer' => "Most hosts just give you a server and wish you luck. Urumi is an agentic AI platform built specifically for WooCommerce — we handle performance tuning, deployment safety, and store monitoring so your team can focus on building, not firefighting."
    ),
    array(
        'question' => 'Will Urumi work with my existing plugins and custom code?',
        'answer' => "Absolutely. Urumi runs standard WordPress + WooCommerce under the hood. Your plugins, custom themes, and integrations all work — we just make everything faster and safer with AI-powered guardrails around every deploy."
    ),
    array(
        'question' => 'What happens if a deploy breaks something?',
        'answer' => "That's the beauty of Performance Guardrails. Every change is benchmarked before and after. If we detect a regression, you get alerted instantly with the exact cause — and one-click rollback is always available."
    ),
    array(
        'question' => 'Can agencies white-label or manage multiple stores?',
        'answer' => "Yes! Our agency dashboard lets you manage all your client stores from one place — monitor performance, push updates, and get AI insights across your entire portfolio. Your clients see your brand, not ours."
    ),
    array(
        'question' => 'How fast can we migrate an existing store?',
        'answer' => "Most migrations take under 24 hours. We handle the heavy lifting — database, media, DNS — and run a full performance audit on arrival so your store launches faster than it was before."
    )
);

// FAQ Schema
$faq_schema = array(
    '@context' => 'https://schema.org',
    '@type' => 'FAQPage',
    'mainEntity' => array()
);
foreach ($faq_items as $faq) {
    $faq_schema['mainEntity'][] = array(
        '@type' => 'Question',
        'name' => $faq['question'],
        'acceptedAnswer' => array(
            '@type' => 'Answer',
            'text' => $faq['answer']
        )
    );
}
echo '<script type="application/ld+json">' . wp_json_encode($faq_schema, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT) . '</script>';
?>

<!-- Hero Section -->
<div class="ssr-section">
    <h1>Built for your business. Handcrafted by the people who made WooCommerce.</h1>
    <p>Ex-WooCommerce Core + ex-Google/Meta engineers shipping higher-quality improvements faster.</p>
    <p><a href="<?php echo esc_url(home_url('/woocommerce-agency-page')); ?>#demo-form-section">Get Free Audit</a> | <a href="<?php echo esc_url(home_url('/gruum-case-study')); ?>">See grüum Case Study</a></p>
</div>

<!-- Key Results (Cloud metrics from rocket launch) -->
<div class="ssr-section">
    <h2>Proven Results</h2>
    <ul>
        <li><strong>+294%</strong> CSAT score increase (post-fix)</li>
        <li><strong>4s → 0.3s</strong> Cached requests</li>
        <li><strong>5.7s → 2.7s</strong> Uncached requests</li>
        <li><strong>Checkout fixed</strong> — No more failed orders</li>
    </ul>
</div>

<!-- Why Merchants Choose Us: Case Study -->
<div class="ssr-section">
    <h2>Why Merchants Choose Us</h2>

    <h3>Case Study: grüum</h3>
    <p>grüum migrated to Urumi and saw immediate improvements in speed, reliability, and revenue performance.</p>
    <ul>
        <li><strong>3x</strong> Faster page loads</li>
        <li><strong>99.99%</strong> Uptime achieved</li>
        <li><strong>+30%</strong> Conversion lift</li>
    </ul>
    <p><a href="<?php echo esc_url(home_url('/gruum-case-study')); ?>">Read the full grüum case study</a></p>
</div>

<!-- Testimonials -->
<div class="ssr-section">
    <h3>What Our Clients Say</h3>
    <blockquote>
        <p>The results speak for themselves — our store has never been faster or more reliable. The Urumi team understood WooCommerce at a level we hadn't seen before.</p>
    </blockquote>
    <p>— <strong>Sarah Chen</strong>, Head of E-commerce, grüum</p>

    <blockquote>
        <p>Moving to Urumi was the best decision we made. Page loads dropped dramatically and our conversion rate climbed steadily from day one.</p>
    </blockquote>
    <p>— <strong>James Morton</strong>, CTO, Wellness Co.</p>
</div>

<!-- Core Expertise -->
<div class="ssr-section">
    <h3>Our Team: Core-Level WooCommerce Expertise</h3>
    <p>Our engineers contribute to WooCommerce core. We don't just use the platform — we help build it. That means faster debugging, better architecture, and solutions others simply can't offer.</p>
    <ul>
        <li>WooCommerce Core</li>
        <li>Gutenberg Blocks</li>
        <li>REST API</li>
        <li>Performance</li>
        <li>HPOS</li>
    </ul>
</div>

<!-- Why Urumi — Painpoint vs Solution Cards -->
<div class="ssr-section">
    <h2>We're Not an Old-School Agency — So You Don't Get Old-School Problems</h2>

    <h3>Weeks of Waiting → Ship in Days, Not Weeks</h3>
    <p><strong>The problem:</strong> Traditional agencies run on bloated timelines — endless discovery phases, slow feedback loops, and "we'll get back to you next sprint." A simple storefront change can take weeks.</p>
    <p><strong>How Urumi solves it:</strong> Urumi's agentic AI platform automates the heavy lifting — code generation, testing, deployment. What used to take agencies weeks now ships in days with continuous delivery built in.</p>

    <h3>Substandard Quality → Enterprise-Grade Quality</h3>
    <p><strong>The problem:</strong> Outsourced dev teams, junior contractors, copy-paste templates. The result? A store that looks generic, breaks on mobile, and tanks your Core Web Vitals.</p>
    <p><strong>How Urumi solves it:</strong> Every Urumi build is performance-optimised from day one — sub-second load times, flawless mobile UX, and clean architecture. We deliver Google Cloud-backed infrastructure with p99 latency under 1 second.</p>

    <h3>Hidden Fees &amp; Vague Scopes → Transparent, Honest Pricing</h3>
    <p><strong>The problem:</strong> Agencies quote low, then pile on change requests, "out-of-scope" charges, and mysterious line items. You never know the real cost until the invoice lands.</p>
    <p><strong>How Urumi solves it:</strong> Urumi offers clear, upfront pricing — no hidden fees, no surprise invoices. You see exactly what you're paying for: infrastructure, support, and performance, all included from the start.</p>
</div>

<!-- FAQ Section -->
<div class="ssr-section">
    <h2>Got Questions? We've Got Answers</h2>
    <dl>
        <?php foreach ($faq_items as $faq): ?>
        <dt><?php echo esc_html($faq['question']); ?></dt>
        <dd><?php echo esc_html($faq['answer']); ?></dd>
        <?php endforeach; ?>
    </dl>
</div>

<!-- CTA -->
<div class="ssr-section">
    <h2>Let's Build It!</h2>
    <p>Book a free walkthrough with our founders.</p>
    <p><a href="<?php echo esc_url(home_url('/woocommerce-agency-page')); ?>#demo-form-section">Get Free Audit</a></p>
</div>

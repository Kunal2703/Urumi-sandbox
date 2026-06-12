<?php
/**
 * SSR Template - Vision / Homepage (/)
 *
 * Full semantic HTML for bots, crawlers, and AI answer engines (AEO).
 * React removes #ssr-content on load and renders the interactive version.
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
 *   2. src/pages/Vision.jsx — hydrated React app (what humans see)
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

// SoftwareApplication schema — describes the agentic Urumi platform itself
// (the *thing* being sold), distinct from the Service/Organization emitted in
// the head. featureList is the AEO payload that LLMs cite when asked
// "what does Urumi do?" / "what features does Urumi have?".
echo React_SSR_Schema::software_application_schema();

// Review schema for George Lagonikas (grüum CTO) testimonial — binds the
// quote, author, employer, and thing-reviewed (Urumi) into a citeable unit.
echo React_SSR_Schema::gruum_testimonial_review_schema();
?>

<!-- Hero Section -->
<div class="ssr-section">
    <h1>eCommerce, on autopilot.</h1>
    <p>The operations layer for modern commerce. We run performance, infrastructure, analytics, and the engineering work that used to require a team. Built by the people who built WooCommerce.</p>
    <p>
        <a href="<?php echo esc_url(home_url('/woocommerce')); ?>">See the WooCommerce platform</a> |
        <a href="<?php echo esc_url(home_url('/woocommerce')); ?>#demo-form-section">Talk to founders</a>
    </p>
    <p>
        <a href="<?php echo esc_url(home_url('/gruum-case-study')); ?>">grüum scaled 14× with Urumi</a>
    </p>
</div>

<!-- Section 2 — Already shipping (case-study teaser, editorial register) -->
<div class="ssr-section">
    <h2>When your store goes viral, our platform takes care of the scale.</h2>
    <p>How we kept grüum fast and shipping orders through their busiest weeks.</p>
    <blockquote>
        <p>“The biggest performance improvements we’ve seen is from you guys.”</p>
        <p><strong>George Lagonikas</strong>, Founder &amp; CTO, grüum</p>
    </blockquote>
    <p>−93% mobile load · 99.99% uptime · 0 incidents through peak weeks.</p>
    <p>
        <a href="<?php echo esc_url(home_url('/woocommerce')); ?>">See the WooCommerce platform</a>
        &nbsp;·&nbsp;
        <a href="<?php echo esc_url(home_url('/gruum-case-study')); ?>">Read the grüum case study</a>
    </p>
</div>

<!-- Three AIs running your store -->
<div class="ssr-section">
    <h2>Three AIs running your store.</h2>
    <p>Each one does one thing exceptionally well. They handle the dashboards, on-call shifts, and late-night escalations — so your team can focus on what only they can do.</p>

    <h3>01 / Builder AI — Build features in English.</h3>
    <p>Complex features in plain English. Describe what you want; Builder ships safe, tested code through your review pipeline.</p>
    <ul>
        <li>Plugins, themes, custom blocks, full features</li>
        <li>Tested across themes; staging + one-click rollback</li>
        <li>Ships through your existing review workflow</li>
    </ul>
    <p>Example: "Hey Urumi, please add the missing hero section, fetch and open-source the image."</p>

    <h3>02 / Revenue AI — Catch bugs that cost revenue.</h3>
    <p>Finds business-logic bugs and performance regressions that hit revenue before customers do. Recurring reports go to your team — never to a dashboard nobody reads.</p>
    <ul>
        <li>Detects regressions in checkout, cart, pricing, payments</li>
        <li>Recurring reports to email + Slack, prioritized by $ impact</li>
        <li>PRs surfaced with the fix, not just the alert</li>
    </ul>

    <h3>03 / Analytics AI — Ask your store anything.</h3>
    <p>Talk to your store in plain English. Generate charts your team can share — no SQL, no dashboards to build.</p>
    <ul>
        <li>Plain-English queries against live store, GA, Stripe</li>
        <li>Custom chart generation with one-click team share</li>
        <li>Anomaly explanations: "what changed last week?"</li>
    </ul>
    <p>Example: "Map my gross margins for the best-selling product."</p>
</div>

<!-- Bring-Your-Own AI via MCP -->
<div class="ssr-section">
    <h2>Bring your own AI — plug in Claude, ChatGPT, or Gemini.</h2>
    <p>Already paying for Claude, ChatGPT, or Gemini? Urumi speaks the <strong>Model Context Protocol (MCP)</strong> — connect your existing AI subscription to your store with one config. Your contract, your spend, our platform.</p>
    <ul>
        <li>Works with Claude, ChatGPT, Gemini, and any MCP-compatible client</li>
        <li>Zero AI markup — Urumi charges for the platform, not the model</li>
        <li>No vendor lock-in — switch AI providers without changing your store</li>
        <li>Your AI runs against the same store context the Three AIs use</li>
    </ul>
    <p>Example: ask Claude in your editor "what regressed in checkout this week?" — Claude calls Urumi's MCP server, reads APM traces, and answers with the offending PR.</p>
</div>

<!-- Our Vision (manifesto reframe) -->
<div class="ssr-section">
    <h2>Our vision</h2>
    <p>We believe stores should run themselves. These three AIs — plus the MCP layer that lets your own AI tap into them — are the start.</p>
</div>

<!-- Team Credentials -->
<div class="ssr-section">
    <h2>The Founders' Vision</h2>
    <p>We built WooCommerce core at Automattic — the parts that matter in production: performance, payments, reliability. Earlier we were founding-era engineers at HackerRank (Y Combinator), where the team scaled the company from $2M to $30M ARR. Together, we're using that experience to reimagine eCommerce from the ground up, making it effortless through AI. Our vision is simple: merchants should focus on their customers and growth, while intelligent systems handle everything else.</p>
    <ul>
        <li><strong>Naman Malhotra</strong> - <a href="https://www.linkedin.com/in/naman03malhotra" rel="noopener">LinkedIn</a></li>
        <li><strong>Vedanshu Jain</strong> - <a href="https://www.linkedin.com/in/vedanshuj/" rel="noopener">LinkedIn</a></li>
    </ul>
</div>

<!-- Final CTA — push to /woocommerce -->
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

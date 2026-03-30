<?php
/**
 * SSR Template - Urumi For WooCommerce (/urumi-for-woocommerce)
 *
 * Full semantic HTML for bots, crawlers, and AI answer engines (AEO).
 * Contains all page content in crawlable, readable form.
 * React removes #ssr-content on load and renders the interactive version.
 *
 * ⚠️ PAIRED WITH: src/pages/UrumiForWooCommerce.jsx
 * When updating content, BOTH files must be kept in sync!
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
    'serviceType' => 'Managed WooCommerce Hosting',
    'provider' => array(
        '@type' => 'Organization',
        'name' => 'Urumi',
        'url' => home_url()
    ),
    'areaServed' => 'Worldwide',
    'description' => 'Enterprise WooCommerce hosting with managed operations, performance monitoring, and viral-ready scaling'
);
echo '<script type="application/ld+json">' . wp_json_encode($service_schema, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT) . '</script>';

$faq_items = array(
    array(
        'question' => "How does Urumi's auto-scaling work for WooCommerce?",
        'answer' => "Urumi monitors your site's traffic in real-time and automatically scales server resources to match demand. Whether it's an expected spike like a flash sale or an unexpected surge from a viral moment, we scale horizontally to maintain fast page loads and stable checkout. This ensures your p99 latency stays under 1 second even during peak demand."
    ),
    array(
        'question' => 'What makes Urumi different from traditional WooCommerce hosting?',
        'answer' => 'Unlike traditional hosts that use fixed resources, Urumi provides enterprise-grade infrastructure with multi-zone redundancy, automatic failover, AI-powered performance monitoring, and staging environments with CI/CD pipelines. We also offer APM tracing to identify performance bottlenecks before they impact customers, plus rollback-ready deployments for safe releases.'
    ),
    array(
        'question' => 'Do you support HPOS (High-Performance Order Storage)?',
        'answer' => 'Yes! Urumi fully supports WooCommerce HPOS. Our infrastructure is optimized for the custom tables architecture, providing faster order processing and better database performance compared to legacy post-based storage.'
    ),
    array(
        'question' => 'How long does migration to Urumi take?',
        'answer' => 'Most WooCommerce migrations are completed within 24-48 hours. Our team handles the entire process including database migration, DNS updates, SSL setup, and performance optimization. We ensure zero downtime by coordinating the final cutover during your low-traffic period.'
    ),
    array(
        'question' => 'What kind of performance improvements can I expect?',
        'answer' => "Results vary by site, but customers typically see 50-300% improvements in page load times. For example, grüum saw cached response times drop from 4s to 0.3s and uncached from 5.7s to 2.7s, resulting in a 294% improvement in user satisfaction. We provide detailed APM traces so you can see exactly where the gains come from."
    ),
    array(
        'question' => 'Does Urumi include staging environments?',
        'answer' => 'Yes! Every Urumi plan includes a premium staging environment where you can test plugin updates, theme changes, and new features before deploying to production. We also support CI/CD pipelines for automated testing and deployment workflows.'
    ),
    array(
        'question' => 'How does the 99.99% uptime guarantee work?',
        'answer' => "Our infrastructure uses Google Cloud's multi-zone architecture with automatic failover. If one zone experiences issues, traffic automatically routes to healthy zones. We also maintain offsite backups and can restore your site within minutes. Our SLA guarantees 99.99% uptime with credits for any downtime beyond that threshold."
    ),
    array(
        'question' => 'Can Urumi help debug performance issues on my current host?',
        'answer' => "Absolutely! We offer free WooCommerce performance audits where we analyze your infrastructure, traffic patterns, and deployment workflow to identify critical performance and reliability risks. We'll show you exactly what's causing slowdowns and how to eliminate them—whether you migrate to Urumi or not."
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
    <h1>Enterprise WooCommerce hosting, that we guarantee never slows down</h1>
    <p>Not just hosting. We operate WooCommerce like a mission-critical system: scale for spikes, ship safely, and stay fast, stable, and reliable over time.</p>
    <p><a href="<?php echo esc_url(home_url('/urumi-for-woocommerce')); ?>#demo-form-section">Get a Free Audit</a> | <a href="<?php echo esc_url(home_url('/urumi-for-woocommerce')); ?>#demo-form-section">Demo with Founders</a></p>
</div>

<!-- Feature 1: Campaign Spikes -->
<div class="ssr-section">
    <h2>Horizontal Scaling</h2>
    <p><strong>Pain point: Campaign spikes.</strong> Campaign traffic is unpredictable. When spikes hit, pages slow down or fail, and you lose revenue at the worst time.</p>
    <p><strong>How Urumi solves it:</strong> Urumi enables autoscaling for spikes, keeping checkout stable and p99 under control during peak demand.</p>
</div>

<!-- Feature 2: Reliability -->
<div class="ssr-section">
    <h2>Google-Backed Uptime</h2>
    <p><strong>Pain point: Reliability.</strong> A single-zone setup turns outages into guesswork. When something breaks, recovery is slow and business impact is immediate.</p>
    <p><strong>How Urumi solves it:</strong> Urumi uses Google Cloud multi-zone infrastructure with automatic failover and offsite backups for reliable uptime and rapid recovery.</p>
</div>

<!-- Feature 3: Safe Shipping -->
<div class="ssr-section">
    <h2>Safe Releases</h2>
    <p><strong>Pain point: Safe shipping.</strong> Small plugin or theme updates can break production. Shipping feels risky, and rollbacks are slow when something goes wrong.</p>
    <p><strong>How Urumi solves it:</strong> Urumi enables staging + CI/CD with rollback-ready deploys, so changes ship confidently without production incidents.</p>
</div>

<!-- Feature 4: Performance Decay -->
<div class="ssr-section">
    <h2>Performance Guardrails</h2>
    <p><strong>Pain point: Performance decay over time.</strong> Stores get slower over time. After every change, it's hard to know what caused the regression or how to prevent it.</p>
    <p><strong>How Urumi solves it:</strong> AI-powered monitoring that catches performance issues before your customers do, automatically identifying the exact cause and preventing slowdowns.</p>
</div>

<!-- Benchmarks -->
<div class="ssr-section">
    <h2>Enterprise-Grade Performance, Proven</h2>
    <p>We stress-tested end-to-end shopping journeys (browse, login, add to cart, checkout) using the official WooCommerce k6 tests adapted for this store. Cloudflare cache was disabled to measure raw server performance.</p>
    <ul>
        <li><strong>236.22 ms</strong> — Cart median response time</li>
        <li><strong>321.23 ms</strong> — Checkout median response time</li>
        <li><strong>246.35 ms</strong> — My Account median response time</li>
        <li><strong>524 rps</strong> — Peak throughput (requests per second)</li>
    </ul>
    <p><strong>Load test result: 7,861 orders processed in less than 2 minutes.</strong></p>
</div>

<!-- Everything Included -->
<div class="ssr-section">
    <h2>Everything You Need, Included</h2>
    <p>Urumi is not just hosting. It's a complete enterprise operations bundle: scaling, security, observability, backups, safe releases, and support, operated end-to-end.</p>

    <h3>Reliability + Recovery</h3>
    <ul>
        <li>PITR + 30-day backups (file system + DB)</li>
        <li>Multi-zone infrastructure + failover tolerance</li>
    </ul>

    <h3>Performance + Observability</h3>
    <ul>
        <li>Datadog (APM + logs + alerts), fully managed</li>
        <li>Recurring performance improvements on performance hot paths</li>
    </ul>

    <h3>Scale + Edge</h3>
    <ul>
        <li>Cloudflare Enterprise (CDN + WAF), fully managed</li>
        <li>Horizontal autoscaling for campaigns and traffic spikes</li>
        <li>Unexpected traffic spikes included (no surprise compute bills)</li>
    </ul>

    <h3>Release Safety + Support</h3>
    <ul>
        <li>CI/CD + rollback-ready deploys + isolated staging</li>
        <li>24x7 incident escalation + dedicated support chat</li>
        <li>Founder hotline</li>
    </ul>
</div>

<!-- Competitor Comparison Section -->
<div class="ssr-section">
    <h2>Why Choose Urumi Over Traditional Hosts?</h2>
    <p>Most hosts sell compute. Urumi delivers managed WooCommerce operations, built by the team that created WooCommerce and scaled systems at Google and Meta.</p>

    <h3>Urumi vs Kinsta</h3>
    <h4>WooCommerce-Native vs General WordPress</h4>
    <p>Kinsta offers premium WordPress hosting, but performance tuning, cache configuration, and scaling are still on you. <strong>Urumi is built by ex-WooCommerce core developers</strong> who understand every query and bottleneck.</p>
    <ul>
        <li><strong>Scaling:</strong> Horizontal auto-scaling vs vertical resource limits</li>
        <li><strong>Performance:</strong> Continuous monitoring with APM vs manual tuning</li>
        <li><strong>Deploys:</strong> Staging + CI/CD with rollback vs manual deploys</li>
    </ul>

    <h3>Urumi vs SiteGround</h3>
    <h4>Enterprise Infrastructure vs Shared Hosting</h4>
    <p>SiteGround works for getting started, but growing stores quickly outgrow shared resources. <strong>Urumi delivers isolated containers, multi-zone redundancy, and auto-scaling</strong> from day one.</p>
    <ul>
        <li><strong>Infrastructure:</strong> Isolated containers on Google Cloud vs shared hosting</li>
        <li><strong>Reliability:</strong> 99.99% uptime with auto-failover vs single-zone hosting</li>
        <li><strong>Operations:</strong> Fully managed by ex-WooCommerce team vs self-managed via cPanel</li>
    </ul>

    <h3>Urumi vs Cloudways</h3>
    <h4>Managed Operations vs DIY Cloud</h4>
    <p>Cloudways gives you cloud flexibility but requires technical knowledge to configure, optimize, and maintain servers. <strong>Urumi handles the full operations stack</strong> so you can focus on your business.</p>
    <ul>
        <li><strong>Management:</strong> Complete managed operations vs manual server config</li>
        <li><strong>WooCommerce:</strong> Purpose-built for WooCommerce vs generic cloud hosting</li>
        <li><strong>Monitoring:</strong> APM traces + performance guardrails vs basic server metrics</li>
    </ul>

    <h3>Urumi vs WP Engine</h3>
    <h4>Purpose-Built eCommerce vs Legacy WordPress</h4>
    <p>WP Engine pioneered managed WordPress hosting, but their platform was designed for content sites, not high-traffic WooCommerce stores. <strong>Urumi is purpose-built for eCommerce</strong> with horizontal scaling and checkout stability.</p>
    <ul>
        <li><strong>Focus:</strong> Built for WooCommerce by its creators vs general WordPress</li>
        <li><strong>Peak Traffic:</strong> Auto-scaling keeps checkout stable vs fixed resource plans</li>
        <li><strong>Releases:</strong> Staging + rollback-ready deploys vs basic staging</li>
    </ul>

    <h3>The Urumi Difference</h3>

    <h4>Built by WooCommerce Core</h4>
    <p>Founded by engineers who built WooCommerce. We understand every query, hook, and bottleneck because we wrote them.</p>

    <h4>Google-Scale Infrastructure</h4>
    <p>Our team has operated systems handling millions of requests per minute at Google and Meta. Your store gets the same engineering rigor.</p>

    <h4>AI That Understands WooCommerce</h4>
    <p>Not a generic chatbot. An AI assistant built on deep WooCommerce knowledge that optimizes, monitors, and manages your store through simple conversations.</p>
</div>

<!-- Comparison Table -->
<div class="ssr-section">
    <h2>Why Urumi vs Typical Host or Agency</h2>
    <p>Urumi is a managed operations + performance team, not a host that sells compute.</p>
    <table>
        <thead>
            <tr>
                <th>Feature</th>
                <th>Typical Host</th>
                <th>Urumi</th>
            </tr>
        </thead>
        <tbody>
            <tr><td>Viral-ready scaling</td><td>Not available</td><td>Included</td></tr>
            <tr><td>Multi-zone reliability</td><td>Paid add-on</td><td>Included</td></tr>
            <tr><td>Staging + CI/CD</td><td>Paid add-on</td><td>Included</td></tr>
            <tr><td>Weekly performance audits</td><td>Not available</td><td>Included</td></tr>
            <tr><td>Root-cause performance fixes</td><td>Not available</td><td>Included</td></tr>
            <tr><td>Traffic spikes included</td><td>Paid add-on</td><td>Included</td></tr>
            <tr><td>Clear incident ownership</td><td>Not available</td><td>Included</td></tr>
            <tr><td>Datadog APM + monitoring</td><td>Paid add-on</td><td>Included</td></tr>
        </tbody>
    </table>
</div>

<!-- Testimonial -->
<div class="ssr-section">
    <h2>What Our Clients Say</h2>
    <blockquote>
        <p>I'm very happy with the results. The biggest performance improvements we've seen from you guys. The results speak for themselves—I'm really happy we worked with Urumi.</p>
    </blockquote>
    <p>— <strong>George Lagonikas</strong>, Founder &amp; CTO, <a href="https://gruum.com" rel="noopener">grüum</a></p>
    <ul>
        <li><strong>294%</strong> improvement in User Satisfaction</li>
        <li><strong>4s → 0.3s</strong> Cached Response time</li>
        <li><strong>5.7s → 2.7s</strong> Uncached Response time</li>
    </ul>
    <p><a href="<?php echo esc_url(home_url('/gruum-case-study')); ?>">Read the full case study</a></p>
</div>

<!-- Audit CTA -->
<div class="ssr-section">
    <h2>Get a Free WooCommerce Performance Audit</h2>
    <p>We'll analyze your infrastructure, traffic patterns, and deployment workflow to identify critical performance and reliability risks, then show you exactly how to eliminate them.</p>
    <p><a href="<?php echo esc_url(home_url('/urumi-for-woocommerce')); ?>#demo-form-section">Get Free Audit</a></p>
</div>

<!-- FAQ Section -->
<div class="ssr-section">
    <h2>Frequently Asked Questions</h2>
    <p>Everything you need to know about Urumi's WooCommerce hosting.</p>
    <dl>
        <?php foreach ($faq_items as $faq): ?>
        <dt><?php echo esc_html($faq['question']); ?></dt>
        <dd><?php echo esc_html($faq['answer']); ?></dd>
        <?php endforeach; ?>
    </dl>
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

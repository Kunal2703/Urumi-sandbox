<?php
/**
 * SSR Template - Vision / Homepage (/)
 *
 * Full semantic HTML for bots, crawlers, and AI answer engines (AEO).
 * React removes #ssr-content on load and renders the interactive version.
 *
 * ⚠️ PAIRED WITH: src/pages/Vision.jsx
 * When updating content, BOTH files must be kept in sync!
 *
 * @package React_WooCommerce_Headless
 * @author Urumi.ai
 */
?>

<!-- Hero Section -->
<div class="ssr-section">
    <h1>Introducing the First Agentic AI eCommerce Platform</h1>
    <p>eCommerce re-imagined and re-built for the AI era.</p>
    <p>
        <a href="<?php echo esc_url(home_url('/urumi-for-woocommerce')); ?>">For WooCommerce</a> |
        <a href="https://app.urumi.ai" rel="noopener">Sign In</a>
    </p>
</div>

<!-- Our Vision -->
<div class="ssr-section">
    <h2>Our Vision</h2>
    <p>We believe eCommerce should be effortless. Today, launching and growing an online store takes weeks of your time, requires coordinating dozens of agencies and freelancers, and costs thousands of dollars before you even make your first sale.</p>
    <p>This shouldn't be the reality. Merchants should focus on what matters: growing their business and executing their ideas. Our deeply integrated AI platform handles the rest: infrastructure, optimization, scaling, technical decisions, and all the complexity that currently holds merchants back.</p>
    <p>That's the future we're building. Effortless eCommerce where AI takes care of the technical burden, so you can focus entirely on your customers and growth.</p>
    <p><a href="<?php echo esc_url(home_url('/urumi-for-woocommerce')); ?>">Check out how we are transforming WooCommerce</a></p>
</div>

<!-- Why Now -->
<div class="ssr-section">
    <h2>Why Now?</h2>

    <h3>eCommerce is too complex</h3>
    <p>Building and running an online store requires juggling multiple agencies, freelancers, and platforms. Technical complexity takes time away from what matters: growing your business and serving your customers.</p>

    <h3>AI is finally ready</h3>
    <p>Breakthroughs in LLMs and autonomous agents mean AI can understand complex systems, make nuanced decisions, and act with minimal supervision. The technology to make eCommerce effortless finally exists.</p>

    <h3>Commerce platforms need evolution</h3>
    <p>Modern commerce platforms deserve more than just hosting. They need intelligent systems that understand your business, anticipate your needs, and handle the technical burden so merchants can focus on growth.</p>
</div>

<!-- What We're Building -->
<div class="ssr-section">
    <h2>What We're Building</h2>

    <h3>Today: Transforming WooCommerce</h3>
    <p>An intelligent platform that never slows down, combined with an AI Co-pilot that increases your team's efficiency. Create themes, build plugins, and make changes in minutes what used to take days.</p>

    <h3>Next: Shop Assistant Agent</h3>
    <p>The future of shopping is going to be: "I want badminton shoes delivered today." Urumi will help power natural search, making it effortless for customers to find exactly what they need.</p>

    <h3>Future: Marketing Copilot</h3>
    <p>Boost your creative team's productivity. Our system will tell you which kinds of ads are working and help create assets, turning marketing insights into action automatically.</p>
</div>

<!-- Team Credentials -->
<div class="ssr-section">
    <h2>The Founders' Vision</h2>
    <p>We're ex-WooCommerce core developers and ex-Google/Meta engineers who've scaled systems handling millions of requests per minute. Together, we're using that experience to reimagine eCommerce from the ground up, making it effortless through AI. Our vision is simple: merchants should focus on their customers and growth, while intelligent systems handle everything else.</p>
    <ul>
        <li><strong>Naman Malhotra</strong> - <a href="https://www.linkedin.com/in/naman03malhotra" rel="noopener">LinkedIn</a></li>
        <li><strong>Vedanshu Jain</strong> - <a href="https://www.linkedin.com/in/vedanshuj/" rel="noopener">LinkedIn</a></li>
    </ul>
</div>

<!-- CTA -->
<div class="ssr-section">
    <h2>Ready for Effortless eCommerce?</h2>
    <p>Join merchants who are tired of juggling agencies, fighting technical complexity, and wasting time on infrastructure. Focus on growing your business while our AI platform handles everything else.</p>
    <p>
        <a href="<?php echo esc_url(home_url('/urumi-for-woocommerce')); ?>">For WooCommerce</a> |
        <a href="<?php echo esc_url(home_url('/urumi-for-woocommerce')); ?>#demo-form-section">Demo with Founders</a>
    </p>
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

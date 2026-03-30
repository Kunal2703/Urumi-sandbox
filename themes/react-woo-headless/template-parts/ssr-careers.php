<?php
/**
 * SSR Template - Careers Page (/careers)
 *
 * Full semantic HTML for bots, crawlers, and AI answer engines (AEO).
 * Mirrors the React Careers.jsx component content.
 *
 * ⚠️ PAIRED WITH: src/pages/Careers.jsx
 * When updating content, BOTH files must be kept in sync!
 *
 * @package React_WooCommerce_Headless
 * @author Urumi.ai
 */

echo React_SSR_Schema::website_schema();
echo React_SSR_Schema::organization_schema();

$jobs_schema = array(
    '@context' => 'https://schema.org',
    '@type' => 'ItemList',
    'itemListElement' => array(
        array(
            '@type' => 'JobPosting',
            'title' => 'DevOps Engineer',
            'employmentType' => 'FULL_TIME',
            'jobLocation' => array('@type' => 'Place', 'address' => 'Goa, India'),
            'hiringOrganization' => array('@type' => 'Organization', 'name' => 'Urumi', 'sameAs' => home_url()),
            'description' => 'Build simple, robust infrastructure for WooCommerce hosting at scale. Kubernetes, Docker, CI/CD, monitoring, and on-call rotations.'
        ),
        array(
            '@type' => 'JobPosting',
            'title' => 'Generalist Engineer',
            'employmentType' => 'FULL_TIME',
            'jobLocation' => array('@type' => 'Place', 'address' => 'Goa, India'),
            'hiringOrganization' => array('@type' => 'Organization', 'name' => 'Urumi', 'sameAs' => home_url()),
            'description' => 'Full-stack generalist building AI agents with LangGraph, scaling Kubernetes infrastructure, and debugging performance bottlenecks across React, PHP, and databases.'
        ),
        array(
            '@type' => 'JobPosting',
            'title' => 'Generalist Designer',
            'employmentType' => 'FULL_TIME',
            'jobLocation' => array('@type' => 'Place', 'address' => 'Goa, India'),
            'hiringOrganization' => array('@type' => 'Organization', 'name' => 'Urumi', 'sameAs' => home_url()),
            'description' => 'Craft stunning landing pages, product experiences, and motion design for an AI-powered eCommerce platform.'
        ),
        array(
            '@type' => 'JobPosting',
            'title' => 'Sales & Outreach',
            'employmentType' => 'FULL_TIME',
            'jobLocation' => array('@type' => 'Place', 'address' => 'Goa, India'),
            'hiringOrganization' => array('@type' => 'Organization', 'name' => 'Urumi', 'sameAs' => home_url()),
            'description' => 'Close deals and own go-to-market strategy for enterprise WooCommerce infrastructure. Full sales cycle from prospecting to close.'
        )
    )
);
echo '<script type="application/ld+json">' . wp_json_encode($jobs_schema, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT) . '</script>';
?>

<!-- Hero -->
<div class="ssr-section">
    <h1>We're making eCommerce effortless. Want to build the future with us?</h1>
    <p>Join us in building AI-powered infrastructure that transforms how online stores operate.</p>
</div>

<!-- The Problem We're Solving -->
<div class="ssr-section">
    <h2>The Problem We're Solving</h2>
    <p>Today, running a WooCommerce store means juggling hosting providers, developers, agencies, and infrastructure firefighting. Merchants spend more time managing technical complexity than growing their business.</p>
    <p>We're changing that. Urumi uses AI to handle the entire technical burden — autoscaling, performance monitoring, safe deployments, and infrastructure management — so merchants can focus on what matters: their customers.</p>
    <p>This is just the beginning. We're building toward a future where AI agents handle everything from inventory optimization to customer support, making eCommerce truly effortless.</p>
</div>

<!-- What We're Building -->
<div class="ssr-section">
    <h2>What We're Building</h2>

    <h3>Today: Transforming WooCommerce</h3>
    <p>An intelligent platform that never slows down, combined with an AI Co-pilot that increases your team's efficiency. Create themes, build plugins, and make changes in minutes what used to take days.</p>
    <ul>
        <li>Autoscaling WooCommerce during traffic spikes</li>
        <li>Multi-zone reliability and failover</li>
        <li>AI-powered performance monitoring and insights</li>
        <li>Safe CI/CD deployments with rollback capabilities</li>
    </ul>

    <h3>Next: Shop Assistant Agent</h3>
    <p>The future of shopping: "I want badminton shoes delivered today." Urumi will help power natural search, making it effortless for customers to find exactly what they need.</p>
    <ul>
        <li>Natural language product search</li>
        <li>AI-powered recommendation engine</li>
        <li>Context-aware shopping assistants</li>
        <li>Real-time inventory and fulfillment optimization</li>
    </ul>

    <h3>Future: Marketing Copilot</h3>
    <p>Boost your creative team's productivity. Our system will tell you which kinds of ads are working and help create assets, turning marketing insights into action automatically.</p>
    <ul>
        <li>AI-generated marketing creative assets</li>
        <li>Performance analysis and attribution</li>
        <li>Automated campaign optimization</li>
        <li>Multi-channel marketing intelligence</li>
    </ul>
</div>

<!-- Open Positions -->
<div class="ssr-section">
    <h2>Where You'll Make Impact</h2>

    <h3>DevOps Engineer</h3>
    <p><strong>Full-time in Goa</strong></p>
    <p>We're looking for a DevOps engineer who believes in simple, robust solutions over complex architectures. You've been on-call, you know what breaks at 3 AM, and you build systems that don't wake you up. 3-5 years experience required.</p>
    <h4>What You'll Work On</h4>
    <ul>
        <li>Keep production systems stable and performant during traffic spikes</li>
        <li>Build monitoring and observability tooling that catches issues before customers notice</li>
        <li>Handle on-call rotations and incident response with calm precision</li>
        <li>Create simple, maintainable automation that just works</li>
        <li>Work with Kubernetes, Docker, CI/CD, and cloud infrastructure at scale</li>
    </ul>
    <h4>What We're Looking For</h4>
    <ul>
        <li>3-5 years of experience in DevOps, SRE, or infrastructure engineering</li>
        <li>Hands-on experience with on-call rotations and production incident response</li>
        <li>Strong knowledge of Kubernetes, Docker, and container orchestration</li>
        <li>Experience with CI/CD tools (GitHub Actions, GitLab CI, Jenkins, or similar)</li>
        <li>Comfortable with Linux systems, networking, and debugging at all levels</li>
        <li>Bonus: Experience with WooCommerce, WordPress, or e-commerce infrastructure</li>
        <li>Bonus: APM/observability tools (Grafana, Prometheus, OpenTelemetry)</li>
    </ul>
    <p><a href="https://dashboard.urumi.ai/s/naman">Apply Now</a></p>

    <h3>Generalist Engineer</h3>
    <p><strong>Full-time in Goa</strong></p>
    <p>We're looking for a true generalist who thrives on variety. One day you're building AI agents with LangGraph, the next you're optimizing Kubernetes deployments. No specialists needed — just problem-solvers who can tackle anything.</p>
    <h4>What You'll Work On</h4>
    <ul>
        <li>Build AI agents with LangGraph that automate merchant workflows</li>
        <li>Scale infrastructure with Kubernetes for Black Friday traffic spikes</li>
        <li>Debug performance bottlenecks from React to PHP to database queries</li>
        <li>Ship full-stack features — APIs, frontend, infrastructure, everything</li>
        <li>Work directly with merchants to solve their hardest technical problems</li>
    </ul>
    <h4>What We're Looking For</h4>
    <ul>
        <li>Comfortable context-switching between wildly different domains (AI, infrastructure, frontend, backend)</li>
        <li>Strong debugging skills — you can figure things out even when you've never seen the technology before</li>
        <li>Experience with at least 2-3 of: React, PHP, Python, Kubernetes, Docker, LangGraph/LangChain, databases</li>
        <li>Not afraid of production systems — you can ship confidently and fix things quickly when they break</li>
        <li>Clear written communication for technical discussions with team and customers</li>
        <li>Bonus: Experience with WooCommerce, WordPress, e-commerce platforms, or AI/LLM systems</li>
    </ul>
    <p><a href="https://dashboard.urumi.ai/s/naman">Apply Now</a></p>

    <h3>Generalist Designer</h3>
    <p><strong>Full-time in Goa</strong></p>
    <p>We're looking for a designer who can do it all — world-class landing pages, intuitive product design, and captivating motion work. If you get excited about pixel-perfect details and smooth animations, this is for you.</p>
    <h4>What You'll Work On</h4>
    <ul>
        <li>Design stunning landing pages that rival Apple and jitter.video in polish and impact</li>
        <li>Create product experiences that make complex infrastructure feel effortless</li>
        <li>Build motion designs and micro-interactions that bring the brand to life</li>
        <li>Design everything from marketing assets to in-app interfaces to customer presentations</li>
        <li>Work directly with founders to shape Urumi's visual identity and brand presence</li>
    </ul>
    <h4>What We're Looking For</h4>
    <ul>
        <li>Portfolio showcasing versatility — landing pages, product design, motion work, or brand design</li>
        <li>Proficiency in Figma (required) and motion tools like After Effects, Lottie, or similar</li>
        <li>Eye for detail and polish — you know when something feels off and how to fix it</li>
        <li>Comfortable working autonomously and shipping quickly without layers of approval</li>
        <li>Bonus: Basic front-end skills (HTML/CSS, React) or experience with no-code tools</li>
        <li>Bonus: Experience designing for SaaS, developer tools, or infrastructure products</li>
    </ul>
    <p><a href="https://dashboard.urumi.ai/s/naman">Apply Now</a></p>

    <h3>Sales &amp; Outreach</h3>
    <p><strong>Full-time in Goa</strong></p>
    <p>We're looking for someone hungry to close deals and grow revenue. You'll experiment with outreach strategies, build our pipeline, and work directly with founders to refine our GTM approach.</p>
    <h4>What You'll Work On</h4>
    <ul>
        <li>Find and close high-value merchants who need enterprise WooCommerce infrastructure</li>
        <li>Experiment with outreach campaigns — cold email, LinkedIn, partnerships, whatever works</li>
        <li>Brainstorm and test GTM strategies with the founders (messaging, positioning, channels)</li>
        <li>Build relationships with WooCommerce agencies, consultants, and ecosystem partners</li>
        <li>Own the full sales cycle from prospecting to close to onboarding</li>
    </ul>
    <h4>What We're Looking For</h4>
    <ul>
        <li>Proven track record of closing deals (B2B SaaS, infrastructure, or developer tools preferred)</li>
        <li>Hunger and hustle — you're motivated by hitting targets and growing revenue</li>
        <li>Strong written communication for cold outreach, proposals, and follow-ups</li>
        <li>Comfortable experimenting and iterating — you don't need a playbook, you build one</li>
        <li>Ability to talk technical with engineers and business with executives</li>
        <li>Bonus: Experience in WooCommerce, WordPress, e-commerce, or hosting/infrastructure sales</li>
    </ul>
    <p><a href="https://dashboard.urumi.ai/s/naman">Apply Now</a></p>
</div>

<!-- How We Work -->
<div class="ssr-section">
    <h2>How We Work</h2>
    <ul>
        <li><strong>Goa Office</strong> — Work full-time from our Goa office with the team. Build together, ship faster.</li>
        <li><strong>Customer-Focused</strong> — We work directly with merchants to solve real infrastructure problems.</li>
        <li><strong>Impact-Driven</strong> — Your work directly affects store uptime and merchant revenue.</li>
        <li><strong>Learning Culture</strong> — Tackle new challenges across the stack and grow your skills.</li>
    </ul>
</div>

<!-- Final CTA -->
<div class="ssr-section">
    <h2>Ready to build the future of eCommerce?</h2>
    <p>Join us in making eCommerce effortless.</p>
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

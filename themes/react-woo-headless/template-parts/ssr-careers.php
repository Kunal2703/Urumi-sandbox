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

// Shared fields for every JobPosting — Google Jobs requires datePosted,
// validThrough, employmentType, hiringOrganization (with logo), and a
// PostalAddress jobLocation (not a free-form string).
$job_date_posted = date('Y-m-d');
$job_valid_through = date('Y-m-d', strtotime('+90 days'));
$job_hiring_org = array(
    '@type' => 'Organization',
    'name' => function_exists('urumi_brand_name') ? urumi_brand_name() : 'Urumi',
    'sameAs' => home_url(),
    'logo' => function_exists('urumi_brand_logo') ? urumi_brand_logo() : get_template_directory_uri() . '/public/urumi-logo.png',
);
// Urumi locations:
//   - HQ:           San Francisco, USA
//   - Engineering:  Goa + Bangalore, India
//   - Support + Growth: remote across Europe
// Each JobPosting lists every physical-office Place as a valid jobLocation
// entry. Europe is expressed via applicantLocationRequirements (remote
// region, not a single city) since schema.org Place expects a city.
$job_location = array(
    array(
        '@type' => 'Place',
        'address' => array(
            '@type' => 'PostalAddress',
            'addressLocality' => 'San Francisco',
            'addressRegion' => 'CA',
            'addressCountry' => 'US'
        )
    ),
    array(
        '@type' => 'Place',
        'address' => array(
            '@type' => 'PostalAddress',
            'addressLocality' => 'Goa',
            'addressRegion' => 'GA',
            'addressCountry' => 'IN'
        )
    ),
    array(
        '@type' => 'Place',
        'address' => array(
            '@type' => 'PostalAddress',
            'addressLocality' => 'Bangalore',
            'addressRegion' => 'KA',
            'addressCountry' => 'IN'
        )
    ),
);

$job_definitions = array(
    array(
        'title' => 'Forward Deployed AI Engineer',
        'description' => 'Work directly with clients to build and deploy AI agents that execute their store operations—inventory, content, order routing, pricing. US timezone required.'
    ),
    array(
        'title' => 'DevOps Engineer',
        'description' => 'Build simple, robust infrastructure for WooCommerce hosting at scale. Kubernetes, Docker, CI/CD, monitoring, and on-call rotations.'
    ),
    array(
        'title' => 'Generalist Engineer',
        'description' => 'Full-stack generalist building AI agents with LangGraph, scaling Kubernetes infrastructure, and debugging performance bottlenecks across React, PHP, and databases.'
    ),
    array(
        'title' => 'Generalist Designer',
        'description' => 'Craft stunning landing pages, product experiences, and motion design for an AI-powered eCommerce platform.'
    ),
    array(
        'title' => 'Sales & Outreach',
        'description' => 'Close deals and own go-to-market strategy for enterprise WooCommerce infrastructure. Full sales cycle from prospecting to close.'
    )
);

$jobs_schema = array(
    '@context' => 'https://schema.org',
    '@type' => 'ItemList',
    'itemListElement' => array()
);
foreach ($job_definitions as $job) {
    $jobs_schema['itemListElement'][] = array(
        '@type' => 'JobPosting',
        'title' => $job['title'],
        'description' => $job['description'],
        'datePosted' => $job_date_posted,
        'validThrough' => $job_valid_through,
        'employmentType' => 'FULL_TIME',
        'hiringOrganization' => $job_hiring_org,
        'jobLocation' => $job_location,
        'applicantLocationRequirements' => array(
            array('@type' => 'Country', 'name' => 'United States'),
            array('@type' => 'Country', 'name' => 'India'),
            // Europe — support + growth team is distributed remotely
            // across the region, not tied to a single country.
            array('@type' => 'AdministrativeArea', 'name' => 'Europe'),
        ),
        'directApply' => false
    );
}
echo '<script type="application/ld+json">' . wp_json_encode($jobs_schema, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT) . '</script>';
?>

<!-- Hero -->
<div class="ssr-section">
    <h1>We're making eCommerce effortless. Want to build the future with us?</h1>
    <p>Join us in building AI-powered infrastructure that transforms how online stores operate.</p>
    <p>
        <a href="#careers-jobs">View open roles</a>
        &nbsp;·&nbsp;
        <a href="#careers-application">Apply now</a>
    </p>
</div>

<!-- 01 / The problem -->
<div class="ssr-section">
    <h2>The problem we're solving</h2>
    <p>Running a high-traffic WooCommerce store today means stitching together hosting, agencies, devs, and an on-call rotation — and still firefighting through every campaign and viral moment. Merchants end up doing operations work instead of merchant work.</p>
    <p>Urumi runs the operations layer of your store — scaling, reliability, releases, performance, and the on-call work that used to need a team. Built by the people who built WooCommerce. The platform's shipping today; grüum runs on it through their busiest weeks.</p>
    <p>Stores should run themselves. The four jobs the platform handles today are the start. The agents we're building next — Builder, Revenue, Analytics — are why we're hiring.</p>
</div>

<!-- 02 / What we're building -->
<div class="ssr-section">
    <h2>Today · Next · Future</h2>
    <p>Click each phase to see what we're working on and the challenges you'll help solve.</p>

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

<!-- 03 / Open roles -->
<div id="careers-jobs" class="ssr-section">
    <h2>Where you'll make impact</h2>

    <h3>Work with clients to build AI that runs their store <span style="font-size:0.7em;font-weight:600;text-transform:uppercase;letter-spacing:0.04em;color:#fff;background:#4f46e5;padding:0.15em 0.6em;border-radius:999px;">Actively hiring</span></h3>
    <p><strong>Forward Deployed AI Engineer · US timezone required · remote anywhere · Full-time</strong></p>
    <h4>What you'll work on</h4>
    <ul>
        <li>Work directly with merchants to understand their operations, then build AI agents that execute those workflows</li>
        <li>Ship AI-powered automation for real client work—inventory updates, content generation, order routing, pricing adjustments</li>
        <li>Run client engagements end-to-end: discover their pain points, prototype a solution, deploy it, and iterate until it runs autonomously</li>
        <li>Turn client-specific AI workflows into reusable platform capabilities that scale across every store</li>
        <li>Iterate rapidly on prompt engineering, tool orchestration, evaluation harnesses, and production hardening</li>
    </ul>
    <h4>About the role</h4>
    <p>You're the engineer who works directly with our clients and builds the AI that does their work. You'll sit with merchants, learn how their store actually operates, and ship agents that handle their day-to-day—so they can focus on growing their business instead of running it. Every client engagement makes the platform smarter for the next one.</p>
    <h4>Responsibilities</h4>
    <ul>
        <li>Own client AI engagements end-to-end—from discovery calls through production deployment</li>
        <li>Design, build, and deploy AI agents (LangGraph, tool-use, retrieval) that execute client workflows autonomously</li>
        <li>Translate client needs into technical specs and ship working solutions in days, not months</li>
        <li>Build evaluation harnesses so agent quality is measurable, not anecdotal</li>
        <li>Harden client-deployed agents for production—error handling, fallbacks, monitoring, and graceful degradation</li>
        <li>Feed learnings from client work back into the product to generalize capabilities across all merchants</li>
    </ul>
    <h4>What we're looking for</h4>
    <ul>
        <li>Strong Python or React—you can prototype fast and also write production-grade code</li>
        <li>Comfort with prompt engineering, RAG pipelines, tool-use patterns, and evaluation frameworks</li>
        <li>Strong client-facing skills—you can run a discovery call, demo a prototype, and explain tradeoffs to non-technical stakeholders</li>
        <li>Bias toward shipping—you'd rather deploy something imperfect and iterate than polish forever</li>
        <li>Bonus: Experience with WooCommerce, Shopify, or e-commerce operations</li>
        <li>Bonus: Experience building and shipping LLM-powered features or agents in production</li>
        <li>Bonus: Background in solutions engineering, consulting, or forward-deployed roles</li>
    </ul>
    <p><a href="https://docs.google.com/forms/d/e/1FAIpQLSdOYXltS-p4E_ygEL_3Kq4DrFdSU7UZz8QVfIqYP62oJuFDMg/viewform?usp=sharing" target="_blank" rel="noopener noreferrer">Apply Now</a></p>

    <h3>Build simple, robust infrastructure—no over-engineering</h3>
    <p><strong>DevOps Engineer · San Francisco · Goa · Bangalore · remote Europe · Full-time</strong></p>
    <h4>What you'll work on</h4>
    <ul>
        <li>Keep production systems stable and performant during traffic spikes</li>
        <li>Build monitoring and observability tooling that catches issues before customers notice</li>
        <li>Handle on-call rotations and incident response with calm precision</li>
        <li>Create simple, maintainable automation that just works</li>
        <li>Work with Kubernetes, Docker, CI/CD, and cloud infrastructure at scale</li>
    </ul>
    <h4>About the role</h4>
    <p>We're looking for a DevOps engineer who believes in simple, robust solutions over complex architectures. You've been on-call, you know what breaks at 3 AM, and you build systems that don't wake you up. 3-5 years experience required.</p>
    <h4>Responsibilities</h4>
    <ul>
        <li>Maintain and improve Kubernetes infrastructure for WooCommerce hosting at scale</li>
        <li>Build and maintain CI/CD pipelines for safe, automated deployments</li>
        <li>Implement monitoring, alerting, and observability across the stack</li>
        <li>Participate in on-call rotation and respond to production incidents</li>
        <li>Debug complex infrastructure issues—network configs, container orchestration, cloud services</li>
        <li>Optimize for reliability and simplicity, not complexity for its own sake</li>
    </ul>
    <h4>What we're looking for</h4>
    <ul>
        <li>3-5 years of experience in DevOps, SRE, or infrastructure engineering</li>
        <li>Hands-on experience with on-call rotations and production incident response</li>
        <li>Strong knowledge of Kubernetes, Docker, and container orchestration</li>
        <li>Experience with CI/CD tools (GitHub Actions, GitLab CI, Jenkins, or similar)</li>
        <li>Comfortable with Linux systems, networking, and debugging at all levels</li>
        <li>Philosophy: prefer boring, battle-tested solutions over shiny new tech</li>
        <li>Bonus: Experience with WooCommerce, WordPress, or e-commerce infrastructure</li>
        <li>Bonus: APM/observability tools (Grafana, Prometheus, OpenTelemetry)</li>
    </ul>
    <p><a href="https://docs.google.com/forms/d/e/1FAIpQLSdOYXltS-p4E_ygEL_3Kq4DrFdSU7UZz8QVfIqYP62oJuFDMg/viewform?usp=sharing" target="_blank" rel="noopener noreferrer">Apply Now</a></p>

    <h3>Take on anything—from LangGraph to Kubernetes</h3>
    <p><strong>Generalist Engineer · San Francisco · Goa · Bangalore · remote Europe · Full-time</strong></p>
    <h4>What you'll work on</h4>
    <ul>
        <li>Build AI agents with LangGraph that automate merchant workflows</li>
        <li>Scale infrastructure with Kubernetes for Black Friday traffic spikes</li>
        <li>Debug performance bottlenecks from React to PHP to database queries</li>
        <li>Ship full-stack features—APIs, frontend, infrastructure, everything</li>
        <li>Work directly with merchants to solve their hardest technical problems</li>
    </ul>
    <h4>About the role</h4>
    <p>We're looking for a true generalist who thrives on variety. One day you're building AI agents with LangGraph, the next you're optimizing Kubernetes deployments. No specialists needed—just problem-solvers who can tackle anything.</p>
    <h4>Responsibilities</h4>
    <ul>
        <li>Ship across the entire stack: LangGraph AI agents, React frontends, PHP backends, Kubernetes infrastructure</li>
        <li>Debug complex issues anywhere in the system—AI pipelines, database queries, network configs, you name it</li>
        <li>Build and maintain CI/CD workflows, deployment automation, and observability tooling</li>
        <li>Work directly with customers on technical implementations and troubleshooting</li>
        <li>Optimize WooCommerce stores for scale, reliability, and performance</li>
        <li>Jump between contexts quickly—AI/ML one moment, DevOps the next, customer support after that</li>
    </ul>
    <h4>What we're looking for</h4>
    <ul>
        <li>Comfortable context-switching between wildly different domains (AI, infrastructure, frontend, backend)</li>
        <li>Strong debugging skills—you can figure things out even when you've never seen the technology before</li>
        <li>Experience with at least 2-3 of: React, PHP, Python, Kubernetes, Docker, LangGraph/LangChain, databases</li>
        <li>Not afraid of production systems—you can ship confidently and fix things quickly when they break</li>
        <li>Clear written communication for technical discussions with team and customers</li>
        <li>Bonus: Experience with WooCommerce, WordPress, e-commerce platforms, or AI/LLM systems</li>
    </ul>
    <p><a href="https://docs.google.com/forms/d/e/1FAIpQLSdOYXltS-p4E_ygEL_3Kq4DrFdSU7UZz8QVfIqYP62oJuFDMg/viewform?usp=sharing" target="_blank" rel="noopener noreferrer">Apply Now</a></p>

    <h3>Craft experiences—from jitter.video-style landing pages to motion design</h3>
    <p><strong>Generalist Designer · San Francisco · Goa · Bangalore · remote Europe · Full-time</strong></p>
    <h4>What you'll work on</h4>
    <ul>
        <li>Design stunning landing pages that rival Apple and jitter.video in polish and impact</li>
        <li>Create product experiences that make complex infrastructure feel effortless</li>
        <li>Build motion designs and micro-interactions that bring the brand to life</li>
        <li>Design everything from marketing assets to in-app interfaces to customer presentations</li>
        <li>Work directly with founders to shape Urumi's visual identity and brand presence</li>
    </ul>
    <h4>About the role</h4>
    <p>We're looking for a designer who can do it all—world-class landing pages, intuitive product design, and captivating motion work. If you get excited about pixel-perfect details and smooth animations, this is for you.</p>
    <h4>Responsibilities</h4>
    <ul>
        <li>Design and ship landing pages, marketing sites, and campaign visuals that convert</li>
        <li>Create product UI/UX for dashboards, onboarding flows, and customer-facing tools</li>
        <li>Produce motion graphics, animations, and interactive elements for web and video</li>
        <li>Maintain and evolve the Urumi brand system—colors, typography, components, guidelines</li>
        <li>Collaborate with engineering to implement designs (bonus if you can code basic HTML/CSS/React)</li>
        <li>Jump between contexts: brand design one day, product mockups the next, video animations after that</li>
    </ul>
    <h4>What we're looking for</h4>
    <ul>
        <li>Portfolio showcasing versatility—landing pages, product design, motion work, or brand design</li>
        <li>Proficiency in Figma (required) and motion tools like After Effects, Lottie, or similar</li>
        <li>Eye for detail and polish—you know when something feels off and how to fix it</li>
        <li>Comfortable working autonomously and shipping quickly without layers of approval</li>
        <li>Bonus: Basic front-end skills (HTML/CSS, React) or experience with no-code tools</li>
        <li>Bonus: Experience designing for SaaS, developer tools, or infrastructure products</li>
    </ul>
    <p><a href="https://docs.google.com/forms/d/e/1FAIpQLSdOYXltS-p4E_ygEL_3Kq4DrFdSU7UZz8QVfIqYP62oJuFDMg/viewform?usp=sharing" target="_blank" rel="noopener noreferrer">Apply Now</a></p>

    <h3>Close deals and own our go-to-market strategy</h3>
    <p><strong>Sales &amp; Outreach · San Francisco · Goa · Bangalore · remote Europe · Full-time</strong></p>
    <h4>What you'll work on</h4>
    <ul>
        <li>Find and close high-value merchants who need enterprise WooCommerce infrastructure</li>
        <li>Experiment with outreach campaigns—cold email, LinkedIn, partnerships, whatever works</li>
        <li>Brainstorm and test GTM strategies with the founders (messaging, positioning, channels)</li>
        <li>Build relationships with WooCommerce agencies, consultants, and ecosystem partners</li>
        <li>Own the full sales cycle from prospecting to close to onboarding</li>
    </ul>
    <h4>About the role</h4>
    <p>We're looking for someone hungry to close deals and grow revenue. You'll experiment with outreach strategies, build our pipeline, and work directly with founders to refine our GTM approach. If you love the thrill of the close, this is for you.</p>
    <h4>Responsibilities</h4>
    <ul>
        <li>Prospect and qualify leads—research targets, craft personalized outreach, book discovery calls</li>
        <li>Run the full sales cycle: demos, proposals, negotiations, closing, and handoff to success</li>
        <li>Design and execute outreach campaigns across email, LinkedIn, events, and partnerships</li>
        <li>Collaborate with founders on GTM strategy—what messaging works, which channels convert, how to position Urumi</li>
        <li>Build relationships in the WooCommerce ecosystem (agencies, consultants, communities)</li>
        <li>Track metrics, analyze what's working, and iterate fast on campaigns and messaging</li>
    </ul>
    <h4>What we're looking for</h4>
    <ul>
        <li>Proven track record of closing deals (B2B SaaS, infrastructure, or developer tools preferred)</li>
        <li>Hunger and hustle—you're motivated by hitting targets and growing revenue</li>
        <li>Strong written communication for cold outreach, proposals, and follow-ups</li>
        <li>Comfortable experimenting and iterating—you don't need a playbook, you build one</li>
        <li>Ability to talk technical with engineers and business with executives</li>
        <li>Bonus: Experience in WooCommerce, WordPress, e-commerce, or hosting/infrastructure sales</li>
    </ul>
    <p><a href="https://docs.google.com/forms/d/e/1FAIpQLSdOYXltS-p4E_ygEL_3Kq4DrFdSU7UZz8QVfIqYP62oJuFDMg/viewform?usp=sharing" target="_blank" rel="noopener noreferrer">Apply Now</a></p>
</div>

<!-- 04 / How we work -->
<div class="ssr-section">
    <h2>How we work</h2>

    <h3>Distributed, one team</h3>
    <p>San Francisco HQ, engineering in Goa and Bangalore, support and growth across Europe — full-time, in person at the offices or remote across the EU.</p>

    <h3>Customer-Focused</h3>
    <p>We work directly with merchants to solve real infrastructure problems.</p>

    <h3>Impact-Driven</h3>
    <p>Your work directly affects store uptime and merchant revenue.</p>

    <h3>Learning Culture</h3>
    <p>Tackle new challenges across the stack and grow your skills.</p>
</div>

<!-- Final CTA -->
<div class="ssr-section">
    <h2>Ready to build the future of eCommerce?</h2>
    <p>Join us in making eCommerce effortless.</p>
    <p>
        <a href="#careers-jobs">View open roles</a>
        &nbsp;·&nbsp;
        <a href="#careers-application">Apply now</a>
    </p>
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

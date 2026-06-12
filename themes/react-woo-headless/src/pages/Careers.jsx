/**
 * Careers Page — `/careers`
 *
 * ⚠️ PAIRED WITH: template-parts/ssr-careers.php
 */

import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import FormCollapse from '../components/FormCollapse';
import TeamCredentials from '../components/TeamCredentials';
import DSReveal from '../design-system/components/DSReveal.jsx';
import DSFinalCTA from '../design-system/components/DSFinalCTA.jsx';
import { useSectionScroll } from '../design-system/hooks/useSectionScroll.js';
import '../styles/Careers.css';

function Careers() {
    const [expandedTimeline, setExpandedTimeline] = useState(null);
    const [expandedJob, setExpandedJob] = useState(null);
    const [isApplicationOpen, setIsApplicationOpen] = useState(false);

    /* Hero scroll choreography (mirrors Vision + WC + CaseStudy). */
    const heroRef = useRef(null);
    const heroProgress = useSectionScroll(heroRef, { offset: ['start start', 'end start'] });
    const heroTextY = useTransform(heroProgress, [0, 1], [0, -80]);

    /* Cursor-tracked spotlight in the hero (parity with the rest of the site). */
    const SPOT_SIZE = 700;
    const mouseX = useMotionValue(800);
    const mouseY = useMotionValue(280);
    const sx = useSpring(mouseX, { stiffness: 80, damping: 22, mass: 0.6 });
    const sy = useSpring(mouseY, { stiffness: 80, damping: 22, mass: 0.6 });
    const spotX = useTransform(sx, (v) => v - SPOT_SIZE / 2);
    const spotY = useTransform(sy, (v) => v - SPOT_SIZE / 2);
    const handleHeroMouseMove = (e) => {
        const rect = heroRef.current?.getBoundingClientRect();
        if (!rect) return;
        mouseX.set(e.clientX - rect.left);
        mouseY.set(e.clientY - rect.top);
    };

    useEffect(() => {
        document.title = 'Careers at Urumi — Build the future of eCommerce';
        const hash = window.location.hash.slice(1);
        if (hash && hash !== 'careers-jobs' && hash !== 'careers-application') {
            setExpandedJob(hash);
            requestAnimationFrame(() => {
                document.getElementById(`job-${hash}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        } else {
            window.scrollTo(0, 0);
        }
    }, []);

    // ── Data arrays (PRESERVED VERBATIM from previous Careers.jsx) ──
    const timelinePhases = [
        {
            id: 'today',
            label: 'Today',
            heading: 'Transforming WooCommerce',
            description: 'An intelligent platform that never slows down, combined with an AI Co-pilot that increases your team\'s efficiency. Create themes, build plugins, and make changes in minutes what used to take days.',
            challenges: [
                'Autoscaling WooCommerce during traffic spikes',
                'Multi-zone reliability and failover',
                'AI-powered performance monitoring and insights',
                'Safe CI/CD deployments with rollback capabilities'
            ],
            roles: ['generalist-engineer', 'fde-ai-engineer', 'generalist-designer', 'sales-outreach']
        },
        {
            id: 'next',
            label: 'Next',
            heading: 'Shop Assistant Agent',
            description: 'The future of shopping: "I want badminton shoes delivered today." Urumi will help power natural search, making it effortless for customers to find exactly what they need.',
            challenges: [
                'Natural language product search',
                'AI-powered recommendation engine',
                'Context-aware shopping assistants',
                'Real-time inventory and fulfillment optimization'
            ],
            roles: ['generalist-engineer', 'fde-ai-engineer', 'generalist-designer']
        },
        {
            id: 'future',
            label: 'Future',
            heading: 'Marketing Copilot',
            description: 'Boost your creative team\'s productivity. Our system will tell you which kinds of ads are working and help create assets, turning marketing insights into action automatically.',
            challenges: [
                'AI-generated marketing creative assets',
                'Performance analysis and attribution',
                'Automated campaign optimization',
                'Multi-channel marketing intelligence'
            ],
            roles: ['generalist-engineer', 'fde-ai-engineer', 'generalist-designer', 'sales-outreach']
        }
    ];

    const openPositions = [
        {
            id: 'fde-ai-engineer',
            skillType: 'Engineering',
            activelyHiring: true,
            impactHeadline: 'Work with clients to build AI that runs their store',
            whatYouWillWorkOn: [
                'Work directly with merchants to understand their operations, then build AI agents that execute those workflows',
                'Ship AI-powered automation for real client work—inventory updates, content generation, order routing, pricing adjustments',
                'Run client engagements end-to-end: discover their pain points, prototype a solution, deploy it, and iterate until it runs autonomously',
                'Turn client-specific AI workflows into reusable platform capabilities that scale across every store',
                'Iterate rapidly on prompt engineering, tool orchestration, evaluation harnesses, and production hardening'
            ],
            title: 'Forward Deployed AI Engineer',
            type: 'Full-time',
            location: 'US timezone required · remote anywhere',
            description: 'You\'re the engineer who works directly with our clients and builds the AI that does their work. You\'ll sit with merchants, learn how their store actually operates, and ship agents that handle their day-to-day—so they can focus on growing their business instead of running it. Every client engagement makes the platform smarter for the next one.',
            responsibilities: [
                'Own client AI engagements end-to-end—from discovery calls through production deployment',
                'Design, build, and deploy AI agents (LangGraph, tool-use, retrieval) that execute client workflows autonomously',
                'Translate client needs into technical specs and ship working solutions in days, not months',
                'Build evaluation harnesses so agent quality is measurable, not anecdotal',
                'Harden client-deployed agents for production—error handling, fallbacks, monitoring, and graceful degradation',
                'Feed learnings from client work back into the product to generalize capabilities across all merchants'
            ],
            qualifications: [
                'Strong Python or React—you can prototype fast and also write production-grade code',
                'Comfort with prompt engineering, RAG pipelines, tool-use patterns, and evaluation frameworks',
                'Strong client-facing skills—you can run a discovery call, demo a prototype, and explain tradeoffs to non-technical stakeholders',
                'Bias toward shipping—you\'d rather deploy something imperfect and iterate than polish forever',
                'Bonus: Experience with WooCommerce, Shopify, or e-commerce operations',
                'Bonus: Experience building and shipping LLM-powered features or agents in production',
                'Bonus: Background in solutions engineering, consulting, or forward-deployed roles'
            ],
            applyUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSdOYXltS-p4E_ygEL_3Kq4DrFdSU7UZz8QVfIqYP62oJuFDMg/viewform?usp=sharing'
        },
        {
            id: 'devops-engineer',
            skillType: 'Engineering',
            impactHeadline: 'Build simple, robust infrastructure—no over-engineering',
            whatYouWillWorkOn: [
                'Keep production systems stable and performant during traffic spikes',
                'Build monitoring and observability tooling that catches issues before customers notice',
                'Handle on-call rotations and incident response with calm precision',
                'Create simple, maintainable automation that just works',
                'Work with Kubernetes, Docker, CI/CD, and cloud infrastructure at scale'
            ],
            title: 'DevOps Engineer',
            type: 'Full-time',
            location: 'San Francisco · Goa · Bangalore · remote Europe',
            description: 'We\'re looking for a DevOps engineer who believes in simple, robust solutions over complex architectures. You\'ve been on-call, you know what breaks at 3 AM, and you build systems that don\'t wake you up. 3-5 years experience required.',
            responsibilities: [
                'Maintain and improve Kubernetes infrastructure for WooCommerce hosting at scale',
                'Build and maintain CI/CD pipelines for safe, automated deployments',
                'Implement monitoring, alerting, and observability across the stack',
                'Participate in on-call rotation and respond to production incidents',
                'Debug complex infrastructure issues—network configs, container orchestration, cloud services',
                'Optimize for reliability and simplicity, not complexity for its own sake'
            ],
            qualifications: [
                '3-5 years of experience in DevOps, SRE, or infrastructure engineering',
                'Hands-on experience with on-call rotations and production incident response',
                'Strong knowledge of Kubernetes, Docker, and container orchestration',
                'Experience with CI/CD tools (GitHub Actions, GitLab CI, Jenkins, or similar)',
                'Comfortable with Linux systems, networking, and debugging at all levels',
                'Philosophy: prefer boring, battle-tested solutions over shiny new tech',
                'Bonus: Experience with WooCommerce, WordPress, or e-commerce infrastructure',
                'Bonus: APM/observability tools (Grafana, Prometheus, OpenTelemetry)'
            ],
            applyUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSdOYXltS-p4E_ygEL_3Kq4DrFdSU7UZz8QVfIqYP62oJuFDMg/viewform?usp=sharing'
        },
        {
            id: 'generalist-engineer',
            skillType: 'Engineering',
            impactHeadline: 'Take on anything—from LangGraph to Kubernetes',
            whatYouWillWorkOn: [
                'Build AI agents with LangGraph that automate merchant workflows',
                'Scale infrastructure with Kubernetes for Black Friday traffic spikes',
                'Debug performance bottlenecks from React to PHP to database queries',
                'Ship full-stack features—APIs, frontend, infrastructure, everything',
                'Work directly with merchants to solve their hardest technical problems'
            ],
            title: 'Generalist Engineer',
            type: 'Full-time',
            location: 'San Francisco · Goa · Bangalore · remote Europe',
            description: 'We\'re looking for a true generalist who thrives on variety. One day you\'re building AI agents with LangGraph, the next you\'re optimizing Kubernetes deployments. No specialists needed—just problem-solvers who can tackle anything.',
            responsibilities: [
                'Ship across the entire stack: LangGraph AI agents, React frontends, PHP backends, Kubernetes infrastructure',
                'Debug complex issues anywhere in the system—AI pipelines, database queries, network configs, you name it',
                'Build and maintain CI/CD workflows, deployment automation, and observability tooling',
                'Work directly with customers on technical implementations and troubleshooting',
                'Optimize WooCommerce stores for scale, reliability, and performance',
                'Jump between contexts quickly—AI/ML one moment, DevOps the next, customer support after that'
            ],
            qualifications: [
                'Comfortable context-switching between wildly different domains (AI, infrastructure, frontend, backend)',
                'Strong debugging skills—you can figure things out even when you\'ve never seen the technology before',
                'Experience with at least 2-3 of: React, PHP, Python, Kubernetes, Docker, LangGraph/LangChain, databases',
                'Not afraid of production systems—you can ship confidently and fix things quickly when they break',
                'Clear written communication for technical discussions with team and customers',
                'Bonus: Experience with WooCommerce, WordPress, e-commerce platforms, or AI/LLM systems'
            ],
            applyUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSdOYXltS-p4E_ygEL_3Kq4DrFdSU7UZz8QVfIqYP62oJuFDMg/viewform?usp=sharing'
        },
        {
            id: 'generalist-designer',
            skillType: 'Design',
            impactHeadline: 'Craft experiences—from jitter.video-style landing pages to motion design',
            whatYouWillWorkOn: [
                'Design stunning landing pages that rival Apple and jitter.video in polish and impact',
                'Create product experiences that make complex infrastructure feel effortless',
                'Build motion designs and micro-interactions that bring the brand to life',
                'Design everything from marketing assets to in-app interfaces to customer presentations',
                'Work directly with founders to shape Urumi\'s visual identity and brand presence'
            ],
            title: 'Generalist Designer',
            type: 'Full-time',
            location: 'San Francisco · Goa · Bangalore · remote Europe',
            description: 'We\'re looking for a designer who can do it all—world-class landing pages, intuitive product design, and captivating motion work. If you get excited about pixel-perfect details and smooth animations, this is for you.',
            responsibilities: [
                'Design and ship landing pages, marketing sites, and campaign visuals that convert',
                'Create product UI/UX for dashboards, onboarding flows, and customer-facing tools',
                'Produce motion graphics, animations, and interactive elements for web and video',
                'Maintain and evolve the Urumi brand system—colors, typography, components, guidelines',
                'Collaborate with engineering to implement designs (bonus if you can code basic HTML/CSS/React)',
                'Jump between contexts: brand design one day, product mockups the next, video animations after that'
            ],
            qualifications: [
                'Portfolio showcasing versatility—landing pages, product design, motion work, or brand design',
                'Proficiency in Figma (required) and motion tools like After Effects, Lottie, or similar',
                'Eye for detail and polish—you know when something feels off and how to fix it',
                'Comfortable working autonomously and shipping quickly without layers of approval',
                'Bonus: Basic front-end skills (HTML/CSS, React) or experience with no-code tools',
                'Bonus: Experience designing for SaaS, developer tools, or infrastructure products'
            ],
            applyUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSdOYXltS-p4E_ygEL_3Kq4DrFdSU7UZz8QVfIqYP62oJuFDMg/viewform?usp=sharing'
        },
        {
            id: 'sales-outreach',
            skillType: 'Sales & GTM',
            impactHeadline: 'Close deals and own our go-to-market strategy',
            whatYouWillWorkOn: [
                'Find and close high-value merchants who need enterprise WooCommerce infrastructure',
                'Experiment with outreach campaigns—cold email, LinkedIn, partnerships, whatever works',
                'Brainstorm and test GTM strategies with the founders (messaging, positioning, channels)',
                'Build relationships with WooCommerce agencies, consultants, and ecosystem partners',
                'Own the full sales cycle from prospecting to close to onboarding'
            ],
            title: 'Sales & Outreach',
            type: 'Full-time',
            location: 'San Francisco · Goa · Bangalore · remote Europe',
            description: 'We\'re looking for someone hungry to close deals and grow revenue. You\'ll experiment with outreach strategies, build our pipeline, and work directly with founders to refine our GTM approach. If you love the thrill of the close, this is for you.',
            responsibilities: [
                'Prospect and qualify leads—research targets, craft personalized outreach, book discovery calls',
                'Run the full sales cycle: demos, proposals, negotiations, closing, and handoff to success',
                'Design and execute outreach campaigns across email, LinkedIn, events, and partnerships',
                'Collaborate with founders on GTM strategy—what messaging works, which channels convert, how to position Urumi',
                'Build relationships in the WooCommerce ecosystem (agencies, consultants, communities)',
                'Track metrics, analyze what\'s working, and iterate fast on campaigns and messaging'
            ],
            qualifications: [
                'Proven track record of closing deals (B2B SaaS, infrastructure, or developer tools preferred)',
                'Hunger and hustle—you\'re motivated by hitting targets and growing revenue',
                'Strong written communication for cold outreach, proposals, and follow-ups',
                'Comfortable experimenting and iterating—you don\'t need a playbook, you build one',
                'Ability to talk technical with engineers and business with executives',
                'Bonus: Experience in WooCommerce, WordPress, e-commerce, or hosting/infrastructure sales'
            ],
            applyUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSdOYXltS-p4E_ygEL_3Kq4DrFdSU7UZz8QVfIqYP62oJuFDMg/viewform?usp=sharing'
        }
    ];

    const toggleTimeline = (id) => setExpandedTimeline(expandedTimeline === id ? null : id);
    const toggleJob = (id) => {
        const next = expandedJob === id ? null : id;
        setExpandedJob(next);
        window.history.replaceState(null, '', next ? `#${next}` : window.location.pathname);
    };

    const scrollToJobs = () => {
        document.getElementById('careers-jobs')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const scrollToApplication = () => {
        setIsApplicationOpen(true);
        setTimeout(() => {
            const el = document.getElementById('careers-application');
            if (el) {
                const top = el.getBoundingClientRect().top + window.pageYOffset - 100;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        }, 100);
    };

    const cultureCards = [
        { title: 'Distributed, one team', text: 'San Francisco HQ, engineering in Goa and Bangalore, support and growth across Europe — full-time, in person at the offices or remote across the EU.', icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
        )},
        { title: 'Customer-Focused', text: 'We work directly with merchants to solve real infrastructure problems.', icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        )},
        { title: 'Impact-Driven', text: "Your work directly affects store uptime and merchant revenue.", icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
        )},
        { title: 'Learning Culture', text: 'Tackle new challenges across the stack and grow your skills.', icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
        )},
    ];

    return (
        <div className="ds-page ds-page-careers">
            {/* HERO — same DNA as Vision / WC / CaseStudy: corner gradient +
                cursor-tracked spotlight on the cream canvas, no video. */}
            <header
                className="careers-hero"
                ref={heroRef}
                onMouseMove={handleHeroMouseMove}
                data-snap-section
            >
                <div className="careers-hero-corner" aria-hidden="true" />
                <motion.div
                    className="careers-hero-spotlight"
                    aria-hidden="true"
                    style={{
                        x: spotX, y: spotY,
                        width:  SPOT_SIZE,
                        height: SPOT_SIZE,
                    }}
                />
                <motion.div
                    className="ds-wrap careers-hero-inner"
                    style={{ y: heroTextY }}
                >
                    <DSReveal>
                        <span className="ds-eyebrow">
                            <span className="ds-eyebrow-dot" />
                            Careers · San Francisco · Goa · Bangalore · remote Europe
                        </span>
                    </DSReveal>
                    <DSReveal delay={0.06}>
                        <h1 className="ds-h1 careers-hero-title">
                            We&rsquo;re making eCommerce <span className="ds-accent">effortless.</span><br />
                            Want to build the future with us?
                        </h1>
                    </DSReveal>
                    <DSReveal delay={0.12}>
                        <p className="ds-sub careers-hero-sub">
                            Join us in building AI-powered infrastructure that transforms how online stores operate.
                        </p>
                    </DSReveal>
                    <DSReveal delay={0.18}>
                        <div className="careers-hero-ctas">
                            <button onClick={scrollToJobs} className="ds-pill ds-pill-solid">
                                View open roles <span className="ds-arrow">&rarr;</span>
                            </button>
                            <button onClick={scrollToApplication} className="ds-pill">
                                Apply now
                            </button>
                        </div>
                    </DSReveal>
                </motion.div>
            </header>

            {/* 01 / THE PROBLEM */}
            <section className="careers-section">
                <div className="ds-wrap">
                    <DSReveal>
                        <span className="ds-num-label">01 / The problem</span>
                    </DSReveal>
                    <DSReveal delay={0.06}>
                        <h2 className="ds-h2 careers-section-heading">The problem we're solving</h2>
                    </DSReveal>
                    <DSReveal delay={0.12}>
                        <div className="ds-prose careers-prose">
                            <p>Running a high-traffic WooCommerce store today means stitching together hosting, agencies, devs, and an on-call rotation — and still firefighting through every campaign and viral moment. Merchants end up doing operations work instead of merchant work.</p>
                            <p>Urumi runs the operations layer of your store — scaling, reliability, releases, performance, and the on-call work that used to need a team. Built by the people who built WooCommerce. The platform&rsquo;s shipping today; gr&uuml;um runs on it through their busiest weeks.</p>
                            <p>Stores should run themselves. The four jobs the platform handles today are the start. The agents we&rsquo;re building next — Builder, Revenue, Analytics — are why we&rsquo;re hiring.</p>
                        </div>
                    </DSReveal>
                </div>
            </section>

            {/* 02 / WHAT WE'RE BUILDING */}
            <section className="careers-section">
                <div className="ds-wrap">
                    <DSReveal>
                        <span className="ds-num-label">02 / What we're building</span>
                    </DSReveal>
                    <DSReveal delay={0.06}>
                        <h2 className="ds-h2 careers-section-heading">Today · Next · Future</h2>
                    </DSReveal>
                    <DSReveal delay={0.12}>
                        <p className="ds-sub careers-section-sub">
                            Click each phase to see what we're working on and the challenges you'll help solve.
                        </p>
                    </DSReveal>

                    <div className="careers-timeline">
                        {timelinePhases.map((phase, i) => (
                            <DSReveal key={phase.id} delay={0.06 * (i + 3)}>
                                <button
                                    type="button"
                                    className={`ds-card careers-timeline-card ${expandedTimeline === phase.id ? 'is-expanded' : ''}`}
                                    onClick={() => toggleTimeline(phase.id)}
                                    aria-expanded={expandedTimeline === phase.id}
                                >
                                    <div className="careers-timeline-header">
                                        <span className="ds-mono careers-timeline-label">{phase.label}</span>
                                        <h3 className="ds-h3 careers-timeline-heading">{phase.heading}</h3>
                                        <span className="careers-timeline-icon" aria-hidden="true">
                                            {expandedTimeline === phase.id ? '−' : '+'}
                                        </span>
                                    </div>

                                    {expandedTimeline === phase.id && (
                                        <div className="careers-timeline-body">
                                            <p className="ds-body">{phase.description}</p>
                                            <h4 className="careers-timeline-subhead">Technical Challenges:</h4>
                                            <ul className="careers-timeline-list">
                                                {phase.challenges.map((c, idx) => <li key={idx}>{c}</li>)}
                                            </ul>
                                            <span
                                                className="ds-pill"
                                                role="button"
                                                tabIndex={0}
                                                onClick={(e) => { e.stopPropagation(); scrollToJobs(); }}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' || e.key === ' ') {
                                                        e.preventDefault();
                                                        scrollToJobs();
                                                    }
                                                }}
                                            >
                                                See open roles <span className="ds-arrow">→</span>
                                            </span>
                                        </div>
                                    )}
                                </button>
                            </DSReveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* 03 / OPEN ROLES */}
            <section id="careers-jobs" className="careers-section">
                <div className="ds-wrap">
                    <DSReveal>
                        <span className="ds-num-label">03 / Open roles</span>
                    </DSReveal>
                    <DSReveal delay={0.06}>
                        <h2 className="ds-h2 careers-section-heading">Where you'll make impact</h2>
                    </DSReveal>

                    {openPositions.length === 0 ? (
                        <DSReveal delay={0.12}>
                            <p className="ds-sub careers-section-sub">
                                We don't have any open positions at the moment, but we're always interested in meeting talented engineers. Reach out at <a href="mailto:careers@urumi.ai">careers@urumi.ai</a>.
                            </p>
                        </DSReveal>
                    ) : (
                        <div className="careers-jobs-list">
                            {openPositions.map((p, i) => (
                                <DSReveal key={p.id} delay={0.04 * i}>
                                    <article
                                        id={`job-${p.id}`}
                                        className={`ds-card careers-job-card ${expandedJob === p.id ? 'is-expanded' : ''}`}
                                        onClick={() => toggleJob(p.id)}
                                    >
                                        <div className="careers-job-header">
                                            <span className="ds-num-label careers-job-skill">
                                                {p.skillType}
                                                {p.activelyHiring && <span className="careers-job-hiring-badge">Actively hiring</span>}
                                            </span>
                                            <h3 className="ds-h3 careers-job-headline">{p.impactHeadline}</h3>
                                            <span className="careers-job-icon" aria-hidden="true">
                                                {expandedJob === p.id ? '−' : '+'}
                                            </span>
                                        </div>

                                        <div className="ds-mono careers-job-meta">
                                            <span>{p.title}</span>
                                            <span> · </span>
                                            <span>{p.location} · {p.type}</span>
                                        </div>

                                        {expandedJob === p.id && (
                                            <div className="careers-job-body">
                                                <h4 className="careers-job-subhead">What you'll work on</h4>
                                                <ul className="careers-job-list">
                                                    {p.whatYouWillWorkOn.map((it, idx) => <li key={idx}>{it}</li>)}
                                                </ul>

                                                <h4 className="careers-job-subhead">About the role</h4>
                                                <p className="ds-body">{p.description}</p>

                                                <h4 className="careers-job-subhead">Responsibilities</h4>
                                                <ul className="careers-job-list">
                                                    {p.responsibilities.map((it, idx) => <li key={idx}>{it}</li>)}
                                                </ul>

                                                <h4 className="careers-job-subhead">What we're looking for</h4>
                                                <ul className="careers-job-list">
                                                    {p.qualifications.map((it, idx) => <li key={idx}>{it}</li>)}
                                                </ul>

                                                <button
                                                    type="button"
                                                    className="ds-pill ds-pill-solid careers-job-apply"
                                                    onClick={(e) => { e.stopPropagation(); scrollToApplication(); }}
                                                >
                                                    Apply now <span className="ds-arrow">→</span>
                                                </button>
                                            </div>
                                        )}
                                    </article>
                                </DSReveal>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* 04 / HOW WE WORK */}
            <section className="careers-section">
                <div className="ds-wrap">
                    <DSReveal>
                        <span className="ds-num-label">04 / How we work</span>
                    </DSReveal>
                    <DSReveal delay={0.06}>
                        <h2 className="ds-h2 careers-section-heading">How we work</h2>
                    </DSReveal>

                    <div className="careers-culture-grid">
                        {cultureCards.map((card, i) => (
                            <DSReveal key={card.title} delay={0.04 * i}>
                                <div className="ds-card careers-culture-card">
                                    <div className="careers-culture-icon">{card.icon}</div>
                                    <h3 className="ds-h3 careers-culture-title">{card.title}</h3>
                                    <p className="ds-body careers-culture-text">{card.text}</p>
                                </div>
                            </DSReveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* FINAL CTA — hire variant */}
            <DSFinalCTA
                variant="hire"
                numLabel="Next step"
                title={<>Ready to build the future of <span className="ds-accent">eCommerce?</span></>}
                subtitle="Join us in making eCommerce effortless."
                primary={{ onClick: (e) => { e.preventDefault(); scrollToJobs(); }, label: 'View open roles' }}
                secondary={{ onClick: (e) => { e.preventDefault(); scrollToApplication(); }, label: 'or apply now' }}
            />

            <div className="footer-section" data-snap-section>
                <TeamCredentials />
            </div>

            {/* APPLICATION FORM (collapsible) */}
            <FormCollapse
                isOpen={isApplicationOpen}
                onClose={() => setIsApplicationOpen(false)}
                formUrl="https://docs.google.com/forms/d/e/1FAIpQLSdOYXltS-p4E_ygEL_3Kq4DrFdSU7UZz8QVfIqYP62oJuFDMg/viewform?embedded=true"
                title="Apply now"
            />

            {/* anchor target for scrollToApplication; FormCollapse may render with its own id, keep this minimal pad */}
            <div id="careers-application" />
        </div>
    );
}

export default Careers;

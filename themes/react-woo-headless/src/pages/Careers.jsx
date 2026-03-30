/**
 * Careers Page Component - Build the Future Narrative
 *
 * Displays open positions at Urumi with storytelling and mission alignment
 *
 * ⚠️ PAIRED WITH: template-parts/ssr-careers.php
 * When updating content, BOTH files must be kept in sync!
 *
 * @author Urumi.ai
 */

import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import VideoHeroBackground from '../components/VideoHeroBackground';
import '../styles/Careers.css';

function Careers() {
  const [expandedTimeline, setExpandedTimeline] = useState(null);
  const [expandedJob, setExpandedJob] = useState(null);
  const [isApplicationOpen, setIsApplicationOpen] = useState(false);
  const sectionsRef = useRef([]);

  useEffect(() => {
    document.title = 'Careers - Build the Future of eCommerce | Urumi';
    window.scrollTo(0, 0);

    // Scroll-triggered animation observer
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.15
    };

    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('careers-section-visible');
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sectionsRef.current.forEach(section => {
      if (section) {
        observer.observe(section);
      }
    });

    const currentSections = sectionsRef.current;

    return () => {
      currentSections.forEach(section => {
        if (section) {
          observer.unobserve(section);
        }
      });
    };
  }, []);

  const themeUrl = window.wpData?.themePath || '/wp-content/themes/react-woo-headless';

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
      roles: ['generalist-engineer', 'generalist-designer', 'sales-outreach']
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
      roles: ['generalist-engineer', 'generalist-designer']
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
      roles: ['generalist-engineer', 'generalist-designer', 'sales-outreach']
    }
  ];

  const openPositions = [
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
      location: 'Full-time in Goa',
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
      applyUrl: 'https://dashboard.urumi.ai/s/naman'
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
      location: 'Full-time in Goa',
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
      applyUrl: 'https://dashboard.urumi.ai/s/naman'
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
      location: 'Full-time in Goa',
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
      applyUrl: 'https://dashboard.urumi.ai/s/naman'
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
      location: 'Full-time in Goa',
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
      applyUrl: 'https://dashboard.urumi.ai/s/naman'
    }
  ];

  const toggleTimeline = (id) => {
    setExpandedTimeline(expandedTimeline === id ? null : id);
  };

  const toggleJob = (id) => {
    setExpandedJob(expandedJob === id ? null : id);
  };

  const scrollToJobs = () => {
    const jobsSection = document.getElementById('careers-jobs');
    if (jobsSection) {
      jobsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const scrollToApplication = () => {
    setIsApplicationOpen(true);
    setTimeout(() => {
      const applicationSection = document.getElementById('careers-application');
      if (applicationSection) {
        const headerOffset = 100;
        const elementPosition = applicationSection.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }, 100);
  };


  return (
    <div className="careers-page">
      {/* Hero Section with Video Background */}
      <VideoHeroBackground className="careers-hero">
        <div className="careers-hero-content">
          <h1 className="careers-hero-title">
            <span className="careers-gradient-text">We're making eCommerce effortless.</span><br />
            <span className="careers-dark-text">Want to build the future with us?</span>
          </h1>

          <p className="careers-hero-subtitle">
            Join us in building AI-powered infrastructure that transforms how online stores operate.
          </p>

          <div className="careers-hero-cta">
            <button onClick={scrollToJobs} className="btn btn-primary">View Open Roles</button>
          </div>
        </div>
      </VideoHeroBackground>

      {/* Mission Section - Why Urumi Exists */}
      <section className="careers-mission careers-scroll-section" ref={el => sectionsRef.current[0] = el}>
        <div className="careers-container">
          <h2 className="careers-section-title">The Problem We're Solving</h2>

          <div className="careers-mission-content">
            <p className="careers-mission-text">
              Today, running a WooCommerce store means juggling hosting providers, developers,
              agencies, and infrastructure firefighting. Merchants spend more time managing
              technical complexity than growing their business.
            </p>
            <p className="careers-mission-text">
              We're changing that. Urumi uses AI to handle the entire technical burden—
              autoscaling, performance monitoring, safe deployments, and infrastructure
              management—so merchants can focus on what matters: their customers.
            </p>
            <p className="careers-mission-text">
              This is just the beginning. We're building toward a future where AI agents
              handle everything from inventory optimization to customer support, making
              eCommerce truly effortless.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Timeline - Today/Next/Future */}
      <section className="careers-timeline-section careers-scroll-section" ref={el => sectionsRef.current[1] = el}>
        <div className="careers-container">
          <h2 className="careers-section-title">What We're Building</h2>
          <p className="careers-section-subtitle">
            Click each phase to see what we're working on and the challenges you'll help solve
          </p>

          <div className="careers-timeline">
            {timelinePhases.map((phase, index) => (
              <div
                key={phase.id}
                className={`careers-timeline-item ${expandedTimeline === phase.id ? 'expanded' : ''}`}
                onClick={() => toggleTimeline(phase.id)}
              >
                <div className="careers-timeline-header">
                  <span className="careers-timeline-label">{phase.label}</span>
                  <h3 className="careers-timeline-heading">{phase.heading}</h3>
                  <span className="careers-timeline-icon">
                    {expandedTimeline === phase.id ? '−' : '+'}
                  </span>
                </div>

                {expandedTimeline === phase.id && (
                  <div className="careers-timeline-details">
                    <p className="careers-timeline-description">{phase.description}</p>

                    <div className="careers-timeline-challenges">
                      <h4>Technical Challenges:</h4>
                      <ul>
                        {phase.challenges.map((challenge, idx) => (
                          <li key={idx}>{challenge}</li>
                        ))}
                      </ul>
                    </div>

                    <button
                      className="btn btn-primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        scrollToJobs();
                      }}
                    >
                      See Open Roles →
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Jobs Section - Impact-Based Cards */}
      <section id="careers-jobs" className="careers-jobs-section careers-scroll-section" ref={el => sectionsRef.current[2] = el}>
        <div className="careers-container">
          <h2 className="careers-section-title">Where You'll Make Impact</h2>

          {openPositions.length === 0 ? (
            <div className="no-positions">
              <p>We don't have any open positions at the moment, but we're always interested in meeting talented engineers.</p>
              <p>Feel free to reach out at <a href="mailto:careers@urumi.ai">careers@urumi.ai</a></p>
            </div>
          ) : (
            <div className="careers-jobs-list">
              {openPositions.map(position => (
                <article
                  key={position.id}
                  className={`careers-job-card ${expandedJob === position.id ? 'expanded' : ''}`}
                  onClick={() => toggleJob(position.id)}
                >
                  <div className="careers-job-header">
                    <span className="careers-job-skill-label">{position.skillType}</span>
                    <h3 className="careers-job-headline">{position.impactHeadline}</h3>
                    <span className="careers-job-icon">
                      {expandedJob === position.id ? '−' : '+'}
                    </span>
                  </div>

                  <div className="careers-job-meta-compact">
                    <span className="careers-job-title-compact">{position.title}</span>
                    <span className="careers-job-location-compact">{position.location} • {position.type}</span>
                  </div>

                  {expandedJob === position.id && (
                    <div className="careers-job-expanded-content">
                      <div className="careers-job-preview">
                        <h4>What You'll Work On:</h4>
                        <ul>
                          {position.whatYouWillWorkOn.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="careers-job-details">
                        <div className="careers-job-section">
                          <h4>About the Role</h4>
                          <p>{position.description}</p>
                        </div>

                        <div className="careers-job-section">
                          <h4>Responsibilities</h4>
                          <ul>
                            {position.responsibilities.map((item, index) => (
                              <li key={index}>{item}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="careers-job-section">
                          <h4>What We're Looking For</h4>
                          <ul>
                            {position.qualifications.map((item, index) => (
                              <li key={index}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="careers-job-actions">
                        <button
                          className="btn btn-primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            scrollToApplication();
                          }}
                        >
                          Apply Now
                        </button>
                      </div>
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Culture Section - Enterprise Design */}
      <section className="careers-culture careers-scroll-section" ref={el => sectionsRef.current[3] = el}>
        <div className="careers-container">
          <h2 className="careers-section-title">How We Work</h2>

          <div className="careers-culture-grid">
            <div className="careers-culture-card">
              <div className="careers-culture-accent"></div>
              <div className="careers-culture-icon-circle">
                <svg className="careers-culture-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path>
                  <path d="M2 12h20"></path>
                </svg>
              </div>
              <h3 className="careers-culture-title">Goa Office</h3>
              <p className="careers-culture-text">
                Work full-time from our Goa office with the team. Build together, ship faster.
              </p>
            </div>

            <div className="careers-culture-card">
              <div className="careers-culture-accent"></div>
              <div className="careers-culture-icon-circle">
                <svg className="careers-culture-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
              </div>
              <h3 className="careers-culture-title">Customer-Focused</h3>
              <p className="careers-culture-text">
                We work directly with merchants to solve real infrastructure problems.
              </p>
            </div>

            <div className="careers-culture-card">
              <div className="careers-culture-accent"></div>
              <div className="careers-culture-icon-circle">
                <svg className="careers-culture-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
                </svg>
              </div>
              <h3 className="careers-culture-title">Impact-Driven</h3>
              <p className="careers-culture-text">
                Your work directly affects store uptime and merchant revenue.
              </p>
            </div>

            <div className="careers-culture-card">
              <div className="careers-culture-accent"></div>
              <div className="careers-culture-icon-circle">
                <svg className="careers-culture-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                </svg>
              </div>
              <h3 className="careers-culture-title">Learning Culture</h3>
              <p className="careers-culture-text">
                Tackle new challenges across the stack and grow your skills.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="careers-cta careers-scroll-section" ref={el => sectionsRef.current[4] = el}>
        <div className="careers-cta-content">
          <h2 className="careers-cta-title">Ready to build the future of eCommerce?</h2>
          <p className="careers-cta-text">
            Join us in making eCommerce effortless.
          </p>
          <div className="careers-cta-buttons">
            <a href="#careers-jobs" className="btn btn-primary btn-lg">
              View Open Roles
            </a>
          </div>
        </div>
      </section>

      {/* Application Form Section */}
      {isApplicationOpen && (
        <section id="careers-application" className="careers-application-section">
          <div className="careers-container">
            <div className="careers-application-header">
              <h2 className="careers-section-title">Apply Now</h2>
              <button
                className="careers-close-btn"
                onClick={() => setIsApplicationOpen(false)}
                aria-label="Close application form"
              >
                ✕
              </button>
            </div>
            <p className="careers-section-subtitle">
              Ready to build the future of eCommerce with us? Fill out the form below and we'll get back to you soon.
            </p>
            <div className="careers-application-form">
              <iframe
                src="https://docs.google.com/forms/d/e/1FAIpQLSdOYXltS-p4E_ygEL_3Kq4DrFdSU7UZz8QVfIqYP62oJuFDMg/viewform?embedded=true"
                width="100%"
                height="1360"
                frameBorder="0"
                marginHeight="0"
                marginWidth="0"
                title="Career Application Form"
              >
                Loading…
              </iframe>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default Careers;

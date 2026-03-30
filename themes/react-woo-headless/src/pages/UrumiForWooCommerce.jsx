/**
 * Urumi For WooCommerce Page Component
 *
 * Enterprise WooCommerce hosting features and benefits
 * Route: /urumi-for-woocommerce
 *
 * Note: The actual homepage (/) is the Vision page (Vision.jsx)
 *
 * ⚠️ PAIRED WITH: template-parts/ssr-urumi-for-woocommerce.php
 * When updating content, BOTH files must be kept in sync!
 *
 * @author Urumi.ai
 */

import { useEffect, useState, useRef } from 'react';
import Hero from '../components/Hero';
import FeatureCard from '../components/FeatureCard';
import Benchmarks from '../components/Benchmarks';
import PerformanceGuardrails from '../components/PerformanceGuardrails';
import EverythingIncluded from '../components/EverythingIncluded';
import ComparisonTable from '../components/ComparisonTable';
import CompetitorComparison from '../components/CompetitorComparison';
import TestimonialSection from '../components/TestimonialSection';
import AuditCTA from '../components/AuditCTA';
import FAQSection from '../components/FAQSection';
import TeamCredentials from '../components/TeamCredentials';
import LastUpdated from '../components/LastUpdated';
import FormCollapse from '../components/FormCollapse';

function UrumiForWooCommerce() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const formRef = useRef(null);

  const handleFormClose = () => {
    setIsFormOpen(false);
  };

  useEffect(() => {
    document.title = 'Urumi For WooCommerce - Enterprise Auto-Scaling Hosting | 99.99% Uptime Guarantee';

    // Listen for custom event from header
    const handleHeaderDemoClick = () => {
      setIsFormOpen(true);
      setTimeout(() => {
        if (formRef.current) {
          formRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    };

    window.addEventListener('openDemoForm', handleHeaderDemoClick);

    return () => {
      window.removeEventListener('openDemoForm', handleHeaderDemoClick);
    };
  }, []);

  return (
    <div className="home-page">
      <Hero />

      {/* Card 1: Campaign spikes - White background */}
      <div id="features"></div>
      <FeatureCard
        variant="white"
        painPoint="Campaign spikes"
        problem="Campaign traffic is unpredictable. When spikes hit, pages slow down or fail, and you lose revenue at the worst time."
        solutionLabel="HOW URUMI SOLVES IT"
        solutionHeading="Horizontal Scaling"
        solutionDescription="Urumi enables autoscaling for spikes, keeping checkout stable and p99 under control during peak demand."
        lottieAnimation="horizontal-scaling-animation.json"
        placeholder="[Traffic wave → horizontal nodes → flat latency line]

p99 < 1s"
      />

      {/* Card 2: Reliability - Pastel background */}
      <FeatureCard
        variant="pastel"
        painPoint="Reliability"
        problem="A single-zone setup turns outages into guesswork. When something breaks, recovery is slow and business impact is immediate."
        solutionLabel="HOW URUMI SOLVES IT"
        solutionHeading="Google-Backed Uptime"
        solutionDescription="Urumi uses Google Cloud multi-zone infrastructure with automatic failover and offsite backups for reliable uptime and rapid recovery."
        video="multi-zone-distribution-animation.webm"
        placeholder="[Region map outline]
Active / Standby
[Backup vault icon]

Auto failover"
      />

      {/* Card 3: Safe shipping - White background */}
      <FeatureCard
        variant="white"
        painPoint="Safe shipping"
        problem="Small plugin or theme updates can break production. Shipping feels risky, and rollbacks are slow when something goes wrong."
        solutionLabel="HOW URUMI SOLVES IT"
        solutionHeading="Safe Releases"
        solutionDescription="Urumi enables staging + CI/CD with rollback-ready deploys, so changes ship confidently without production incidents."
        video="safe-releases-demo.mov"
      />

      {/* Card 4: Performance decay - Pastel background */}
      <FeatureCard
        variant="pastel"
        painPoint="Performance decay over time"
        problem="Stores get slower over time. After every change, it's hard to know what caused the regression or how to prevent it."
        solutionLabel="HOW URUMI SOLVES IT"
        solutionHeading="Performance Guardrails"
        solutionDescription="AI-powered monitoring that catches performance issues before your customers do, automatically identifying the exact cause and preventing slowdowns."
        video="urumi-telemetry-monitoring-demo.mp4"
      />

      {/* Benchmarks Section */}
      <div id="benchmarks"></div>
      <Benchmarks />

      {/* Performance Guardrails Section */}
      {/* <PerformanceGuardrails /> */}

      {/* Demo Form Collapse Section */}
      <FormCollapse
        ref={formRef}
        isOpen={isFormOpen}
        onClose={handleFormClose}
        formUrl="https://docs.google.com/forms/d/e/1FAIpQLScIEQm-Q80VoT3FLiWuk8XbRcLCbL1BxbZeLysd1ckBfDt3lw/viewform?embedded=true"
        title="Demo with Founders"
      />

      {/* Everything Included Section */}
      <EverythingIncluded />

      {/* Competitor Comparison Section */}
      <CompetitorComparison />

      {/* Comparison Table Section */}
      <div id="comparison"></div>
      <ComparisonTable />

      {/* Testimonial Section */}
      <TestimonialSection />

      {/* Audit CTA Section */}
      <div id="audit"></div>
      <AuditCTA />

      {/* FAQ Section */}
      <FAQSection />

      {/* Footer Section with Pearl Gradient */}
      <div className="footer-section">
        <TeamCredentials />
        <LastUpdated />
      </div>
    </div>
  );
}

export default UrumiForWooCommerce;

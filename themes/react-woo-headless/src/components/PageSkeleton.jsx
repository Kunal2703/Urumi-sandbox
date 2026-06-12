/**
 * PageSkeleton — Suspense fallback shown while a lazy route chunk loads.
 *
 * Replaces the previous blank <div className="page-loading" />. Renders a
 * brand-consistent shimmering placeholder so users see "something is
 * coming" instead of "site broke." The 80ms fade-in delay prevents a
 * jarring flash on fast networks where the chunk loads sooner than the
 * skeleton would meaningfully animate.
 *
 * Note: between SSR-content removal and route-chunk load, this is the
 * fallback Suspense renders. Most users on warm caches never see it.
 */

export default function PageSkeleton() {
  return (
    <div className="page-skeleton" aria-busy="true" aria-live="polite">
      <div className="page-skeleton__inner">
        <div className="page-skeleton__bar page-skeleton__bar--title" />
        <div className="page-skeleton__bar page-skeleton__bar--sub" />
        <div className="page-skeleton__bar page-skeleton__bar--row" />
        <div className="page-skeleton__bar page-skeleton__bar--row" />
        <div className="page-skeleton__bar page-skeleton__bar--row-short" />
      </div>
    </div>
  );
}

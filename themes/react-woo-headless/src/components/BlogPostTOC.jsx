/**
 * Blog post table of contents — sticky right-rail scrollspy.
 *
 * ⚠️ PAIRED WITH: template-parts/ssr-blog-post.php (SSR sibling)
 *   The PHP renders the same anchor list for crawlers. React replaces it
 *   on hydration with this interactive version. Anchor ids come from
 *   React_SSR_Toc::process() — never re-slugify on the client.
 *
 * Active-state tracking uses IntersectionObserver with a top-skewed
 * rootMargin so a heading is "active" when it reaches roughly the upper
 * third of the viewport (not when it merely enters the bottom).
 *
 * Hidden below 1024px — matches Tailwind / Stripe Press. Hiding is done
 * in CSS, not JS, so it never appears mid-render on narrow screens.
 */

import React, { useEffect, useRef, useState } from 'react';

const ROOT_MARGIN = '-20% 0% -70% 0%';

function BlogPostTOC({ toc, contentRef }) {
    const [activeId, setActiveId] = useState(toc?.[0]?.id || null);
    const clickLockRef = useRef(false);
    const clickLockTimerRef = useRef(null);

    useEffect(() => {
        if (!toc || toc.length === 0 || !contentRef?.current) {
            return;
        }

        const container = contentRef.current;
        const headings = toc
            .map(({ id }) => container.querySelector(`#${CSS.escape(id)}`))
            .filter(Boolean);

        if (headings.length === 0) {
            return;
        }

        // Make headings focus-targetable post-click without putting them
        // in the tab order. Screen readers land here after smooth-scroll.
        headings.forEach((h) => {
            if (!h.hasAttribute('tabindex')) {
                h.setAttribute('tabindex', '-1');
            }
        });

        // Tracks which heading ids are currently inside the rootMargin band.
        // We deliberately do NOT cache boundingClientRect here — those values
        // go stale as the user keeps scrolling without new IO events firing.
        // Document order (== toc array order) is the source of truth for
        // "topmost currently intersecting".
        const intersecting = new Set();

        const pickTopmost = () => {
            if (intersecting.size === 0) return;
            const topmost = toc.find((item) => intersecting.has(item.id));
            if (topmost) setActiveId(topmost.id);
        };

        const observer = new IntersectionObserver(
            (entries) => {
                if (clickLockRef.current) return;
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        intersecting.add(entry.target.id);
                    } else {
                        intersecting.delete(entry.target.id);
                    }
                });
                pickTopmost();
            },
            { rootMargin: ROOT_MARGIN, threshold: 0 }
        );

        headings.forEach((h) => observer.observe(h));

        // Deep-link: if URL has a hash matching a heading, prime active state.
        const hash = window.location.hash.replace('#', '');
        if (hash && toc.some((t) => t.id === hash)) {
            setActiveId(hash);
        }

        return () => {
            observer.disconnect();
            if (clickLockTimerRef.current) {
                clearTimeout(clickLockTimerRef.current);
            }
        };
    }, [toc, contentRef]);

    const handleClick = (e, id) => {
        e.preventDefault();
        const target = document.getElementById(id);
        if (!target) return;

        // Optimistically set active so the rail updates instantly, then
        // suppress IO updates until the smooth-scroll settles (~600ms).
        setActiveId(id);
        clickLockRef.current = true;
        if (clickLockTimerRef.current) clearTimeout(clickLockTimerRef.current);
        clickLockTimerRef.current = setTimeout(() => {
            clickLockRef.current = false;
        }, 700);

        // CSS `scroll-behavior: smooth` does NOT short-circuit the explicit
        // JS `behavior: 'smooth'` argument, so honor reduced-motion here too.
        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        target.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'start' });
        // replaceState (not pushState): we don't want every TOC click to
        // pollute browser history. Sharable, back-button-friendly.
        window.history.replaceState(null, '', `#${id}`);

        // Move focus without re-scrolling — assistive tech reads the heading.
        target.focus({ preventScroll: true });
    };

    if (!toc || toc.length === 0) {
        return null;
    }

    return (
        <nav className="blogpost-toc" aria-label="Table of contents">
            <p className="blogpost-toc-label">On this page</p>
            <ol className="blogpost-toc-list">
                {toc.map((item) => {
                    const isActive = item.id === activeId;
                    return (
                        <li
                            key={item.id}
                            className={isActive ? 'blogpost-toc-item is-active' : 'blogpost-toc-item'}
                        >
                            <a
                                href={`#${item.id}`}
                                onClick={(e) => handleClick(e, item.id)}
                                aria-current={isActive ? 'location' : undefined}
                            >
                                {item.text}
                            </a>
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}

export default BlogPostTOC;

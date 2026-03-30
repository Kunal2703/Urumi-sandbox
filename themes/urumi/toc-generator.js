/**
 * Urumi Table of Contents Generator
 * Auto-generates TOC from H2 and H3 headings in blog posts
 * Author: Urumi.ai
 */

document.addEventListener('DOMContentLoaded', function() {
    const tocContainer = document.getElementById('urumi-toc-container');

    // Only run on single blog posts
    if (!tocContainer) {
        return;
    }

    // Find the post content area - try multiple selectors
    let contentArea = document.querySelector('.wp-block-post-content');
    if (!contentArea) {
        contentArea = document.querySelector('article .entry-content');
    }
    if (!contentArea) {
        contentArea = document.querySelector('main');
    }
    if (!contentArea) {
        return;
    }

    // Get all H2 and H3 headings from the post content
    const headings = contentArea.querySelectorAll('h2, h3');

    if (headings.length === 0) {
        tocContainer.innerHTML = '<p style="color: #94a3b8; font-size: 0.9rem;">No headings found</p>';
        return;
    }

    // Generate TOC HTML
    let tocHTML = '<nav class="toc-nav" aria-label="Table of Contents"><ul class="toc-list">';
    let currentH2 = null;

    headings.forEach((heading, index) => {
        const headingText = heading.textContent.trim();
        const headingId = 'toc-section-' + index;

        // Add ID to heading for anchor linking
        heading.id = headingId;

        if (heading.tagName === 'H2') {
            // Close previous H2's sub-list if exists
            if (currentH2 !== null) {
                tocHTML += '</ul></li>';
            }

            tocHTML += `
                <li class="toc-item toc-h2">
                    <a href="#${headingId}" class="toc-link" data-target="${headingId}">
                        ${headingText}
                    </a>
                    <ul class="toc-sublist">
            `;
            currentH2 = index;

        } else if (heading.tagName === 'H3') {
            tocHTML += `
                <li class="toc-item toc-h3">
                    <a href="#${headingId}" class="toc-link" data-target="${headingId}">
                        ${headingText}
                    </a>
                </li>
            `;
        }
    });

    // Close final H2 section if exists
    if (currentH2 !== null) {
        tocHTML += '</ul></li>';
    }

    tocHTML += '</ul></nav>';

    tocContainer.innerHTML = tocHTML;

    // Add smooth scroll behavior
    const tocLinks = tocContainer.querySelectorAll('.toc-link');
    tocLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('data-target');
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                // Remove active class from all links
                tocLinks.forEach(l => l.classList.remove('active'));
                // Add active class to clicked link
                this.classList.add('active');

                // Smooth scroll to target
                const offsetTop = targetElement.getBoundingClientRect().top + window.pageYOffset - 100;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Highlight active section on scroll
    let isScrolling = false;
    window.addEventListener('scroll', function() {
        if (!isScrolling) {
            window.requestAnimationFrame(function() {
                updateActiveLink();
                isScrolling = false;
            });
            isScrolling = true;
        }
    });

    function updateActiveLink() {
        const scrollPos = window.pageYOffset + 150;

        headings.forEach((heading) => {
            const headingTop = heading.offsetTop;
            const headingBottom = headingTop + heading.offsetHeight;
            const headingId = heading.id;

            if (scrollPos >= headingTop && scrollPos < headingBottom) {
                tocLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('data-target') === headingId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // Set first item as active initially
    if (tocLinks.length > 0) {
        tocLinks[0].classList.add('active');
    }
});

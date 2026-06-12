<?php
/**
 * SSR TOC — Table-of-contents extraction for blog posts.
 *
 * Server-side authority for heading slugs. A single DOMDocument pass over
 * the post's rendered HTML does two things at once:
 *
 *   1. Injects stable id="toc-…" attributes on every eligible <h2>
 *   2. Returns the heading list so PHP and React render identical anchors
 *
 * "Eligible" means: not nested inside <pre>, <code>, or <blockquote>, and
 * not empty after stripping tags. If the author has set a Gutenberg HTML
 * anchor (an existing id on the <h2>), it is respected — the generated
 * slug becomes that id, so externally-shared fragments do not break the
 * day an author adds an anchor.
 *
 * Renaming a heading WILL break #fragment links pointed at the old slug.
 * That is a known trade-off; the workaround is the Gutenberg HTML anchor
 * field, which gives authors a stable id independent of the heading text.
 *
 * @package React_WooCommerce_Headless
 * @author Urumi.ai
 */

if (!defined('ABSPATH')) {
    exit;
}

class React_SSR_Toc {

    /**
     * Threshold below which we suppress the TOC entirely. Short posts
     * gain nothing from a sidebar; this matches Stripe Press / MDN.
     */
    const MIN_HEADINGS = 3;

    /**
     * Process rendered post HTML: inject heading ids and extract a TOC list.
     *
     * @param string $html Already-filtered post content (post-apply_filters).
     * @return array {
     *     @type string $html Rewritten HTML with id="toc-…" on eligible H2s.
     *     @type array  $toc  List of ['id' => string, 'text' => string].
     * }
     */
    public static function process($html) {
        if (!is_string($html) || $html === '') {
            return array('html' => (string) $html, 'toc' => array());
        }

        // libxml has no native UTF-8 awareness — round-trip through numeric
        // entities so multibyte chars survive load/save intact. mbstring is
        // a WP-recommended extension but not strictly required; if it's
        // missing, degrade silently (no TOC > broken page).
        if (!function_exists('mb_convert_encoding')) {
            return array('html' => $html, 'toc' => array());
        }
        $encoded = mb_convert_encoding($html, 'HTML-ENTITIES', 'UTF-8');

        $previous = libxml_use_internal_errors(true);
        $dom = new DOMDocument('1.0', 'UTF-8');
        // NOIMPLIED/NODEFDTD prevents libxml from wrapping the fragment in
        // <html><body>; we get the bare nodes back at serialization.
        $loaded = $dom->loadHTML(
            '<?xml encoding="UTF-8"?>' . $encoded,
            LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD
        );
        libxml_clear_errors();
        libxml_use_internal_errors($previous);

        if (!$loaded) {
            return array('html' => $html, 'toc' => array());
        }

        $toc = array();
        $seen = array();
        $headings = $dom->getElementsByTagName('h2');

        // Snapshot to a static array first — modifying DOM during iteration
        // of a live NodeList is a recipe for skipped nodes.
        $h2_nodes = array();
        foreach ($headings as $node) {
            $h2_nodes[] = $node;
        }

        foreach ($h2_nodes as $h2) {
            if (self::is_inside_excluded($h2)) {
                continue;
            }

            $text = trim(wp_strip_all_tags($dom->saveHTML($h2)));
            // saveHTML($h2) includes the <h2>…</h2> wrap; strip_all_tags
            // already removed those, but normalize whitespace too.
            $text = preg_replace('/\s+/', ' ', $text);

            if ($text === '') {
                continue;
            }

            $existing_id = $h2->getAttribute('id');
            if ($existing_id !== '') {
                // Honor author-set Gutenberg HTML anchor as-is. Still register
                // it in the seen-set so generated slugs don't collide later.
                $id = $existing_id;
            } else {
                $id = self::slugify($text);
                if ($id === '') {
                    continue;
                }
                $id = 'toc-' . $id;
                // Dedupe deterministically: -2, -3, …
                $base = $id;
                $i = 2;
                while (isset($seen[$id])) {
                    $id = $base . '-' . $i++;
                }
                $h2->setAttribute('id', $id);
            }

            $seen[$id] = true;
            $toc[] = array(
                'id' => $id,
                'text' => $text,
            );
        }

        if (empty($toc)) {
            return array('html' => $html, 'toc' => array());
        }

        // Serialize children only — we used NOIMPLIED so the document IS
        // the fragment, but saveHTML() on the document still emits the
        // XML processing instruction we prepended. Walk children and
        // serialize each to be safe.
        $out = '';
        foreach ($dom->childNodes as $child) {
            // Skip the XML processing instruction we injected.
            if ($child->nodeType === XML_PI_NODE) {
                continue;
            }
            $out .= $dom->saveHTML($child);
        }

        return array(
            'html' => $out !== '' ? $out : $html,
            'toc'  => $toc,
        );
    }

    /**
     * Returns true if the node is nested inside an element where a heading
     * shouldn't be advertised as a TOC entry (code samples, quoted asides).
     */
    private static function is_inside_excluded(DOMNode $node) {
        $excluded = array('pre', 'code', 'blockquote');
        $parent = $node->parentNode;
        while ($parent && $parent->nodeType === XML_ELEMENT_NODE) {
            if (in_array(strtolower($parent->nodeName), $excluded, true)) {
                return true;
            }
            $parent = $parent->parentNode;
        }
        return false;
    }

    /**
     * Slugify heading text. Uses WP core primitives — never roll your own.
     * remove_accents() folds Unicode to ASCII; sanitize_title_with_dashes()
     * lowercases and collapses to a CSS-/URL-safe slug.
     */
    private static function slugify($text) {
        $plain = remove_accents($text);
        return sanitize_title_with_dashes($plain, '', 'save');
    }
}

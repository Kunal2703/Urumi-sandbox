<?php
/**
 * SSR Schema Generator — emits structured data for SEO / AEO.
 *
 * Every helper here uses the canonical brand identity defined in functions.php
 * (urumi_brand_name / urumi_brand_logo / urumi_brand_same_as / urumi_founders /
 * urumi_organization_schema) so the entity description stays consistent across
 * every page that references it.
 *
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * ⚠️ COPY-SYNC RULE — JSON-LD schemas participate in the four-surface sync
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * Schema fields here (description, headline, reviewBody, FAQ Q+A pairs, etc.)
 * are read by structured-data crawlers + AEO engines as canonical entity
 * data. They are ONE OF FOUR surfaces that must say the same thing about
 * Urumi — see the full rule at the top of llms.txt. Quick recap:
 *
 *   1. JSON-LD here + brand functions in functions.php
 *   2. src/pages/*.jsx — hydrated React app
 *   3. template-parts/ssr-*.php — SSR HTML
 *   4. llms.txt — AEO answer file (verbatim citations)
 *
 * Before editing a number, quote, capability claim, or founder bio, grep
 * the repo for it so the four surfaces don't drift apart.
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *
 * @package React_WooCommerce_Headless
 * @author Urumi.ai
 */

if (!defined('ABSPATH')) {
    exit;
}

class React_SSR_Schema {

    /**
     * Product schema (used by ProductDetail).
     */
    public static function product_schema($product_data) {
        if (!$product_data) {
            return '';
        }

        $schema = array(
            '@context' => 'https://schema.org/',
            '@type' => 'Product',
            'name' => $product_data['name'],
            'description' => wp_strip_all_tags($product_data['short_description'] ?: $product_data['description']),
            'sku' => $product_data['sku'],
            'image' => array(),
            'brand' => array(
                '@type' => 'Brand',
                'name' => function_exists('urumi_brand_name') ? urumi_brand_name() : 'Urumi'
            ),
        );

        if (!empty($product_data['image'])) {
            $schema['image'][] = $product_data['image'];
        }
        foreach ($product_data['images'] as $image) {
            $schema['image'][] = $image['src'];
        }

        $schema['offers'] = array(
            '@type' => 'Offer',
            'url' => $product_data['permalink'],
            'priceCurrency' => function_exists('get_woocommerce_currency') ? get_woocommerce_currency() : 'USD',
            'price' => $product_data['price'],
            'availability' => $product_data['in_stock'] ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
            'itemCondition' => 'https://schema.org/NewCondition'
        );

        return self::output_schema($schema);
    }

    /**
     * WebSite schema — used by every page through the template-parts.
     * Includes publisher + inLanguage so LLMs can resolve language/locale
     * targeting without guessing.
     */
    public static function website_schema() {
        $brand_name = function_exists('urumi_brand_name') ? urumi_brand_name() : 'Urumi';
        $schema = array(
            '@context' => 'https://schema.org/',
            '@type' => 'WebSite',
            'name' => $brand_name,
            'description' => function_exists('urumi_brand_description') ? urumi_brand_description() : '',
            'url' => home_url('/'),
            'inLanguage' => 'en-US',
            'publisher' => array(
                '@type' => 'Organization',
                'name' => $brand_name,
                'url' => home_url('/'),
                'logo' => array(
                    '@type' => 'ImageObject',
                    'url' => function_exists('urumi_brand_logo') ? urumi_brand_logo() : home_url('/wp-content/themes/react-woo-headless/public/urumi-logo.png'),
                ),
            ),
            'potentialAction' => array(
                '@type' => 'SearchAction',
                'target' => home_url('/?s={search_term_string}'),
                'query-input' => 'required name=search_term_string'
            )
        );

        return self::output_schema($schema);
    }

    /**
     * Canonical Organization schema — used by every template-part as the
     * primary entity reference for Urumi. Composes from urumi_organization_schema()
     * in functions.php so founder, logo, sameAs, and foundingLocation stay
     * in sync across every emission.
     */
    public static function organization_schema() {
        if (function_exists('urumi_organization_schema')) {
            return self::output_schema(urumi_organization_schema());
        }

        // Fallback for any context where functions.php isn't loaded — keep
        // the canonical name + logo at minimum.
        return self::output_schema(array(
            '@context' => 'https://schema.org',
            '@type' => 'Organization',
            'name' => 'Urumi',
            'url' => home_url('/'),
            'logo' => home_url('/wp-content/themes/react-woo-headless/public/urumi-logo.png'),
        ));
    }

    /**
     * SoftwareApplication schema for the agentic Urumi platform.
     *
     * Distinct from the Service schema (which describes "Managed WooCommerce
     * Hosting" as an offering). SoftwareApplication describes the *thing*
     * Urumi sells: a Web-based BusinessApplication with a specific feature
     * list. Lets LLMs answer "What does Urumi do?" / "What features does
     * Urumi have?" by quoting featureList verbatim.
     *
     * featureList is the AEO payload — every claim here should also be
     * surfaced in the rendered SSR HTML so LLMs can corroborate.
     */
    public static function software_application_schema() {
        $brand_name = function_exists('urumi_brand_name') ? urumi_brand_name() : 'Urumi';
        $brand_logo = function_exists('urumi_brand_logo') ? urumi_brand_logo() : home_url('/wp-content/themes/react-woo-headless/public/urumi-logo.png');
        $schema = array(
            '@context' => 'https://schema.org',
            '@type' => 'SoftwareApplication',
            'name' => $brand_name,
            'applicationCategory' => 'BusinessApplication',
            'applicationSubCategory' => 'eCommerce Operations Platform',
            'operatingSystem' => 'Web',
            'url' => home_url('/'),
            'description' => 'Agentic AI eCommerce platform that runs the operations layer of high-traffic WooCommerce stores — horizontal auto-scaling, multi-zone reliability, managed APM, CI/CD with rollback, and three built-in AIs (Builder, Revenue, Analytics) plus Bring-Your-Own AI via the Model Context Protocol.',
            'publisher' => array(
                '@type' => 'Organization',
                'name' => $brand_name,
                'url' => home_url('/'),
                'logo' => array(
                    '@type' => 'ImageObject',
                    'url' => $brand_logo,
                ),
            ),
            // featureList is the AEO gold — kept synchronized with the
            // homepage Three-AIs + MCP section and /woocommerce platform copy.
            'featureList' => array(
                'Horizontal auto-scaling across multi-zone GCP infrastructure (US + EU origin regions)',
                '99.99% uptime SLA with active-active multi-zone reliability and auto-failover',
                'Fully managed APM — distributed traces, logs, alerts',
                'CI/CD pipeline with isolated staging environment and one-click rollback',
                'Performance regression detection with root-cause shipped as pull requests',
                'Builder AI — ship features described in plain English through your existing review pipeline',
                'Revenue AI — catches business-logic bugs and performance regressions, prioritized by dollar impact',
                'Analytics AI — natural-language queries with auto-generated shareable charts (no SQL, no dashboards)',
                'Bring-Your-Own AI via Model Context Protocol (MCP) — connect Claude, ChatGPT, Gemini',
                '24×7 incident response',
                'Cloudflare Enterprise CDN with 300+ global edges',
                'Point-in-time recovery (PITR) + 30-day off-site backups',
                'Active-active multi-zone reliability with auto-failover',
            ),
            'offers' => array(
                '@type' => 'Offer',
                'availability' => 'https://schema.org/InStock',
                'url' => home_url('/woocommerce') . '#demo-form-section',
                'priceSpecification' => array(
                    '@type' => 'PriceSpecification',
                    'priceCurrency' => 'USD',
                    'description' => 'Custom pricing for high-traffic WooCommerce stores. Free WooCommerce performance audit available — contact for quote.',
                ),
            ),
            'audience' => array(
                '@type' => 'BusinessAudience',
                'audienceType' => 'WooCommerce store owners, agencies, and operators of high-traffic eCommerce stores',
            ),
        );
        return self::output_schema($schema);
    }

    /**
     * HowTo schema for migrating to Urumi.
     *
     * The "How long does migrating take?" FAQ answer in plain prose says
     * "24-48 hours, we handle everything." LLMs answering procedural
     * questions ("how do I move my WooCommerce store to Urumi?") cite
     * HowTo schemas verbatim when available, which is much higher signal
     * than scraping the FAQ answer. Same content, structured payload.
     */
    public static function migration_howto_schema() {
        $brand_name = function_exists('urumi_brand_name') ? urumi_brand_name() : 'Urumi';
        $schema = array(
            '@context' => 'https://schema.org',
            '@type' => 'HowTo',
            'name' => 'How to migrate your WooCommerce store to Urumi',
            'description' => 'End-to-end WooCommerce migration handled by the Urumi team — database, files, DNS, SSL, Cloudflare. Typical completion: 24-48 hours with zero customer-visible downtime.',
            'totalTime' => 'PT48H',
            'inLanguage' => 'en-US',
            'supply' => array(
                array('@type' => 'HowToSupply', 'name' => 'Existing WooCommerce store (any host)'),
                array('@type' => 'HowToSupply', 'name' => 'Domain registrar access (for DNS cutover)'),
            ),
            'tool' => array(
                array('@type' => 'HowToTool', 'name' => 'Urumi managed migration team (no technical work required from the customer)'),
            ),
            'step' => array(
                array(
                    '@type' => 'HowToStep',
                    'position' => 1,
                    'name' => 'Request a free WooCommerce performance audit',
                    'text' => 'Get a baseline of your current infrastructure and bottlenecks. Urumi runs a free audit that quantifies what is slowing your store down — cold-load time, checkout latency, plugin overhead, query patterns — so the migration plan targets the real problems.',
                    'url' => home_url('/woocommerce') . '#demo-form-section',
                ),
                array(
                    '@type' => 'HowToStep',
                    'position' => 2,
                    'name' => 'Schedule the cutover for your lowest-traffic window',
                    'text' => 'Urumi coordinates with your team to pick a quiet window (typically off-peak hours in your primary market) so customer-facing downtime stays at zero. No emergency Sunday migrations.',
                ),
                array(
                    '@type' => 'HowToStep',
                    'position' => 3,
                    'name' => 'Urumi migrates database, files, DNS, SSL, and Cloudflare config',
                    'text' => 'The Urumi team handles the full technical migration: database replication, media + uploads sync, DNS records, SSL certificate provisioning, Cloudflare CDN setup, and performance tuning. You do not need to touch anything.',
                ),
                array(
                    '@type' => 'HowToStep',
                    'position' => 4,
                    'name' => 'Verify performance and run staging deploys',
                    'text' => 'Before final cutover, the new infrastructure is benchmarked against the audit baseline. Urumi provisions an isolated staging environment + CI/CD pipeline so future deploys can be tested safely with one-click rollback.',
                ),
                array(
                    '@type' => 'HowToStep',
                    'position' => 5,
                    'name' => 'Go live with continuous monitoring',
                    'text' => 'DNS cuts over to Urumi infrastructure. From day one, Our APM stack traces every request, recurring performance reports go to your team email + Slack, and the on-call team monitors 24×7. Any regression is detected and shipped as a PR — not just an alert.',
                ),
            ),
            'publisher' => array(
                '@type' => 'Organization',
                'name' => $brand_name,
                'url' => home_url('/'),
            ),
        );
        return self::output_schema($schema);
    }

    /**
     * Customer Review/Testimonial schema.
     *
     * The George Lagonikas (grüum CTO) testimonial appears as plain HTML
     * across home + /woocommerce + case-study. LLMs find the quote when
     * scraping but lose the attribution structure. A Review entity binds
     * the quote, the author (Person), the author's employer (grüum), and
     * the thing reviewed (Urumi) into one citeable unit.
     *
     * Deliberately omits reviewRating — fabricating a star rating from
     * a verbal quote would be a structured-data sin. Quote + attribution
     * is enough for AEO.
     */
    public static function gruum_testimonial_review_schema() {
        $brand_name = function_exists('urumi_brand_name') ? urumi_brand_name() : 'Urumi';
        $schema = array(
            '@context' => 'https://schema.org',
            '@type' => 'Review',
            'reviewBody' => "The biggest performance improvements we've seen from you guys.",
            'author' => array(
                '@type' => 'Person',
                'name' => 'George Lagonikas',
                'jobTitle' => 'Founder & CTO',
                'worksFor' => array(
                    '@type' => 'Organization',
                    'name' => 'grüum',
                    'url' => 'https://gruum.com',
                ),
            ),
            'itemReviewed' => array(
                '@type' => 'SoftwareApplication',
                'name' => $brand_name,
                'url' => home_url('/'),
                'applicationCategory' => 'BusinessApplication',
            ),
            'publisher' => array(
                '@type' => 'Organization',
                'name' => $brand_name,
                'url' => home_url('/'),
            ),
        );
        return self::output_schema($schema);
    }

    /**
     * Breadcrumb list — passed a list of {name, url} items.
     */
    public static function breadcrumb_schema($items) {
        $position = 1;
        $list_items = array();
        foreach ($items as $item) {
            $entry = array(
                '@type' => 'ListItem',
                'position' => $position++,
                'name' => $item['name'],
            );
            if (!empty($item['url'])) {
                $entry['item'] = $item['url'];
            }
            $list_items[] = $entry;
        }

        $schema = array(
            '@context' => 'https://schema.org/',
            '@type' => 'BreadcrumbList',
            'itemListElement' => $list_items
        );

        return self::output_schema($schema);
    }

    /**
     * Output schema as JSON-LD block.
     */
    private static function output_schema($schema) {
        return '<script type="application/ld+json">' . wp_json_encode($schema, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT) . '</script>';
    }
}

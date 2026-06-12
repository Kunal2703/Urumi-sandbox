/**
 * DSFaqAccordion — native <details>/<summary> accordion for the FAQ
 * section on /woocommerce.
 *
 * Native elements give us free keyboard + screen-reader support and
 * "click to toggle" behavior with no JS. We add only the visual chrome
 * (arrow rotation, padding, border).
 *
 * The FAQ JSON-LD schema is rendered server-side in the SSR template
 * (FAQPage schema with each Q→A pair). The visible accordion here is
 * the visual surface — it doesn't need to ship the schema.
 *
 * Pattern (items prop):
 *   { question, answer }
 */

import './DSFaqAccordion.css';

export default function DSFaqAccordion({ items = [] }) {
    return (
        <div className="ds-faq">
            {items.map((item, i) => (
                <details key={i} className="ds-faq__item">
                    <summary className="ds-faq__q">
                        <span className="ds-faq__q-text">{item.question}</span>
                        <span className="ds-faq__q-arrow" aria-hidden="true">
                            <svg viewBox="0 0 14 14" width="14" height="14">
                                <path
                                    d="M3.5 5.5L7 9l3.5-3.5"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </span>
                    </summary>
                    <div className="ds-faq__a">{item.answer}</div>
                </details>
            ))}
        </div>
    );
}

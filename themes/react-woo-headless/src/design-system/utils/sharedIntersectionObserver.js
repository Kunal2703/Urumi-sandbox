/**
 * Shared IntersectionObserver pool.
 *
 * Previously each DSReveal used framer-motion's `whileInView`, which
 * creates one IntersectionObserver per motion component. A page like
 * Vision has 50+ reveals — that's 50+ observers, each running their
 * own scroll calculations.
 *
 * This module hands out shared observers keyed by their options
 * (rootMargin + threshold). Two elements that want the same
 * viewport margin share one observer. Most reveals across the site
 * use the same options, so in practice the whole page collapses to
 * 1-2 observers total.
 *
 * Usage:
 *   const unobserve = observeOnce(element, () => setVisible(true), {
 *     rootMargin: '0px 0px -10% 0px',
 *     threshold: 0,
 *   });
 *   // call unobserve() in cleanup
 */

const pools = new Map(); // key → { observer, callbacks: Map<Element, Set<fn>> }

const keyFor = ({ rootMargin = '0px', threshold = 0 } = {}) => {
  const t = Array.isArray(threshold) ? threshold.join(',') : String(threshold);
  return `${rootMargin}|${t}`;
};

const getPool = (options) => {
  const key = keyFor(options);
  let pool = pools.get(key);
  if (pool) return pool;

  const callbacks = new Map();
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      const fns = callbacks.get(entry.target);
      if (!fns) continue;
      for (const fn of fns) fn(entry);
    }
  }, options);

  pool = { observer, callbacks };
  pools.set(key, pool);
  return pool;
};

/**
 * Observe an element with a callback. Returns an unobserve function
 * that releases this specific callback. The underlying observer
 * keeps watching the element until all its callbacks are released.
 */
export function observe(element, callback, options) {
  if (!element) return () => {};
  const pool = getPool(options);
  let fns = pool.callbacks.get(element);
  if (!fns) {
    fns = new Set();
    pool.callbacks.set(element, fns);
    pool.observer.observe(element);
  }
  fns.add(callback);

  return () => {
    const stillThere = pool.callbacks.get(element);
    if (!stillThere) return;
    stillThere.delete(callback);
    if (stillThere.size === 0) {
      pool.callbacks.delete(element);
      pool.observer.unobserve(element);
    }
  };
}

/**
 * Observe once — fires the callback the first time element intersects,
 * then auto-unobserves. Mirrors framer-motion's `viewport={{ once: true }}`.
 */
export function observeOnce(element, callback, options) {
  if (!element) return () => {};
  const unobserve = observe(
    element,
    (entry) => {
      if (entry.isIntersecting) {
        callback(entry);
        unobserve();
      }
    },
    options
  );
  return unobserve;
}

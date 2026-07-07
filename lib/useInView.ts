"use client";

import { useEffect, useState } from "react";

/**
 * One-shot scroll reveal: returns `[setRef, visible]`.
 *
 *   const [setRef, visible] = useInView();
 *   <div ref={setRef} style={revealStyle(visible)} />
 *
 * `setRef` is a **callback ref** (backed by state), not a ref object. That is
 * the key difference from a `useRef`-based version: the observed node lives in
 * state, so when the element actually attaches — including elements that mount
 * later because they're conditionally rendered (`{cond && <div ref={setRef}>}`)
 * or swapped in on resize — React re-runs the effect and the observer gets
 * created against the real node. A plain-ref version only sees `ref.current`
 * at its first effect run (null for a not-yet-mounted element) and never
 * re-checks, which leaves such elements stuck at `opacity: 0` forever.
 *
 * `setRef` is the stable `useState` setter, so React attaches it once (it is
 * not re-invoked every render), and the dependency array is complete — no
 * per-render observer churn.
 *
 * To attach it to an element you already track with a ref (for measurement,
 * etc.), merge them inline:
 *   ref={(el) => { measureRef.current = el; setRef(el); }}
 */
export function useInView(
  threshold = 0.15
): [(node: Element | null) => void, boolean] {
  const [visible, setVisible] = useState(false);
  const [node, setNode] = useState<Element | null>(null);

  useEffect(() => {
    if (!node || visible) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold, rootMargin: "0px 0px -10% 0px" }
    );
    io.observe(node);
    return () => io.disconnect();
  }, [node, threshold, visible]);

  return [setNode, visible];
}

/** Fade + slight rise, gated by `visible`. Transform-only — safe to spread
 * onto elements that are themselves the containing block for absolutely
 * positioned children (a `transform` on a *new wrapping* element would
 * break that; applying it to the element that already owns the relative
 * positioning does not). */
export function revealStyle(
  visible: boolean,
  delayMs = 0
): React.CSSProperties {
  return {
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(18px)",
    transition: `opacity .6s ease ${delayMs}ms, transform .6s ease ${delayMs}ms`,
  };
}

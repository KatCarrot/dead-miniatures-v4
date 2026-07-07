"use client";

import { useEffect, useState, type RefObject } from "react";

/**
 * True once the given element has entered the viewport — then stays true
 * (one-shot reveal, not a scroll-spy). Takes an existing ref so callers that
 * already track the element for something else (measurement, etc.) don't
 * need a second one.
 */
export function useInView(
  ref: RefObject<Element | null>,
  threshold = 0.15
): boolean {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold, rootMargin: "0px 0px -10% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, threshold]);

  return visible;
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

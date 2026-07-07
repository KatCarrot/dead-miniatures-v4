"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * Soft fade-in on route change instead of Next's hard content swap.
 * Opacity-only (no transform) — a transform here would become the
 * containing block for any `position: fixed` descendant (e.g. the mobile
 * menu overlay in SiteHeader), which would break its positioning.
 */
export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(false);
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, [pathname]);

  return (
    <div style={{ opacity: visible ? 1 : 0, transition: "opacity .25s ease" }}>
      {children}
    </div>
  );
}

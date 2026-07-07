"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { HEADER_CATEGORIES } from "@/config/categories";

type Props = {
  /** "home" enables smooth in-page scroll for About/Contacts; "inner" links back to /#about etc. */
  variant?: "home" | "inner";
};

const navLinkStyle: React.CSSProperties = {
  color: "var(--text)",
  textDecoration: "none",
  fontSize: 14,
  fontFamily: "var(--font-sf)",
  textTransform: "uppercase",
  letterSpacing: "0.04em",
};

const barTransition =
  "transform .35s cubic-bezier(.4,0,.2,1), top .35s cubic-bezier(.4,0,.2,1), opacity .25s ease, background .25s ease";

function menuItemStyle(color: string): React.CSSProperties {
  return {
    color,
    textDecoration: "none",
    fontSize: "clamp(16px, 3.4vh, 26px)",
    fontFamily: "var(--font-sf)",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
  };
}

export default function SiteHeader({ variant = "inner" }: Props) {
  const pathname = usePathname();
  const [mobile, setMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [headerH, setHeaderH] = useState(84);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const measure = () => {
      if (headerRef.current) setHeaderH(headerRef.current.offsetHeight);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [mobile]);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 900px)");
    const onMQ = () => {
      setMobile(mq.matches);
      setMenuOpen(false);
    };
    onMQ();
    mq.addEventListener("change", onMQ);
    return () => mq.removeEventListener("change", onMQ);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const smoothScroll = (id: string) => (e: React.MouseEvent) => {
    setMenuOpen(false);
    if (variant !== "home") return; // inner pages: let the Link navigate to /#id
    const el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    const header = document.querySelector("header");
    const offset = header ? (header as HTMLElement).offsetHeight : 80;
    window.scrollTo({
      top: el.getBoundingClientRect().top + window.scrollY - offset,
      behavior: "smooth",
    });
  };

  const aboutHref = variant === "home" ? "#about" : "/#about";
  const contactsHref = variant === "home" ? "#contacts" : "/#contacts";

  // Already on /showcase: Next's client-side Link nav updates the URL via
  // history.pushState, which never fires "hashchange" — so GalleryView's tab
  // state wouldn't update. Set location.hash directly instead; that always
  // fires a real hashchange (no reload, no scroll — nothing has that id).
  // Navigating in from another page still works, since GalleryView reads the
  // hash straight off window.location on mount.
  const categoryClick = (key: string) => (e: React.MouseEvent) => {
    if (pathname === "/showcase") {
      e.preventDefault();
      window.location.hash = key;
    }
  };

  const barBase: React.CSSProperties = {
    position: "absolute",
    left: 12,
    right: 12,
    height: 2,
    borderRadius: 1,
    background: menuOpen ? "var(--accent)" : "var(--text)",
    transition: barTransition,
  };

  return (
    <>
    <header
      ref={headerRef}
      style={{
        position: "sticky",
        top: 0,
        zIndex: menuOpen ? 63 : 50,
        background: menuOpen ? "var(--card)" : (scrolled ? "rgba(25,32,34,0.4)" : "transparent"),
        backdropFilter: menuOpen ? "none" : (scrolled ? "blur(18px)" : "none"),
        WebkitBackdropFilter: menuOpen ? "none" : (scrolled ? "blur(18px)" : "none"),
        boxShadow: (menuOpen || !scrolled) ? "none" : "0 1px 0 rgba(255,255,255,0.08)",
        transition: "background .25s ease, box-shadow .25s ease",
      }}
    >
      <nav
        style={{
          position: "relative",
          zIndex: 6,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: mobile ? "6px clamp(20px,6vw,112px)" : "0 clamp(20px,6vw,112px)",
          maxWidth: 1432,
          margin: "0 auto -20px",
          width: "100%",
        }}
      >
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            flexShrink: 0,
          }}
        >
          <div
            style={
              mobile
                ? {
                    width: 77,
                    height: 67,
                    background:
                      "url('/brand/dead-logo.webp') left center/contain no-repeat",
                  }
                : {
                    width: 111,
                    height: 100,
                    background:
                      "url('/brand/dead-logo.webp') left center/contain no-repeat",
                  }
            }
          />
        </Link>

        {!mobile && (
          <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
            <div
              style={{
                position: "relative",
                alignSelf: "center",
                paddingBottom: 28,
                marginBottom: -28,
              }}
              onMouseEnter={() => setNavOpen(true)}
              onMouseLeave={() => setNavOpen(false)}
            >
              <Link
                href="/showcase"
                className={navOpen ? "nav-link nav-link-open" : "nav-link"}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  ...navLinkStyle,
                }}
              >
                Miniatures
                <span
                  style={{
                    display: "inline-block",
                    width: 7,
                    height: 7,
                    borderRight: "1.5px solid currentColor",
                    borderBottom: "1.5px solid currentColor",
                    transform: "rotate(45deg) translateY(-2px)",
                  }}
                />
              </Link>
              {navOpen && (
                <div
                  style={{
                    position: "absolute",
                    left: -20,
                    top: 24,
                    minWidth: 200,
                    background: "var(--card)",
                    padding: "11px 20px",
                    display: "flex",
                    flexDirection: "column",
                    zIndex: 9,
                    border: "1px solid rgba(60,64,67,0.6)",
                  }}
                >
                  {HEADER_CATEGORIES.map((c) => (
                    <Link
                      key={c.key}
                      href={`/showcase#${c.key}`}
                      onClick={categoryClick(c.key)}
                      className="nav-link"
                      style={{
                        display: "block",
                        padding: "7px 0",
                        ...navLinkStyle,
                      }}
                    >
                      {c.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <Link
              href={aboutHref}
              onClick={smoothScroll("about")}
              className="nav-link"
              style={navLinkStyle}
            >
              About me
            </Link>
            <a href="#" className="nav-link" style={navLinkStyle}>
              Services
            </a>
            <Link
              href={contactsHref}
              onClick={smoothScroll("contacts")}
              className="nav-link"
              style={navLinkStyle}
            >
              Contacts
            </Link>
          </div>
        )}

        {mobile && (
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Menu"
            style={{
              position: "relative",
              zIndex: 63,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              width: 44,
              height: 44,
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: 10,
            }}
            // stays above the open drawer (z-index 62) so the close (X) icon
            // remains visible/clickable while the menu is open
          >
            <span
              style={{
                ...barBase,
                top: menuOpen ? 21 : 15,
                transform: menuOpen ? "rotate(45deg)" : "rotate(0deg)",
              }}
            />
            <span style={{ ...barBase, top: 21, opacity: menuOpen ? 0 : 1 }} />
            <span
              style={{
                ...barBase,
                top: menuOpen ? 21 : 27,
                transform: menuOpen ? "rotate(-45deg)" : "rotate(0deg)",
              }}
            />
          </button>
        )}
      </nav>
    </header>

      {menuOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: "100%",
            background: "var(--card)",
            zIndex: 62,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "clamp(8px, 2.2vh, 34px)",
            padding: `${headerH + 16}px 24px clamp(16px,4vh,48px)`,
            overflowY: "auto",
          }}
        >
          <Link
            href="/showcase"
            onClick={() => setMenuOpen(false)}
            style={menuItemStyle("var(--text)")}
          >
            Miniatures
          </Link>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "clamp(8px, 2.2vh, 34px)",
            }}
          >
            {HEADER_CATEGORIES.map((c) => (
              <Link
                key={c.key}
                href={`/showcase#${c.key}`}
                onClick={(e) => {
                  setMenuOpen(false);
                  categoryClick(c.key)(e);
                }}
                style={{
                  color: "var(--text-dim)",
                  textDecoration: "none",
                  fontSize: "clamp(16px, 3.4vh, 26px)",
                  fontFamily: "var(--font-sf)",
                  textTransform: "uppercase",
                  letterSpacing: "0.03em",
                }}
              >
                {c.label}
              </Link>
            ))}
          </div>
          <Link
            href={aboutHref}
            onClick={smoothScroll("about")}
            style={menuItemStyle("var(--text)")}
          >
            About me
          </Link>
          <a
            href="#"
            onClick={() => setMenuOpen(false)}
            style={menuItemStyle("var(--text)")}
          >
            Services
          </a>
          <Link
            href={contactsHref}
            onClick={smoothScroll("contacts")}
            style={menuItemStyle("var(--text)")}
          >
            Contacts
          </Link>
        </div>
      )}
    </>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
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
    fontSize: 17,
    fontFamily: "var(--font-sf)",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
    padding: "10px 0",
  };
}

export default function SiteHeader({ variant = "inner" }: Props) {
  const [mobile, setMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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
      style={{
        position: "sticky",
        top: 0,
        zIndex: menuOpen ? 61 : 50,
        background: scrolled ? "rgba(25,32,34,0.4)" : "transparent",
        backdropFilter: scrolled ? "blur(18px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(18px)" : "none",
        boxShadow: scrolled ? "0 1px 0 rgba(255,255,255,0.08)" : "none",
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
          padding: "0 clamp(20px,6vw,112px)",
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
            paddingBottom: 10,
          }}
        >
          <div
            style={{
              width: 85,
              height: 74,
              background:
                "url('/brand/dead-logo.png') left center/contain no-repeat",
            }}
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
              zIndex: 62,
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
        <>
          <div
            onClick={() => setMenuOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.55)",
              zIndex: 59,
            }}
          />
          <div
            style={{
              position: "fixed",
              top: 0,
              right: 0,
              bottom: 0,
              width: "80%",
              maxWidth: 340,
              background: "var(--card)",
              zIndex: 60,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 6,
              padding: "32px 24px 40px",
              overflowY: "auto",
              boxShadow: "-4px 0 32px rgba(0,0,0,0.5)",
            }}
          >
            <div
              style={{
                width: 110,
                height: 96,
                background:
                  "url('/brand/dead-logo.png') center/contain no-repeat",
                marginBottom: 20,
              }}
            />
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
                gap: 8,
                margin: "2px 0 14px",
              }}
            >
              {HEADER_CATEGORIES.map((c) => (
                <Link
                  key={c.key}
                  href={`/showcase#${c.key}`}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    color: "var(--text-dim)",
                    textDecoration: "none",
                    fontSize: 17,
                    fontFamily: "var(--font-sf)",
                    textTransform: "uppercase",
                    letterSpacing: "0.03em",
                    padding: "5px 0",
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
        </>
      )}
    </>
  );
}

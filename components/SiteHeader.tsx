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

export default function SiteHeader({ variant = "inner" }: Props) {
  const [mobile, setMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(false);

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

  const smoothScroll = (id: string) => (e: React.MouseEvent) => {
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
    setMenuOpen(false);
  };

  const aboutHref = variant === "home" ? "#about" : "/#about";
  const contactsHref = variant === "home" ? "#contacts" : "/#contacts";

  return (
    <header style={{ position: "sticky", top: 0, zIndex: 50 }}>
      <nav
        style={{
          position: "relative",
          zIndex: 6,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: mobile
            ? "6px clamp(20px,6vw,112px)"
            : "0 clamp(20px,6vw,112px)",
          maxWidth: 1432,
          margin: "0 auto",
          width: "100%",
        }}
      >
        <Link
          href="/"
          style={{ display: "flex", alignItems: "center", flexShrink: 0 }}
        >
          <div
            style={{
              width: 230,
              height: 128,
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
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: 5,
              width: 44,
              height: 44,
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: 10,
            }}
          >
            {!menuOpen ? (
              <>
                <span style={barStyle("var(--text)")} />
                <span style={barStyle("var(--text)")} />
                <span style={barStyle("var(--text)")} />
              </>
            ) : (
              <>
                <span
                  style={{
                    ...barStyle("var(--accent)"),
                    transform: "rotate(45deg) translateY(5px)",
                  }}
                />
                <span style={{ ...barStyle("var(--accent)"), opacity: 0 }} />
                <span
                  style={{
                    ...barStyle("var(--accent)"),
                    transform: "rotate(-45deg) translateY(-5px)",
                  }}
                />
              </>
            )}
          </button>
        )}
      </nav>

      {menuOpen && (
        <div
          style={{
            position: "relative",
            zIndex: 6,
            background: "var(--card)",
            display: "flex",
            flexDirection: "column",
            padding: "8px clamp(20px,6vw,92px)",
          }}
        >
          <Link href="/showcase" style={mobileItem("var(--accent)", true)}>
            Miniatures
          </Link>
          <Link
            href={aboutHref}
            onClick={smoothScroll("about")}
            style={mobileItem("var(--text)", true)}
          >
            About me
          </Link>
          <a href="#" style={mobileItem("var(--text)", true)}>
            Services
          </a>
          <Link
            href={contactsHref}
            onClick={smoothScroll("contacts")}
            style={mobileItem("var(--text)", false)}
          >
            Contacts
          </Link>
        </div>
      )}
    </header>
  );
}

function barStyle(bg: string): React.CSSProperties {
  return { display: "block", height: 2, width: "100%", background: bg };
}

function mobileItem(color: string, border: boolean): React.CSSProperties {
  return {
    color,
    textDecoration: "none",
    fontSize: 15,
    padding: "14px 0",
    borderBottom: border ? "1px solid rgba(255,255,255,0.1)" : "none",
  };
}

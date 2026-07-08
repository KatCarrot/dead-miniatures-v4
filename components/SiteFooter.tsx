"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const span: React.CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: 14,
  color: "var(--text-dim)",
};

const navLinkStyle: React.CSSProperties = {
  color: "var(--text)",
  textDecoration: "none",
  fontSize: 14,
  fontFamily: "var(--font-sf)",
  textTransform: "uppercase",
  letterSpacing: "0.04em",
  opacity: 0.6,
};

function socialIconStyle(src: string): React.CSSProperties {
  return {
    width: 18,
    height: 18,
    backgroundColor: "var(--text-dim)",
    WebkitMask: `url('${src}') no-repeat center/contain`,
    mask: `url('${src}') no-repeat center/contain`,
  };
}

export default function SiteFooter() {
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 900px)");
    const onMQ = () => setMobile(mq.matches);
    onMQ();
    mq.addEventListener("change", onMQ);
    return () => mq.removeEventListener("change", onMQ);
  }, []);

  return (
    <footer
      style={{
        position: "relative",
        zIndex: 1,
        borderTop: "1px solid var(--foot-line)",
      }}
    >
      <div
        style={{
          maxWidth: 1432,
          margin: "0 auto",
          padding: "8px clamp(20px,6vw,40px) 8px",
        }}
      >
        {/* logo + nav + social */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 28,
            padding: "16px 0",
          }}
        >
          <Link
            href="/"
            style={{ display: "flex", alignItems: "center", gap: 3, flexShrink: 0 }}
          >
            <div
              style={
                mobile
                  ? {
                      width: 77,
                      height: 67,
                      flexShrink: 0,
                      background:
                        "url('/brand/dead-logo.webp') left center/contain no-repeat",
                    }
                  : {
                      width: 111,
                      height: 100,
                      flexShrink: 0,
                      background:
                        "url('/brand/dead-logo.webp') left center/contain no-repeat",
                    }
              }
            />
            <span
              style={{
                fontFamily: "var(--font-sf)",
                fontSize: 13,
                fontWeight: 500,
                color: "var(--text-dim)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                lineHeight: 1.4,
                maxWidth: 120,
              }}
            >
              Custom miniature painting
            </span>
          </Link>

          <nav style={{ display: "flex", flexWrap: "wrap", gap: 28 }}>
            <Link href="/showcase" className="nav-link" style={navLinkStyle}>
              Miniatures
            </Link>
            <Link href="/#about" className="nav-link" style={navLinkStyle}>
              About me
            </Link>
            <Link href="/#contacts" className="nav-link" style={navLinkStyle}>
              Contacts
            </Link>
          </nav>

          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <a
              href="https://www.instagram.com/deadminiatures/"
              target="_blank"
              rel="noopener"
              aria-label="Instagram"
              className="footer-icon-link"
            >
              <div style={socialIconStyle("/icons/instagram.svg")} />
            </a>
            <a
              href="https://www.youtube.com/@deadminiatures"
              target="_blank"
              rel="noopener"
              aria-label="YouTube"
              className="footer-icon-link"
            >
              <div style={socialIconStyle("/icons/youtube.svg")} />
            </a>
          </div>
        </div>

        <div style={{ height: 1, background: "var(--foot-line)" }} />

        {/* copyright + legal */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: 24,
          }}
        >
          <span style={span}>© Dead Miniatures 2026</span>
          <div style={{ display: "flex", gap: 20 }}>
            <Link href="/terms" className="nav-link" style={{ ...span, textDecoration: "none" }}>
              Terms &amp; Conditions
            </Link>
            <Link href="/privacy" className="nav-link" style={{ ...span, textDecoration: "none" }}>
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

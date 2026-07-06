"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const SHOWCASE_CATS = [
  "SINGLE",
  "SQUAD",
  "VEHICLE",
  "DIORAMA",
  "BUSTS",
  "SMALL SCALE",
] as const;
type ShowcaseCat = (typeof SHOWCASE_CATS)[number];

const LABELS: Record<ShowcaseCat, string> = {
  SINGLE: "Single",
  SQUAD: "Squad",
  VEHICLE: "Vehicle",
  DIORAMA: "Diorama",
  BUSTS: "Busts",
  "SMALL SCALE": "Small Scale",
};
const COUNTS: Record<ShowcaseCat, number> = {
  SINGLE: 23,
  SQUAD: 3,
  VEHICLE: 12,
  DIORAMA: 6,
  BUSTS: 4,
  "SMALL SCALE": 12,
};
const IMAGES: Record<ShowcaseCat, [string, string]> = {
  SINGLE: ["/samples/showcase-1.png", "/samples/showcase-2.png"],
  SQUAD: ["/samples/mini-1.png", "/samples/mini-2.png"],
  VEHICLE: ["/samples/mini-3.png", "/samples/vehicle.png"],
  DIORAMA: ["/samples/mini-2.png", "/samples/mini-3.png"],
  BUSTS: ["/samples/mini-1.png", "/samples/showcase-1.png"],
  "SMALL SCALE": ["/samples/showcase-2.png", "/samples/mini-4.png"],
};

export default function HomeView() {
  const [mobile, setMobile] = useState(false);
  const [ppCat, setPpCat] = useState<ShowcaseCat>("SINGLE");
  const [ppHover, setPpHover] = useState<ShowcaseCat | null>(null);
  const [emailVal, setEmailVal] = useState("");

  // responsive fallbacks — mirror Home.dc.html's truncation-based stacking
  const [showcaseStacked, setShowcaseStacked] = useState(false);
  const [quoteStacked, setQuoteStacked] = useState(false);
  const [contactWrapped, setContactWrapped] = useState(false);
  const [headerH, setHeaderH] = useState(84);

  const rowRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const quoteMeasureRef = useRef<HTMLDivElement | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);
  const visualRef = useRef<HTMLDivElement | null>(null);
  const colRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 900px)");
    const onMQ = () => setMobile(mq.matches);
    onMQ();
    mq.addEventListener("change", onMQ);

    // scroll to hash on load (#about / #contacts), accounting for sticky header
    if (window.location.hash) {
      const id = window.location.hash.slice(1);
      let attempts = 0;
      const tryScroll = () => {
        const el = document.getElementById(id);
        if (el) {
          const header = document.querySelector("header");
          const offset = header ? (header as HTMLElement).offsetHeight : 80;
          window.scrollTo({
            top: el.getBoundingClientRect().top + window.scrollY - offset,
            behavior: "smooth",
          });
        } else if (attempts++ < 15) {
          setTimeout(tryScroll, 100);
        }
      };
      setTimeout(tryScroll, 100);
    }
    return () => mq.removeEventListener("change", onMQ);
  }, []);

  // --- measure sticky header height (hero pulls up under it) ---
  useEffect(() => {
    const measure = () => {
      const header = document.querySelector("header");
      if (header) setHeaderH((header as HTMLElement).offsetHeight);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [mobile]);

  // --- showcase tab-list truncation -> stack list above photos ---
  useEffect(() => {
    const check = () => {
      if (mobile) {
        setShowcaseStacked((prev) => (prev ? false : prev));
        return;
      }
      let truncated = false;
      Object.values(rowRefs.current).forEach((el) => {
        if (el && el.scrollWidth > el.clientWidth + 1) truncated = true;
      });
      setShowcaseStacked((prev) => (prev !== truncated ? truncated : prev));
    };
    const onResize = () => requestAnimationFrame(check);
    window.addEventListener("resize", onResize);
    const t = setTimeout(check, 150);
    check();
    return () => {
      window.removeEventListener("resize", onResize);
      clearTimeout(t);
    };
  }, [mobile]);

  // --- quote section: absolute layout doesn't fit -> stacked column layout ---
  useEffect(() => {
    const check = () => {
      const el = quoteMeasureRef.current;
      if (!el) return;
      const truncated = el.scrollWidth > el.clientWidth + 2;
      setQuoteStacked((prev) => (prev !== truncated ? truncated : prev));
    };
    const onResize = () => requestAnimationFrame(check);
    window.addEventListener("resize", onResize);
    const t = setTimeout(check, 150);
    check();
    return () => {
      window.removeEventListener("resize", onResize);
      clearTimeout(t);
    };
  }, [mobile]);

  // --- contacts row: 3rd column wraps to its own row when space runs out ---
  useEffect(() => {
    const check = () => {
      const formEl = formRef.current;
      const visEl = visualRef.current;
      const colEl = colRef.current;
      if (mobile || !formEl || !visEl || !colEl) {
        setContactWrapped((prev) => (prev ? false : prev));
        return;
      }
      const container = colEl.parentElement;
      if (!container) return;
      const avail = container.getBoundingClientRect().width;
      const needed =
        formEl.getBoundingClientRect().width +
        visEl.getBoundingClientRect().width +
        270;
      const wrapped = avail < needed - 1;
      setContactWrapped((prev) => (prev !== wrapped ? wrapped : prev));
    };
    const onResize = () => requestAnimationFrame(check);
    window.addEventListener("resize", onResize);
    const t = setTimeout(check, 150);
    check();
    return () => {
      window.removeEventListener("resize", onResize);
      clearTimeout(t);
    };
  }, [mobile]);

  const m = mobile;
  const cat = ppCat;
  const litCat = ppHover || cat;
  const [img1, img2] = IMAGES[litCat];
  const sendDisabled = !emailVal.trim();
  const mobileLike = m || showcaseStacked;

  return (
    <>
      {/* ===== HERO ===== */}
      <section
        style={{
          position: "relative",
          zIndex: 1,
          display: m ? "flex" : "block",
          flexDirection: m ? "column" : undefined,
          minHeight: m ? undefined : "clamp(620px, 100vh, 900px)",
          marginTop: -headerH,
          paddingTop: headerH + (m ? 24 : 0),
          paddingBottom: m ? 0 : undefined,
          backgroundImage: "url('/brand/hero-bg-opt.png')",
          backgroundSize: "cover",
          width: "100%",
          backgroundPosition: "top center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div
          style={
            m
              ? {
                  position: "absolute",
                  left: "50%",
                  top: 70,
                  transform: "translateX(-50%)",
                  width: "130%",
                  maxWidth: 760,
                  aspectRatio: "2115/1791",
                  backgroundImage: "url('/brand/hero-logo-bg-opt.png')",
                  backgroundSize: "contain",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  pointerEvents: "none",
                }
              : {
                  position: "absolute",
                  left: -40,
                  top: -210,
                  width: 998,
                  height: 832,
                  backgroundImage: "url('/brand/hero-logo-bg-opt.png')",
                  backgroundSize: "contain",
                  backgroundPosition: "left top",
                  backgroundRepeat: "no-repeat",
                  pointerEvents: "none",
                }
          }
        />
        <div
          style={
            m
              ? {
                  position: "relative",
                  order: 2,
                  width: "100%",
                  aspectRatio: "860 / 767",
                  backgroundImage: "url('/samples/hero-fig-opt.png')",
                  backgroundSize: "contain",
                  backgroundPosition: "center bottom",
                  backgroundRepeat: "no-repeat",
                  zIndex: 1,
                  pointerEvents: "none",
                }
              : {
                  position: "absolute",
                  right: "max(0px, calc((100vw - 1416px) / 2))",
                  bottom: 0,
                  width: 860,
                  height: 793,
                  backgroundImage: "url('/samples/hero-fig-opt.png')",
                  backgroundSize: "contain",
                  backgroundPosition: "right bottom",
                  backgroundRepeat: "no-repeat",
                  zIndex: 2,
                  pointerEvents: "none",
                }
          }
        />
        <div
          style={{
            position: m ? "relative" : "absolute",
            zIndex: 4,
            order: m ? 1 : undefined,
            left: m
              ? "auto"
              : "calc(max(0px, (100vw - 1416px) / 2) + clamp(20px, 6vw, 112px))",
            bottom: m ? "auto" : "clamp(28px, 7vh, 80px)",
            maxWidth: m ? 620 : "min(620px, 47vw)",
            padding: m ? "0 clamp(20px,6vw,40px) 32px" : 0,
          }}
        >
          <h1
            style={{
              margin: 0,
              lineHeight: 1.0,
              color: "var(--text)",
              fontFamily: "var(--font-anton)",
              fontWeight: 400,
              textTransform: "uppercase",
            }}
          >
            <span style={{ display: "block", fontSize: "clamp(44px, min(12vw, 13vh), 144px)" }}>
              I Paint
            </span>
            <span style={{ display: "block", fontSize: "clamp(44px, min(12vw, 13vh), 144px)" }}>
              Miniatures
            </span>
          </h1>
          <div
            style={{
              marginTop: 18,
              fontFamily: "var(--font-manrope)",
              fontSize: "clamp(16px,1.5vw,20px)",
              lineHeight: 1.45,
              color: "var(--text)",
            }}
          >
            <div>
              You&rsquo;re in <strong style={{ fontWeight: 600 }}>Dead miniatures</strong>{" "}
              studio.
            </div>
            <div>Minis for your shelves &amp; tables.</div>
          </div>
        </div>
      </section>

      {/* ===== SHOWCASE ===== */}
      <section
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: 1416,
          margin: "0 auto",
          padding: "180px clamp(20px,6vw,112px) 180px",
          background: "var(--bg)",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "url('/brand/scratch-tex-showcase.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.18,
            mixBlendMode: "color-dodge",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
            marginBottom: 48,
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-anton)",
              fontWeight: 400,
              fontSize: "clamp(56px,8vw,96px)",
              lineHeight: 1,
              color: "var(--text)",
              margin: 0,
              textTransform: "uppercase",
            }}
          >
            Showcase
          </h2>
          <p
            style={{
              fontFamily: "var(--font-sf)",
              fontSize: 16,
              lineHeight: 1.2,
              color: "var(--text-dim)",
              margin: 0,
            }}
          >
            Every detail is intentional. Nothing is left to chance.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: mobileLike ? "column" : "row",
            gap: mobileLike ? 0 : 60,
            alignItems: mobileLike ? "stretch" : "flex-start",
            justifyContent: "flex-start",
          }}
        >
          {/* vertical tab list */}
          <div
            style={{
              width: mobileLike
                ? "100%"
                : "clamp(300px, calc(300px + (100vw - 1072px) * 0.779), 434px)",
              flexShrink: 0,
              height: mobileLike ? "auto" : 566,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {SHOWCASE_CATS.map((k) => {
              const isActive = k === cat;
              const isHovered = k === ppHover;
              const isLit = ppHover ? isHovered : isActive;
              return (
                <div
                  key={k}
                  onMouseEnter={() => setPpHover(k)}
                  onMouseLeave={() => {
                    setPpCat(k);
                    setPpHover(null);
                  }}
                  onClick={
                    m
                      ? () => {
                          setPpCat(k);
                          setPpHover(null);
                        }
                      : () => {
                          window.location.href = "/showcase#" + k;
                        }
                  }
                  style={{
                    cursor: "pointer",
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div
                    ref={(el) => {
                      rowRefs.current[k] = el;
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      flex: 1,
                      width: "100%",
                      overflow: "hidden",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-sf)",
                        fontSize: "clamp(20px,2.2vw,32px)",
                        color: isLit ? "var(--accent)" : "var(--text)",
                        padding: m ? "9px 0" : "5px 0",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {LABELS[k].toUpperCase()}
                      <span style={{ opacity: 0.4 }}> / {COUNTS[k]}</span>
                    </span>
                    {isLit && (
                      <a
                        href={"/showcase#" + k}
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          fontFamily: "var(--font-sf)",
                          fontSize: 13,
                          color: "var(--accent)",
                          whiteSpace: "nowrap",
                          flexShrink: 0,
                          textTransform: "uppercase",
                          letterSpacing: "0.04em",
                          textDecoration: "none",
                        }}
                      >
                        View All
                      </a>
                    )}
                  </div>
                  {isActive && mobileLike && (
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 8,
                        padding: "4px 0 16px",
                      }}
                    >
                      <div style={mobileImg(IMAGES[k][0])} />
                      <div style={mobileImg(IMAGES[k][1])} />
                    </div>
                  )}
                  <div style={{ height: 1, background: "var(--line)" }} />
                </div>
              );
            })}

            <div
              style={{
                display: "flex",
                justifyContent: mobileLike ? "center" : "flex-start",
                marginTop: m ? 32 : 48,
              }}
            >
              <Link
                href="/showcase"
                className="btn-outline"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 171,
                  height: 40,
                  boxShadow: "inset 0 0 0 1px var(--accent)",
                  color: "var(--accent)",
                  fontFamily: "var(--font-mono)",
                  fontWeight: 500,
                  fontSize: 16,
                  textDecoration: "none",
                  textTransform: "uppercase",
                }}
              >
                View All Work
              </Link>
            </div>
          </div>

          {/* right: overlapping rotated photos (desktop only, list not stacked) */}
          {!mobileLike && (
            <div
              style={{
                position: "relative",
                width: "clamp(420px, calc(420px + (100vw - 900px) * 1.628), 700px)",
                minHeight: 606,
                flexShrink: 0,
                pointerEvents: "none",
              }}
            >
              <div style={bigImg(img1, 60, 0, 401, 566)} />
              <div
                style={bigImg(
                  img2,
                  "clamp(260px, calc(260px + (100vw - 900px) * 1.628), 488px)",
                  244,
                  255,
                  362
                )}
              />
            </div>
          )}
        </div>
      </section>

      {/* ===== QUOTE / VIDEO ===== */}
      <section
        id="about"
        style={{
          position: "relative",
          zIndex: 1,
          overflow: "hidden",
          padding: m
            ? "60px clamp(20px,6vw,40px) 80px"
            : "80px clamp(20px,6vw,112px)",
          isolation: "isolate",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "url('/brand/quote-bg-opt.png') center/cover no-repeat",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        {quoteStacked && (
          <div
            style={{
              position: "relative",
              zIndex: 2,
              width: "100%",
              maxWidth: 640,
              margin: "0 auto",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: 28,
            }}
          >
            <h2
              style={{
                fontFamily: "var(--font-anton)",
                fontWeight: 400,
                fontSize: "clamp(40px,12vw,90px)",
                lineHeight: 1,
                color: "var(--text)",
                margin: 0,
                textTransform: "uppercase",
              }}
            >
              No shortcuts.
            </h2>

            <div
              style={{
                position: "relative",
                width: "100%",
                aspectRatio: "339/219",
                overflow: "hidden",
                background: "url('/samples/video-thumb.png') center/cover no-repeat",
                backgroundColor: "var(--card)",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "rgba(0,0,0,0.4)",
                  mixBlendMode: "color",
                  pointerEvents: "none",
                }}
              />
              <button
                aria-label="Play"
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  transform: "translate(-50%,-50%)",
                  width: 90,
                  height: 90,
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 0,
                  zIndex: 1,
                }}
              >
                <span
                  style={{
                    display: "block",
                    width: 0,
                    height: 0,
                    borderLeft: "27px solid var(--accent)",
                    borderTop: "18px solid transparent",
                    borderBottom: "18px solid transparent",
                    marginLeft: 6,
                  }}
                />
              </button>
            </div>

            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 16,
                lineHeight: 1.7,
                color: "var(--accent)",
              }}
            >
              / Kisa
              <br />/ Miniature artist
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 14,
                flexWrap: "wrap",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-sf)",
                  fontWeight: 400,
                  fontSize: "clamp(24px,7vw,40px)",
                  color: "var(--text)",
                  textTransform: "uppercase",
                  lineHeight: 1,
                }}
              >
                Just
              </span>
              <span
                style={{
                  fontFamily: "var(--font-anton)",
                  fontWeight: 400,
                  fontSize: "clamp(40px,12vw,90px)",
                  color: "var(--text)",
                  lineHeight: 1,
                  textTransform: "uppercase",
                }}
              >
                Paint.
              </span>
            </div>
          </div>
        )}

        <div
          ref={quoteMeasureRef}
          style={
            quoteStacked
              ? {
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  zIndex: -1,
                  visibility: "hidden",
                  pointerEvents: "none",
                  maxWidth: 1416,
                  margin: "0 auto",
                  height: "clamp(540px,50vw,720px)",
                }
              : {
                  position: "relative",
                  zIndex: 2,
                  width: "100%",
                  maxWidth: 1416,
                  margin: "0 auto",
                  height: "clamp(540px,50vw,720px)",
                }
          }
        >
          <h2
            style={{
              position: "absolute",
              top: "clamp(26px,4.8vw,62px)",
              left: "calc(26% - 1.5em)",
              fontFamily: "var(--font-anton)",
              fontWeight: 400,
              fontSize: "clamp(60px,10vw,130px)",
              lineHeight: 1,
              color: "var(--text)",
              margin: 0,
              textTransform: "uppercase",
              whiteSpace: "nowrap",
            }}
          >
            No shortcuts.
          </h2>

          <div
            style={{
              position: "absolute",
              left: "26%",
              top: "calc(clamp(60px,10vw,130px) + 10px + clamp(26px,4.8vw,62px))",
              display: "flex",
              alignItems: "flex-start",
              gap: 28,
            }}
          >
            <div
              style={{
                position: "relative",
                width: "clamp(280px,31vw,480px)",
                aspectRatio: "339/219",
                overflow: "hidden",
                background: "url('/samples/video-thumb.png') center/cover no-repeat",
                backgroundColor: "var(--card)",
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "rgba(0,0,0,0.4)",
                  mixBlendMode: "color",
                  pointerEvents: "none",
                }}
              />
              <button
                aria-label="Play"
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  transform: "translate(-50%,-50%)",
                  width: 110,
                  height: 110,
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 0,
                  zIndex: 1,
                }}
              >
                <span
                  style={{
                    display: "block",
                    width: 0,
                    height: 0,
                    borderLeft: "33px solid var(--accent)",
                    borderTop: "22px solid transparent",
                    borderBottom: "22px solid transparent",
                    marginLeft: 7,
                  }}
                />
              </button>
            </div>
            <div
              style={{
                position: "relative",
                zIndex: 1,
                fontFamily: "var(--font-mono)",
                fontSize: 16,
                lineHeight: 1.7,
                color: "var(--accent)",
                whiteSpace: "nowrap",
                marginTop: 10,
                marginLeft: -50,
              }}
            >
              / Kisa
              <br />/ Miniature artist
            </div>
          </div>

          <span
            style={{
              position: "absolute",
              right:
                "calc(74% - clamp(280px,31vw,480px) + 2px)",
              top: "calc(clamp(60px,10vw,130px) + 20px + clamp(181px,20vw,310px) + clamp(26px,4.8vw,62px))",
              fontFamily: "var(--font-sf)",
              fontWeight: 400,
              fontSize: "clamp(28px,4vw,54px)",
              color: "var(--text)",
              textTransform: "uppercase",
              lineHeight: 1,
            }}
          >
            Just
          </span>
          <span
            style={{
              position: "absolute",
              left: "calc(26% + clamp(280px,31vw,480px) + 10px)",
              top: "calc(clamp(60px,10vw,130px) + 20px + clamp(181px,20vw,310px))",
              fontFamily: "var(--font-anton)",
              fontWeight: 400,
              fontSize: "clamp(60px,10vw,130px)",
              color: "var(--text)",
              lineHeight: 1,
              textTransform: "uppercase",
            }}
          >
            Paint.
          </span>
        </div>
      </section>

      {/* ===== CONTACTS + FOOTER TEXTURE WRAPPER ===== */}
      <div style={{ position: "relative" }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "url('/brand/scratch-tex-contact-new.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.18,
            mixBlendMode: "color-dodge",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        <section
          id="contacts"
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: 1416,
            margin: "0 auto",
            padding: "180px clamp(20px,6vw,112px)",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: m ? "column" : "row",
              flexWrap: m ? undefined : "wrap",
              gap: 0,
              alignItems: "stretch",
            }}
          >
            {/* form card */}
            <form
              ref={formRef}
              onSubmit={(e) => e.preventDefault()}
              style={{
                position: "relative",
                width: m ? "100%" : "clamp(450px, calc(450px + (100vw - 900px) * 0.911), 501px)",
                flexShrink: 0,
                background: "var(--card)",
                boxShadow: "inset 0 0 0 1px rgba(28,30,31,1)",
                display: "flex",
                flexDirection: "column",
                gap: 32,
                padding: 40,
                justifyContent: "center",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <h3
                  style={{
                    fontFamily: "var(--font-anton)",
                    fontWeight: 400,
                    fontSize: "clamp(40px,4vw,54px)",
                    lineHeight: 1.1,
                    color: "var(--accent)",
                    margin: 0,
                    textTransform: "uppercase",
                  }}
                >
                  Have something special in mind?
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-sf)",
                    fontSize: 16,
                    lineHeight: 1,
                    color: "var(--text-dim)",
                    margin: 0,
                  }}
                >
                  Open to custom projects and collaborations
                </p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 12 }}
                >
                  <input
                    type="email"
                    required
                    placeholder="E-mail"
                    onChange={(e) => setEmailVal(e.target.value)}
                    style={{
                      height: 50,
                      background: "var(--inset)",
                      border: "none",
                      padding: "15px 16px",
                      fontFamily: "var(--font-sf)",
                      fontSize: 16,
                      color: "var(--text)",
                      outline: "none",
                    }}
                  />
                  <textarea
                    placeholder="Tell about your project"
                    rows={3}
                    style={{
                      height: 83,
                      resize: "none",
                      background: "var(--inset)",
                      border: "none",
                      padding: "15px 16px",
                      fontFamily: "var(--font-sf)",
                      fontSize: 16,
                      color: "var(--text)",
                      outline: "none",
                    }}
                  />
                </div>
                <button
                  type="submit"
                  className="btn-outline"
                  disabled={sendDisabled}
                  style={{
                    width: 171,
                    height: 40,
                    boxShadow: "inset 0 0 0 1px var(--accent)",
                    background: "transparent",
                    color: "var(--accent)",
                    fontFamily: "var(--font-mono)",
                    fontWeight: 500,
                    fontSize: 16,
                    cursor: "pointer",
                    textTransform: "uppercase",
                    transition: "opacity 0.2s",
                  }}
                >
                  Send
                </button>
              </div>
            </form>

            {/* visual card */}
            <div
              ref={visualRef}
              style={{
                position: "relative",
                overflow: "hidden",
                width: m ? "100%" : 310,
                minHeight: m ? 320 : "auto",
                flexShrink: 0,
                background: "var(--card)",
                boxShadow: "inset 0 0 0 1px rgba(28,30,31,1)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: 24,
                padding: 40,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: -24,
                  background:
                    "url('/brand/logo-content-bg.png') center/contain no-repeat",
                  opacity: 0.9,
                  pointerEvents: "none",
                  zIndex: 0,
                }}
              />
              <div style={{ position: "relative", zIndex: 1 }}>
                <div
                  style={{
                    fontFamily: "var(--font-sf)",
                    fontSize: 20,
                    fontWeight: 400,
                    color: "var(--text)",
                    textTransform: "uppercase",
                    lineHeight: 1.4,
                  }}
                >
                  From
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-bebas)",
                    fontWeight: 400,
                    fontSize: 40,
                    lineHeight: "40px",
                    color: "var(--text)",
                  }}
                >
                  single pieces
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-bebas)",
                    fontWeight: 400,
                    fontSize: 40,
                    lineHeight: "40px",
                    color: "var(--text)",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-sf)",
                      fontSize: 20,
                      fontWeight: 400,
                      textTransform: "uppercase",
                    }}
                  >
                    to
                  </span>{" "}
                  full compositions
                </div>
              </div>
              <div
                style={{
                  position: "relative",
                  zIndex: 1,
                  fontFamily: "var(--font-sf)",
                  fontSize: 16,
                  lineHeight: 1.38,
                  color: "var(--text)",
                  maxWidth: 160,
                }}
              >
                Everything is discussed upfront.
              </div>
            </div>

            {/* contact cards */}
            <div
              ref={colRef}
              style={
                contactWrapped
                  ? {
                      display: "flex",
                      flexDirection: "column",
                      width:
                        "min(100%, calc(310px + clamp(450px, calc(450px + (100vw - 900px) * 0.911), 501px)))",
                      flexBasis: "auto",
                      flexGrow: 0,
                      flexShrink: 0,
                    }
                  : {
                      display: "flex",
                      flexDirection: "column",
                      width: m ? "100%" : "auto",
                      flexBasis: m ? undefined : 290,
                      minWidth: m ? undefined : 270,
                      flexGrow: m ? 0 : 1,
                      flexShrink: m ? 0 : 1,
                    }
              }
            >
              <div style={contactCard}>
                <span style={contactKicker}>/ WRITE DIRECTLY</span>
                <a
                  href="mailto:deadminiatures@gmail.com"
                  style={{
                    fontFamily: "var(--font-sf)",
                    fontSize: 16,
                    color: "var(--text)",
                    textDecoration: "none",
                    cursor: "default",
                    whiteSpace: "nowrap",
                  }}
                >
                  deadminiatures@gmail.com
                </a>
                <div
                  style={contactIcon("/icons/mail.svg", -6, contactWrapped)}
                  className="contact-icon"
                />
              </div>
              <a
                href="https://www.instagram.com/deadminiatures/"
                target="_blank"
                rel="noopener"
                className="contact-link"
                style={{ ...contactCard, textDecoration: "none", cursor: "pointer" }}
              >
                <span style={contactKicker}>/ INSTAGRAM</span>
                <span
                  style={{
                    fontFamily: "var(--font-sf)",
                    fontSize: 16,
                    color: "var(--text)",
                  }}
                >
                  Finished works &amp; DM
                </span>
                <div
                  style={contactIcon("/icons/instagram.svg", -6, contactWrapped)}
                  className="contact-icon"
                />
              </a>
              <a
                href="https://www.youtube.com/@deadminiatures"
                target="_blank"
                rel="noopener"
                className="contact-link"
                style={{ ...contactCard, textDecoration: "none", cursor: "pointer" }}
              >
                <span style={contactKicker}>/ YOUTUBE</span>
                <span
                  style={{
                    fontFamily: "var(--font-sf)",
                    fontSize: 16,
                    color: "var(--text)",
                  }}
                >
                  Painting process &amp; studio videos
                </span>
                <div
                  style={contactIcon("/icons/youtube.svg", -6, contactWrapped)}
                  className="contact-icon"
                />
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

function mobileImg(src: string): React.CSSProperties {
  return {
    aspectRatio: "3/4",
    backgroundImage: `url('${src}')`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundColor: "var(--card)",
  };
}

function bigImg(
  src: string,
  left: number | string,
  top: number,
  width: number,
  height: number
): React.CSSProperties {
  return {
    position: "absolute",
    left,
    top,
    width,
    height,
    backgroundImage: `url('${src}')`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundColor: "var(--card)",
  };
}

const contactCard: React.CSSProperties = {
  position: "relative",
  zIndex: 0,
  overflow: "hidden",
  background: "var(--card)",
  boxShadow: "inset 0 0 0 1px rgba(28,30,31,1)",
  display: "flex",
  flexDirection: "column",
  gap: 16,
  padding: "16px 20px",
  justifyContent: "center",
  flex: 1,
};

const contactKicker: React.CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: 16,
  color: "var(--accent)",
};

function contactIcon(
  src: string,
  right: number,
  wrapped: boolean
): React.CSSProperties {
  const size = wrapped ? "70px" : "clamp(64px, 14vw, 105px)";
  return {
    position: "absolute",
    zIndex: -1,
    right,
    top: "50%",
    transform: "translateY(-50%)",
    width: size,
    height: size,
    backgroundColor: "rgb(30,30,30)",
    WebkitMask: `url('${src}') no-repeat center/contain`,
    mask: `url('${src}') no-repeat center/contain`,
  };
}

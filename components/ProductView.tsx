"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Artwork } from "@/types/artwork";

type NavItem = { id: number; name: string };

function imgSrc(url: string | null): string {
  if (!url) return "/samples/mini-1.png";
  return url.replace(/^public\//, "/");
}

export default function ProductView({
  artwork,
  prev,
  next,
}: {
  artwork: Artwork;
  prev: NavItem | null;
  next: NavItem | null;
}) {
  const [mobile, setMobile] = useState(false);
  const [mainIdx, setMainIdx] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  const media = [
    ...(artwork.video_url
      ? [{ type: "video" as const, src: artwork.video_url }]
      : []),
    { type: "image" as const, src: imgSrc(artwork.image_url) },
    ...(artwork.extra_images || []).map((s) => ({
      type: "image" as const,
      src: imgSrc(s),
    })),
  ];
  const count = media.length;

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 820px)");
    const onMQ = () => setMobile(mq.matches);
    onMQ();
    mq.addEventListener("change", onMQ);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(false);
      if (!count) return;
      if (e.key === "ArrowLeft") setMainIdx((i) => (i - 1 + count) % count);
      if (e.key === "ArrowRight") setMainIdx((i) => (i + 1) % count);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      mq.removeEventListener("change", onMQ);
      window.removeEventListener("keydown", onKey);
    };
  }, [count]);

  const m = mobile;
  const idx = Math.min(mainIdx, media.length - 1);
  const current = media[idx];
  const available = artwork.status === "available";
  const showNav = media.length > 1;

  const metaItems = [
    { label: "Sculptor", value: artwork.sculptor },
    { label: "Scale", value: artwork.scale },
    { label: "Game system", value: artwork.game_system },
    {
      label: "Time",
      value: artwork.time_hours != null ? `~${artwork.time_hours} hours` : null,
    },
  ].filter((x) => x.value);

  const goPrev = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setMainIdx((i) => (i - 1 + media.length) % media.length);
  };
  const goNext = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setMainIdx((i) => (i + 1) % media.length);
  };

  const statusBadge = (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: available ? "var(--available)" : "var(--sold)",
        }}
      />
      <span
        style={{
          fontSize: 14,
          fontWeight: 500,
          color: available ? "var(--available)" : "var(--sold)",
          textTransform: "uppercase",
          letterSpacing: "0.04em",
        }}
      >
        {available ? "Available" : "Sold"}
      </span>
    </span>
  );

  const titleBlock = (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 400,
          fontSize: "clamp(36px,4vw,52px)",
          lineHeight: 1,
          color: "var(--text)",
          margin: 0,
        }}
      >
        {artwork.name}
      </h1>
      {statusBadge}
    </div>
  );

  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        background: "var(--bg)",
        color: "var(--text)",
        fontFamily: "var(--font-mono)",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "url('/brand/scratch-tex.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.18,
          mixBlendMode: "color-dodge",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <main
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 1432,
          margin: "0 auto",
          padding: "20px clamp(20px,6vw,92px) 120px",
        }}
      >
        {/* back */}
        <Link
          href="/showcase"
          className="back-link"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            color: "var(--text)",
            textDecoration: "none",
            fontFamily: "var(--font-sf)",
            fontWeight: 400,
            fontSize: 16,
            marginBottom: 28,
          }}
        >
          <span style={{ fontSize: 18, lineHeight: 1 }}>&#8592;</span>
          <span className="back-text">Back to all painted pieces</span>
        </Link>

        {/* title: mobile only (above media) */}
        {m && <div style={{ marginBottom: 28 }}>{titleBlock}</div>}

        {/* media + info */}
        <div
          style={
            m
              ? { display: "flex", flexDirection: "column", gap: 36 }
              : {
                  display: "grid",
                  gridTemplateColumns: "minmax(0, 2.3fr) minmax(0, 1fr)",
                  gap: 48,
                  alignItems: "start",
                }
          }
        >
          {/* viewer */}
          <div
            style={
              m
                ? { display: "flex", flexDirection: "column", gap: 14 }
                : { display: "flex", flexDirection: "row", gap: 16, height: "80vh" }
            }
          >
            <div
              className="thumbs-col"
              style={
                m
                  ? {
                      display: "flex",
                      flexDirection: "row",
                      gap: 10,
                      overflowX: "auto",
                      width: "100%",
                      order: 2,
                      paddingBottom: 4,
                    }
                  : {
                      display: "flex",
                      flexDirection: "column",
                      gap: 12,
                      width: 84,
                      flexShrink: 0,
                      overflowY: "auto",
                      height: "100%",
                      order: 0,
                    }
              }
            >
              {media.map((item, i) => (
                <button
                  key={i}
                  onClick={() => setMainIdx(i)}
                  className="media-thumb"
                  aria-label="View media"
                  style={{
                    position: "relative",
                    flexShrink: 0,
                    width: m ? 76 : "100%",
                    height: m ? 76 : "auto",
                    aspectRatio: "1 / 1",
                    border:
                      i === idx
                        ? "2px solid var(--accent)"
                        : "2px solid transparent",
                    backgroundImage: `url('${
                      item.type === "video" ? imgSrc(artwork.image_url) : item.src
                    }')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundColor: "var(--bg-deep)",
                    cursor: "pointer",
                    padding: 0,
                    opacity: i === idx ? 1 : 0.6,
                    transition: "opacity .2s",
                  }}
                >
                  {item.type === "video" && (
                    <span
                      style={{
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "rgba(0,0,0,0.28)",
                      }}
                    >
                      <span
                        style={{
                          display: "block",
                          width: 0,
                          height: 0,
                          borderStyle: "solid",
                          borderWidth: "6px 0 6px 11px",
                          borderColor:
                            "transparent transparent transparent var(--video)",
                          marginLeft: 2,
                        }}
                      />
                    </span>
                  )}
                </button>
              ))}
            </div>

            <div
              style={
                m
                  ? {
                      position: "relative",
                      order: 1,
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "var(--bg-deep)",
                      overflow: "hidden",
                    }
                  : {
                      position: "relative",
                      order: 0,
                      flex: 1,
                      minWidth: 0,
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "var(--bg-deep)",
                      overflow: "hidden",
                    }
              }
            >
              {current.type === "video" ? (
                <video
                  key={current.src}
                  controls
                  playsInline
                  preload="metadata"
                  poster={imgSrc(artwork.image_url)}
                  src={current.src}
                  style={{
                    width: "100%",
                    height: m ? "auto" : "100%",
                    minHeight: m ? 280 : undefined,
                    maxHeight: "100%",
                    aspectRatio: m ? "4 / 3" : undefined,
                    background: "var(--bg-deep)",
                    objectFit: "contain",
                  }}
                />
              ) : (
                <div
                  onClick={() => setLightbox(true)}
                  style={{
                    width: "100%",
                    height: m ? "auto" : "100%",
                    minHeight: m ? 280 : undefined,
                    aspectRatio: m ? "4 / 3" : undefined,
                    backgroundImage: `url('${current.src}')`,
                    backgroundSize: "contain",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    cursor: "zoom-in",
                  }}
                />
              )}
              {showNav && (
                <>
                  <button
                    onClick={goPrev}
                    className="media-arrow"
                    aria-label="Previous"
                    style={mediaArrow("left")}
                  >
                    <span
                      style={{
                        display: "block",
                        width: 9,
                        height: 9,
                        borderLeft: "2px solid var(--text)",
                        borderBottom: "2px solid var(--text)",
                        transform: "rotate(45deg)",
                        marginLeft: 3,
                      }}
                    />
                  </button>
                  <button
                    onClick={goNext}
                    className="media-arrow"
                    aria-label="Next"
                    style={mediaArrow("right")}
                  >
                    <span
                      style={{
                        display: "block",
                        width: 9,
                        height: 9,
                        borderRight: "2px solid var(--text)",
                        borderTop: "2px solid var(--text)",
                        transform: "rotate(45deg)",
                        marginRight: 3,
                      }}
                    />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* info panel */}
          <aside
            style={
              m
                ? { display: "flex", flexDirection: "column", gap: 28 }
                : {
                    position: "sticky",
                    top: 148,
                    alignSelf: "start",
                    display: "flex",
                    flexDirection: "column",
                    gap: 28,
                    height: "80vh",
                    overflow: "hidden",
                  }
            }
          >
            {!m && titleBlock}

            <div style={{ display: "flex", flexDirection: "column", gap: 30 }}>
              {metaItems.map((meta) => (
                <div
                  key={meta.label}
                  style={{ display: "flex", flexDirection: "column", gap: 8 }}
                >
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 500,
                      color: "var(--meta-label)",
                      opacity: 0.5,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {meta.label}
                  </span>
                  <span
                    style={{
                      fontSize: 17,
                      fontWeight: 400,
                      color: "#eee9db",
                      fontFamily: "var(--font-sf)",
                    }}
                  >
                    {meta.value}
                  </span>
                </div>
              ))}
            </div>

            {artwork.description && (
              <div style={{ paddingTop: 30 }}>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 500,
                    color: "var(--meta-label)",
                    opacity: 0.5,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    marginBottom: 14,
                  }}
                >
                  Description
                </div>
                <p
                  style={{
                    fontSize: 16,
                    lineHeight: 1.7,
                    color: "var(--text)",
                    margin: 0,
                    fontFamily: "var(--font-sf)",
                  }}
                >
                  {artwork.description}
                </p>
              </div>
            )}

            {/* prev / next */}
            <div
              style={{
                marginTop: "auto",
                display: "flex",
                borderTop: "1px solid var(--line)",
              }}
            >
              <Link
                href={prev ? `/artwork/${prev.id}` : "#"}
                className="prev-next-link"
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "20px 16px 20px 0",
                  color: "var(--text)",
                  textDecoration: "none",
                  fontFamily: "var(--font-sf)",
                  fontSize: 15,
                  borderRight: "1px solid var(--line)",
                }}
              >
                <span style={{ fontSize: 20, lineHeight: 1, flexShrink: 0 }}>
                  &#8592;
                </span>
                <span>
                  <div style={prevNextLabel}>Previous</div>
                  <div style={{ fontWeight: 500, fontSize: 14 }}>
                    {prev ? prev.name : "—"}
                  </div>
                </span>
              </Link>
              <Link
                href={next ? `/artwork/${next.id}` : "#"}
                className="prev-next-link"
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  gap: 12,
                  padding: "20px 0 20px 16px",
                  color: "var(--text)",
                  textDecoration: "none",
                  fontFamily: "var(--font-sf)",
                  fontSize: 15,
                }}
              >
                <span style={{ textAlign: "right" }}>
                  <div style={prevNextLabel}>Next</div>
                  <div style={{ fontWeight: 500, fontSize: 14 }}>
                    {next ? next.name : "—"}
                  </div>
                </span>
                <span style={{ fontSize: 20, lineHeight: 1, flexShrink: 0 }}>
                  &#8594;
                </span>
              </Link>
            </div>
          </aside>
        </div>
      </main>

      {/* lightbox */}
      {lightbox && current.type === "image" && (
        <div
          onClick={() => setLightbox(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            background: "rgba(7,7,7,0.94)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 40,
          }}
        >
          <div
            style={{
              maxWidth: "92vw",
              maxHeight: "88vh",
              width: "100%",
              height: "88vh",
              backgroundImage: `url('${current.src}')`,
              backgroundSize: "contain",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          />
          <button
            onClick={() => setLightbox(false)}
            className="lb-ctrl"
            aria-label="Close"
            style={{
              position: "absolute",
              top: 24,
              right: 28,
              width: 44,
              height: 44,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.08)",
              border: "none",
              cursor: "pointer",
              color: "var(--text)",
              fontSize: 22,
              lineHeight: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            &#10005;
          </button>
          {showNav && (
            <>
              <button
                onClick={(e) => goPrev(e)}
                className="lb-ctrl"
                aria-label="Previous"
                style={lbArrow("left")}
              >
                <span
                  style={{
                    display: "block",
                    width: 12,
                    height: 12,
                    borderLeft: "2px solid var(--text)",
                    borderBottom: "2px solid var(--text)",
                    transform: "rotate(45deg)",
                    marginLeft: 4,
                  }}
                />
              </button>
              <button
                onClick={(e) => goNext(e)}
                className="lb-ctrl"
                aria-label="Next"
                style={lbArrow("right")}
              >
                <span
                  style={{
                    display: "block",
                    width: 12,
                    height: 12,
                    borderRight: "2px solid var(--text)",
                    borderTop: "2px solid var(--text)",
                    transform: "rotate(45deg)",
                    marginRight: 4,
                  }}
                />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

const prevNextLabel: React.CSSProperties = {
  fontSize: 11,
  color: "var(--text-dim)",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  marginBottom: 3,
};

function mediaArrow(side: "left" | "right"): React.CSSProperties {
  return {
    position: "absolute",
    [side]: 12,
    top: "50%",
    transform: "translateY(-50%)",
    width: 40,
    height: 40,
    borderRadius: "50%",
    border: "none",
    background: "rgba(5,5,5,0.5)",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  } as React.CSSProperties;
}

function lbArrow(side: "left" | "right"): React.CSSProperties {
  return {
    position: "absolute",
    [side]: 28,
    top: "50%",
    transform: "translateY(-50%)",
    width: 48,
    height: 48,
    borderRadius: "50%",
    border: "none",
    background: "rgba(255,255,255,0.08)",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  } as React.CSSProperties;
}

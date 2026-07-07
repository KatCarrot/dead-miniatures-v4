"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { imgSrc } from "@/lib/imgSrc";
import { useInView, revealStyle } from "@/lib/useInView";
import type { ArtworkCardData } from "@/types/artwork";

type GalleryCardData = {
  id: number;
  name: string;
  category: string;
  status: string;
  images: string[];
};

const CATS = [
  "ALL",
  "SINGLE",
  "SQUAD",
  "VEHICLE",
  "DIORAMA",
  "BUSTS",
  "SMALL SCALE",
] as const;

const DECO_IMAGES: Record<string, string> = {
  ALL: "/samples/all-xs.webp",
  SINGLE: "/samples/single-xs.webp",
  SQUAD: "/samples/single-xs.webp",
  VEHICLE: "/samples/vehicle-xs.webp",
  DIORAMA: "/samples/single-xs.webp",
  BUSTS: "/samples/busts-xs.webp",
  "SMALL SCALE": "/samples/small-scale-xs.webp",
};

export default function GalleryView({
  artworks,
}: {
  artworks: ArtworkCardData[];
}) {
  const [cat, setCat] = useState<string>("ALL");
  const [cols, setCols] = useState(3);
  const [imgIndexes, setImgIndexes] = useState<Record<number, number>>({});
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [noHover, setNoHover] = useState(false);
  const gridRef = useRef<HTMLDivElement | null>(null);

  // touch/tablet devices never fire hover — keep the nav arrows visible there
  // instead of hidden until a mouseenter that will never come.
  useEffect(() => {
    const mq = window.matchMedia("(hover: none)");
    const onMQ = () => setNoHover(mq.matches);
    onMQ();
    mq.addEventListener("change", onMQ);
    return () => mq.removeEventListener("change", onMQ);
  }, []);

  // column detection
  useEffect(() => {
    const detect = () => {
      const grid = gridRef.current;
      if (!grid) return;
      const n = getComputedStyle(grid)
        .gridTemplateColumns.trim()
        .split(/\s+/)
        .filter(Boolean).length;
      setCols(n);
    };
    const ro = new ResizeObserver(detect);
    const grid = gridRef.current;
    if (grid) ro.observe(grid);
    detect();
    return () => ro.disconnect();
  }, [artworks]);

  // hash → category
  useEffect(() => {
    const apply = () => {
      const h = decodeURIComponent(window.location.hash.slice(1));
      if (h && (CATS as readonly string[]).includes(h)) setCat(h);
    };
    apply();
    window.addEventListener("hashchange", apply);
    return () => window.removeEventListener("hashchange", apply);
  }, []);

  const data = useMemo(
    () =>
      artworks.map((a) => ({
        id: a.id,
        name: a.name,
        category: a.category,
        status: a.status,
        images: [
          imgSrc(a.image_url),
          ...(a.extra_images ?? []).map(imgSrc),
        ],
      })),
    [artworks]
  );

  const filtered = useMemo(
    () => (cat === "ALL" ? data : data.filter((a) => a.category === cat)),
    [data, cat]
  );
  const showDeco = cols >= 3;

  const tabCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: data.length };
    for (const c of CATS) {
      if (c !== "ALL") counts[c] = data.filter((a) => a.category === c).length;
    }
    return counts;
  }, [data]);

  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        background: "var(--bg)",
        color: "var(--text)",
        fontFamily: "var(--font-mono)",
        overflowX: "hidden",
      }}
    >
      {/* grunge overlay */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundImage: "url('/brand/scratch-tex.webp')",
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
          padding: "56px clamp(24px,6vw,92px) 120px",
        }}
      >
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 400,
            fontSize: "clamp(64px,9vw,120px)",
            lineHeight: 0.92,
            letterSpacing: "0.01em",
            color: "var(--text)",
            margin: "0 0 40px",
          }}
        >
          Showcase
        </h1>

        {/* category tabs */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            marginBottom: 40,
          }}
        >
          {CATS.map((c) => {
            const active = c === cat;
            return (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={active ? undefined : "tab-btn"}
                style={{
                  position: "relative",
                  fontFamily: "var(--font-sf)",
                  fontWeight: 400,
                  fontSize: 18,
                  lineHeight: 1,
                  color: active ? "var(--accent)" : "var(--text)",
                  background: "transparent",
                  border: "none",
                  padding: "11px 12px",
                  cursor: "pointer",
                  textTransform: "uppercase",
                  transition: "color .2s ease",
                }}
              >
                {c}
                <span style={{ opacity: 0.4 }}> / {tabCounts[c]}</span>
                <span
                  aria-hidden
                  style={{
                    position: "absolute",
                    left: 12,
                    right: 12,
                    bottom: 6,
                    height: 2,
                    background: "var(--accent)",
                    transform: active ? "scaleX(1)" : "scaleX(0)",
                    transformOrigin: "center",
                    transition: "transform .25s ease",
                  }}
                />
              </button>
            );
          })}
        </div>

        {/* grid */}
        <div
          ref={gridRef}
          className="gallery-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(258px, 1fr))",
            gap: 16,
            overflow: "visible",
          }}
        >
          {showDeco && (
            <div
              style={{
                gridRow: 1,
                gridColumn: "-2 / -1",
                position: "relative",
                aspectRatio: "298/400",
                overflow: "visible",
                pointerEvents: "none",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  bottom: 0,
                  height: "130%",
                  width: "auto",
                  aspectRatio: "1/1",
                  backgroundImage: `url('${DECO_IMAGES[cat] || "/samples/single-xs.webp"}')`,
                  backgroundSize: "contain",
                  backgroundPosition: "left bottom",
                  backgroundRepeat: "no-repeat",
                }}
              />
            </div>
          )}

          {filtered.map((a, cardIndex) => (
            <GalleryCard
              key={a.id}
              a={a}
              cardIndex={cardIndex}
              idx={imgIndexes[a.id] || 0}
              hovered={hoveredCard === a.id}
              noHover={noHover}
              onHoverEnter={() => setHoveredCard(a.id)}
              onHoverLeave={() => setHoveredCard(null)}
              onChangeIdx={(finalIdx) =>
                setImgIndexes((s) => ({ ...s, [a.id]: finalIdx }))
              }
            />
          ))}
        </div>
        {filtered.length === 0 && (
          <div
            style={{
              padding: "80px 0",
              textAlign: "center",
              color: "var(--text-dim)",
              fontSize: 16,
            }}
          >
            No pieces in this category yet.
          </div>
        )}
      </main>
    </div>
  );
}

function GalleryCard({
  a,
  cardIndex,
  idx,
  hovered,
  noHover,
  onHoverEnter,
  onHoverLeave,
  onChangeIdx,
}: {
  a: GalleryCardData;
  cardIndex: number;
  idx: number;
  hovered: boolean;
  noHover: boolean;
  onHoverEnter: () => void;
  onHoverLeave: () => void;
  onChangeIdx: (finalIdx: number) => void;
}) {
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const [setCardRef, visible] = useInView();

  const images = a.images;
  const total = images.length;
  const available = a.status === "available";

  const changeIdx = (newIdx: number) => {
    onChangeIdx(((newIdx % total) + total) % total);
  };
  const setIdx = (newIdx: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    changeIdx(newIdx);
  };

  return (
    <Link
      ref={setCardRef}
      href={`/artwork/${a.id}`}
      className="gallery-card"
      onMouseEnter={onHoverEnter}
      onMouseLeave={onHoverLeave}
      onTouchStart={(e) => {
        const t = e.touches[0];
        touchStartRef.current = { x: t.clientX, y: t.clientY };
      }}
      onTouchEnd={(e) => {
        const start = touchStartRef.current;
        touchStartRef.current = null;
        if (!start || total <= 1) return;
        const t = e.changedTouches[0];
        const dx = t.clientX - start.x;
        const dy = t.clientY - start.y;
        // Only hijack the tap when it was clearly a horizontal swipe —
        // otherwise let it navigate (tap) or scroll (vertical drag) as normal.
        if (Math.abs(dx) > 30 && Math.abs(dx) > Math.abs(dy)) {
          e.preventDefault();
          changeIdx(idx + (dx < 0 ? 1 : -1));
        }
      }}
      style={{
        position: "relative",
        display: "block",
        aspectRatio: "298/400",
        background: "var(--bg-deep)",
        overflow: "hidden",
        textDecoration: "none",
        cursor: "pointer",
        ...revealStyle(visible, (cardIndex % 3) * 60),
      }}
    >
      {/* All of the card's photos are mounted together (not just the active
          one) so flipping through them is instant — otherwise each swipe
          would mount a fresh <Image> and the next photo would only start
          downloading at that moment. Neighbours sit nudged a few px to the
          side they'll enter/exit from, so switching reads as a soft slide
          instead of a flat crossfade. */}
      {images.map((src, i) => {
        const nudge = i === idx ? 0 : i > idx ? 14 : -14;
        return (
          <Image
            key={`${a.id}-${i}`}
            src={src}
            alt={a.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={cardIndex < 3 && i === 0}
            style={{
              objectFit: "cover",
              opacity: i === idx ? 1 : 0,
              transform: `translateX(${nudge}px) scale(${
                i === idx && hovered ? 1.04 : 1
              })`,
              transition: "opacity .3s ease, transform .3s ease",
            }}
          />
        );
      })}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 120,
          background: "linear-gradient(to top, rgba(7,7,7,0.85), transparent)",
          pointerEvents: "none",
        }}
      />
      {total > 1 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            opacity: hovered || noHover ? 1 : 0,
            transition: "opacity 0.2s",
            pointerEvents: "none",
          }}
        >
          <button onClick={(e) => setIdx(idx - 1, e)} style={arrowBtn}>
            <span
              style={{
                display: "block",
                width: 8,
                height: 8,
                borderLeft: "2px solid currentColor",
                borderBottom: "2px solid currentColor",
                transform: "rotate(45deg)",
                marginLeft: 4,
              }}
            />
          </button>
          <button onClick={(e) => setIdx(idx + 1, e)} style={arrowBtn}>
            <span
              style={{
                display: "block",
                width: 8,
                height: 8,
                borderRight: "2px solid currentColor",
                borderTop: "2px solid currentColor",
                transform: "rotate(45deg)",
                marginRight: 4,
              }}
            />
          </button>
        </div>
      )}
      <div style={{ position: "absolute", left: 16, bottom: 18, display: "flex", gap: 5 }}>
        {Array.from({ length: total }, (_, i) => (
          <span
            key={i}
            style={{
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: i === idx ? "var(--accent)" : "rgba(238,233,219,0.4)",
            }}
          />
        ))}
      </div>
      <div
        style={{
          position: "absolute",
          right: 14,
          bottom: 16,
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "6px 0",
        }}
      >
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
            fontFamily: "var(--font-mono)",
            fontWeight: 500,
            fontSize: 14,
            lineHeight: 1,
            color: available ? "var(--available)" : "var(--sold)",
          }}
        >
          {available ? "Available" : "Sold"}
        </span>
      </div>
    </Link>
  );
}

const arrowBtn: React.CSSProperties = {
  pointerEvents: "all",
  width: 36,
  height: 56,
  background: "rgba(0,0,0,0.5)",
  border: "none",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "var(--text)",
  flexShrink: 0,
};

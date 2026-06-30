import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import HomeView from "@/components/HomeView";

/**
 * Landing page — route "/".
 */
export default function HomePage() {
  return (
    <main
      style={{
        position: "relative",
        background: "var(--bg)",
        color: "var(--text)",
        fontFamily: "var(--font-sf)",
      }}
    >
      {/* global scratch texture */}
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
      <SiteHeader variant="home" />
      <HomeView />
      <SiteFooter />
    </main>
  );
}

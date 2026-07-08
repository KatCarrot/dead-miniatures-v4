import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export default function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <main
      style={{
        position: "relative",
        background: "var(--bg)",
        color: "var(--text)",
        fontFamily: "var(--font-sf)",
      }}
    >
      <SiteHeader variant="inner" />
      <div
        style={{
          maxWidth: 820,
          margin: "0 auto",
          padding: "64px clamp(20px,6vw,64px) 120px",
        }}
      >
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 400,
            fontSize: "clamp(48px,7vw,72px)",
            lineHeight: 0.95,
            margin: "0 0 8px",
            textTransform: "uppercase",
          }}
        >
          {title}
        </h1>
        <p style={{ margin: "0 0 48px", fontSize: 14, color: "var(--text-dim)" }}>
          Last updated: {updated}
        </p>
        <div className="legal-content">{children}</div>
      </div>
      <SiteFooter />
    </main>
  );
}

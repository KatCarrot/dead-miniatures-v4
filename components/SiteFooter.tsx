import Link from "next/link";

const span: React.CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: 14,
  color: "var(--text-dim)",
};

export default function SiteFooter() {
  return (
    <footer
      style={{
        position: "relative",
        zIndex: 1,
        borderTop: "1px solid var(--foot-line)",
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 12,
        padding: "36px clamp(20px,6vw,40px)",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <span style={span}>© Dead Miniatures 2026</span>
      <span style={span}>Custom miniature painting</span>
      <Link href="#" style={{ ...span, textDecoration: "none" }}>
        Privacy Policy
      </Link>
    </footer>
  );
}

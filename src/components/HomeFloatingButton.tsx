import { useEffect, useState, type CSSProperties } from "react";

const DATA_LIBRARY_URL = "https://data.pankbase.org";
const SCROLL_THRESHOLD = 180;

const baseStyle: CSSProperties = {
  position: "fixed",
  bottom: "28px",
  left: "28px",
  zIndex: 9999,
  display: "inline-flex",
  alignItems: "center",
  gap: "0.5rem",
  borderRadius: "999px",
  background: "#0d9488",
  color: "#ffffff",
  padding: "10px 18px",
  fontSize: "13px",
  fontWeight: 500,
  fontFamily: "inherit",
  textDecoration: "none",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
  transition:
    "opacity 0.25s ease, transform 0.25s ease, background-color 0.2s ease",
};

export default function HomeFloatingButton() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setIsVisible(window.scrollY > SCROLL_THRESHOLD);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const style: CSSProperties = {
    ...baseStyle,
    opacity: isVisible ? 1 : 0,
    transform: isVisible
      ? isHovered
        ? "translateY(-1px)"
        : "translateY(0)"
      : "translateY(8px)",
    pointerEvents: isVisible ? "auto" : "none",
    background: isHovered ? "#0a7c72" : "#0d9488",
  };

  return (
    <a
      href={DATA_LIBRARY_URL}
      aria-label="Return to PanKbase Data Library home"
      style={style}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span aria-hidden="true">⌂</span>
      Data Library
    </a>
  );
}

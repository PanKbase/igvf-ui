import { HomeIcon } from "@heroicons/react/20/solid";
import { useState, type CSSProperties } from "react";

const DATA_LIBRARY_URL = "https://data.pankbase.org";

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
  transition: "transform 0.2s ease, background-color 0.2s ease",
};

export default function HomeFloatingButton() {
  const [isHovered, setIsHovered] = useState(false);

  const style: CSSProperties = {
    ...baseStyle,
    transform: isHovered ? "translateY(-1px)" : "translateY(0)",
    background: isHovered ? "#0a7c72" : "#0d9488",
  };

  return (
    <a
      href={DATA_LIBRARY_URL}
      className="pkb-floating-home-btn"
      aria-label="Return to PanKbase Data Library home"
      style={style}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <HomeIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
      Data Library
    </a>
  );
}

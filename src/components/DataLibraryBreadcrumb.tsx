import { useRouter } from "next/router";
import { useMemo, type CSSProperties } from "react";

const DATA_LIBRARY_URL = "https://data.pankbase.org";

function formatPageName(pathname: string): string {
  const segments = pathname.replace(/\/$/, "").split("/").filter(Boolean);
  if (segments.length === 0) {
    return "Home";
  }
  const lastSegment = segments[segments.length - 1];
  return lastSegment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

const navStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  width: "100%",
  height: "36px",
  padding: "0 1rem",
  boxSizing: "border-box",
  background: "#f0fafa",
  borderBottom: "1px solid #cde8e5",
  fontSize: "13px",
  color: "#374151",
  fontFamily: "inherit",
};

const linkStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "0.35rem",
  color: "#0d9488",
  textDecoration: "none",
  fontWeight: 500,
};

const separatorStyle: CSSProperties = {
  margin: "0 0.5rem",
  color: "#9ca3af",
};

const currentStyle: CSSProperties = {
  color: "#374151",
};

export default function DataLibraryBreadcrumb() {
  const router = useRouter();
  const pageName = useMemo(
    () => formatPageName(router.pathname),
    [router.pathname]
  );

  return (
    <nav aria-label="breadcrumb" style={navStyle}>
      <a href={DATA_LIBRARY_URL} style={linkStyle}>
        <span aria-hidden="true">⌂</span>
        PanKbase Data Library
      </a>
      <span style={separatorStyle} aria-hidden="true">
        /
      </span>
      <span aria-current="page" style={currentStyle}>
        {pageName}
      </span>
    </nav>
  );
}

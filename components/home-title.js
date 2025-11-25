import React, { useEffect } from "react";
import Link from "next/link";

export const pkbMenu = {
  highlightItems: [
    { label: "Data Library", path: "/" },
    { label: "PanKgraph", path: "https://pankgraph.org/" },
    {
      label: "Integrated Cell Browser",
      path: "https://pankbase.org/single-cell.html",
    },
  ],
  menuItems: [
    {
      label: "Data",
      path: "",
      subMenuItems: [
        {
          label: "Donor Summary",
          path: "https://pankbase.org/donor-metadata.html",
        },
        {
          label: "Funding Opportunities",
          path: "https://pankbase.org/funding.html",
        },
        { label: "Data Library", path: "https://data.pankbase.org" },
        {
          label: "User Guide",
          path: "https://data.pankbase.org/help/general-help/user-guide",
        },
        {
          label: "Scripts",
          path: "https://github.com/PanKbase/PanKbase-data-library-scripts",
        },
        { label: "Schema", path: "https://data.pankbase.org/profiles" },
        { label: "APIs", path: "https://pankbase.org/apis.html" },
      ],
    },
    {
      label: "Resources",
      path: "",
      subMenuItems: [
        {
          label: "Integrated Cell Browser",
          path: "https://pankbase.org/single-cell.html",
        },
        {
          label: "Differential Gene Expression Browser",
          path: "https://pankbase.org/diff-exp.html",
        },
        {
          label: "PCA Explorer",
          path: "https://pankbase.org/pca-explorer.html",
        },
        {
          label: "Analytical Library",
          path: "https://pankbase.org/analytical-library.html",
        },
        {
          label: "Metadata Standards",
          path: "https://pankbase.org/metadata-data-standards.html",
        },
        {
          label: "Tools | Pipelines",
          path: "https://pankbase.org/tools-pipelines.html",
        },
        {
          label: "Publications",
          path: "https://pankbase.org/publications.html",
        },
      ],
    },
    {
      label: "About",
      path: "",
      subMenuItems: [
        { label: "Project", path: "https://pankbase.org/projects.html" },
        { label: "People", path: "https://pankbase.org/people.html" },
        { label: "Policies", path: "https://pankbase.org/policies.html" },
        {
          label: "Related Programs",
          path: "https://pankbase.org/programs.html",
        },
        { label: "Collaborate", path: "https://pankbase.org/collaborate.html" },
      ],
    },
    {
      label: "Help",
      path: "",
      subMenuItems: [
        {
          label: "Contact | Feedback",
          path: "https://pankbase.org/contact.html",
        },
        { label: "Tutorials", path: "https://pankbase.org/tutorials.html" },
        { label: "GitHub", path: "https://github.com/PanKbase" },
        { label: "News", path: "https://pankbase.org/news.html" },
      ],
    },
  ],
};

// Module-level variable to track if menu item is active (matching Vue behavior)
let menuItemActive = false;

function injectFavicon(faviconUrl) {
  if (typeof window === "undefined") {
    return;
  }
  let favicon = document.querySelector('link[rel="icon"]');
  if (!favicon) {
    favicon = document.createElement("link");
    favicon.setAttribute("rel", "icon");
    favicon.setAttribute("type", "image/png");
    document.head.appendChild(favicon);
  }
  favicon.setAttribute("href", faviconUrl);
}

function injectFont(fontUrl) {
  if (typeof window === "undefined") {
    return;
  }
  const linkTag = document.createElement("link");
  linkTag.rel = "stylesheet";
  linkTag.href = fontUrl;
  document.head.appendChild(linkTag);
}

export default function Header() {
  useEffect(() => {
    injectFavicon(
      "https://hugeampkpncms.org/sites/default/files/users/user32/pankbase/PanKbase_logo-icon.png"
    );
    injectFont(
      "https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap"
    );
  }, []);

  function isActive(path) {
    if (menuItemActive) {
      return false;
    }
    if (typeof window !== "undefined") {
      const currentPath = window.location.pathname;
      if (path === currentPath) {
        menuItemActive = true;
        return true;
      }
    }
    return false;
  }

  return (
    <div style={{ width: "100%" }}>
      <div className="pkb-nav">
        <div className="logo">
          <Link href="/">
            <img
              style={{ height: "50px" }}
              src="https://hugeampkpncms.org/sites/default/files/users/user32/pankbase/PanKbase_logo-black-tagline.svg"
              alt="PanKbase Logo"
            />
          </Link>
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <div className="menu-wrapper">
            <div className="topmenu">
              <a className="topmenu-item" href="/funding.html">
                Funding Opportunities
                <img
                  style={{ height: "15px", width: "15px" }}
                  src="https://hugeampkpncms.org/sites/default/files/images/pankbase/icons/funding_icon_black.svg"
                  alt=""
                />
              </a>
              <a className="topmenu-item disabled">
                Search
                <img
                  style={{ height: "15px", width: "15px" }}
                  src="https://hugeampkpncms.org/sites/default/files/users/user32/pankbase/search-icon.svg"
                  alt=""
                />
              </a>
              <a className="topmenu-item disabled">Analysis</a>
              <a className="topmenu-item disabled">
                Login
                <img
                  style={{ height: "15px", width: "15px" }}
                  src="https://hugeampkpncms.org/sites/default/files/users/user32/pankbase/user-icon.svg"
                  alt=""
                />
              </a>
            </div>
            <div className="menu">
              <div className="main-menu-items">
                {pkbMenu.highlightItems.map((item, index) => (
                  <div
                    key={`highlight-${index}`}
                    className={`menu-item-wrapper ${isActive(item.path) ? "active" : ""}`}
                  >
                    <a className="menu-item menu-item-main" href={item.path}>
                      {item.label}
                    </a>
                  </div>
                ))}
              </div>
              {pkbMenu.menuItems.map((item, index) => (
                <div
                  key={`menu-${index}`}
                  className={`menu-item-wrapper ${isActive(item.path) ? "active" : ""}`}
                >
                  <a className="menu-item" href={item.path || null}>
                    {item.label}
                  </a>
                  {item.subMenuItems && (
                    <div className="submenu">
                      {item.subMenuItems.map((subItem, subIndex) => (
                        <a
                          key={`submenu-${index}-${subIndex}`}
                          className={`submenu-item ${isActive(subItem.path) ? "active" : ""}`}
                          href={subItem.path || null}
                          data-whatever={isActive(subItem.path).toString()}
                        >
                          {subItem.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <a href="https://hirnetwork.org/" target="_blank" rel="noopener noreferrer">
            <img
              style={{ height: "37px" }}
              src="https://hugeampkpncms.org/sites/default/files/images/pankbase/logo-hirn.svg"
              alt="HIRN Logo"
            />
          </a>
        </div>
        <div className="pkb-beta">beta</div>
      </div>
    </div>
  );
}

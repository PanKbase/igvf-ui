import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import NavigationSection from "../components/navigation";

export const pkbMenu = {
  // Menu data unchanged...
  highlightItems: [
    { label: "PanKgraph", path: "https://pankgraph.org/" },
    {
      label: "Integrated Cell Browser",
      path: "https://dev.pankbase.org/single-cell.html",
    },
  ],
  menuItems: [
    {
      label: "Data",
      path: "",
      subMenuItems: [
        {
          label: "Donor Summary",
          path: "https://dev.pankbase.org/donor-metadata.html",
        },
        { label: "Data Library", path: "https://data.pankbase.org" },
        { label: "APIs", path: "https://dev.pankbase.org/apis.html" },
      ],
    },
    // Other menu items unchanged...
    {
      label: "Resources",
      path: "",
      subMenuItems: [
        {
          label: "Integrated Cell Browser",
          path: "https://dev.pankbase.org/single-cell.html",
        },
        {
          label: "Differential Gene Expression Browser",
          path: "https://dev.pankbase.org/diff-exp.html",
        },
        {
          label: "Analytical Library",
          path: "https://dev.pankbase.org/analytical-library.html",
        },
        {
          label: "Metadata Standards",
          path: "https://dev.pankbase.org/metadata-data-standards.html",
        },
        {
          label: "Tools | Pipelines",
          path: "https://dev.pankbase.org/tools-pipelines.html",
        },
        {
          label: "Publications",
          path: "https://dev.pankbase.org/publications.html",
        },
      ],
    },
    {
      label: "About",
      path: "",
      subMenuItems: [
        { label: "Project", path: "https://dev.pankbase.org/projects.html" },
        { label: "People", path: "https://dev.pankbase.org/people.html" },
        { label: "Policies", path: "https://dev.pankbase.org/policies.html" },
        { label: "Programs", path: "https://dev.pankbase.org/programs.html" },
        { label: "Collaborate", path: "https://dev.pankbase.org/collaborate.html" },
      ],
    },
    {
      label: "Help",
      path: "",
      subMenuItems: [
        { label: "Contact | Feedback", path: "https://dev.pankbase.org/contact.html" },
        { label: "Tutorials", path: "https://dev.pankbase.org/tutorials.html" },
        { label: "GitHub", path: "https://github.com/PanKbase" },
        { label: "News", path: "https://dev.pankbase.org/news.html" },
      ],
    },
  ],
};

// SiteLogo component
function SiteLogo() {
  return (
    <Image
      width={50}
      height={50}
      style={{ height: "50px", width: "auto" }}
      src="https://hugeampkpncms.org/sites/default/files/users/user32/pankbase/PanKbase_logo-black-tagline.svg"
      alt="PanKbase Logo"
    />
  );
}

function injectFavicon(faviconUrl) {
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
  const linkTag = document.createElement("link");
  linkTag.rel = "stylesheet";
  linkTag.href = fontUrl;
  document.head.appendChild(linkTag);
}

export default function Header() {
  // State to track if any menu item is active (used in isActive function)
  const [menuItemActive, setMenuItemActive] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      injectFavicon(
        "https://hugeampkpncms.org/sites/default/files/users/user32/pankbase/PanKbase_logo-icon.png"
      );
      injectFont(
        "https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap"
      );
    }
  }, []);
  function isActive(path) {
    if (menuItemActive) {
      return false;
    }
    if (typeof window !== "undefined") {
      const currentPath = window.location.pathname;
      if (path === currentPath) {
        setMenuItemActive(true);
        return true;
      }
    }
    return false;
  }
  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (mobileMenuOpen && !event.target.closest(".pkb-nav")) {
        setMobileMenuOpen(false);
      }
    }

    if (typeof window !== "undefined") {
      document.addEventListener("click", handleClickOutside);
      return () => {
        document.removeEventListener("click", handleClickOutside);
      };
    }
  }, [mobileMenuOpen]);
  return (
    <div className={`pkb-nav ${!mobileMenuOpen ? "mobile-menu-closed" : ""}`}>
      <div className="logo">
        <Link href="https://dev.pankbase.org">
          <SiteLogo />
        </Link>
      </div>
      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
        <div className="menu-wrapper">
          <div className="topmenu">
            <a className="topmenu-item" href="https://data.dev.pankbase.org">
              Data Library Home
            </a>
            <a
              className="topmenu-item"
              href="https://data.dev.pankbase.org/profiles"
            >
              Data Library Schema
            </a>
            <NavigationSection />
          </div>
          <div className="menu">
            <div className="main-menu-items">
              {pkbMenu.highlightItems.map((item, index) => (
                <div
                  key={`highlight-${index}`}
                  className={`menu-item-wrapper ${isActive(item.path) ? "active" : ""}`}
                >
                  <a
                    className="menu-item menu-item-main"
                    href={item.path}
                    target={item.path.startsWith("http") ? "_blank" : "_self"}
                    rel={
                      item.path.startsWith("http") ? "noopener noreferrer" : ""
                    }
                  >
                    {item.label}
                  </a>
                </div>
              ))}
            </div>
            {/* Regular menu items with submenus */}
            {pkbMenu.menuItems.map((item, index) => (
              <div
                key={`menu-${index}`}
                className={`menu-item-wrapper ${isActive(item.path) ? "active" : ""}`}
              >
                <a className="menu-item" href={item.path || "#"}>
                  {item.label}
                </a>
                {item.subMenuItems && (
                  <div className="submenu">
                    {item.subMenuItems.map((subItem, subIndex) => (
                      <a
                        key={`submenu-${index}-${subIndex}`}
                        className={`submenu-item ${isActive(subItem.path) ? "active" : ""}`}
                        href={subItem.path || null}
                        target={
                          subItem.path && subItem.path.startsWith("http")
                            ? "_blank"
                            : "_self"
                        }
                        rel={
                          subItem.path && subItem.path.startsWith("http")
                            ? "noopener noreferrer"
                            : ""
                        }
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
        <a
          href="https://hirnetwork.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            width={37}
            height={37}
            src="https://hugeampkpncms.org/sites/default/files/images/pankbase/logo-hirn.svg"
            alt="HIRN Logo"
          />
        </a>
      </div>
      {/* Beta tag */}
      <div className="pkb-beta">beta</div>
    </div>
  );
}

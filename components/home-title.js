import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Menu data structure from script 5
export const pkbMenu = {
    highlightItems: [
        { label: "PanKgraph", path: "https://pankgraph.org/" },
        { label: "Integrated Cell Browser", path: "/single-cell.html" },
    ],
    menuItems: [
        {
            label: "Data",
            path: "",
            subMenuItems: [
                {
                    label: "Donor Summary",
                    path: "/donor-metadata.html",
                },
                { label: "Data Library", path: "https://data.pankbase.org" },
                { label: "APIs", path: "/apis.html" },
            ],
        },
        {
            label: "Resources",
            path: "",
            subMenuItems: [
                { label: "Integrated Cell Browser", path: "/single-cell.html" },
                {
                    label: "Analytical Library",
                    path: "/analytical-library.html",
                },
                { label: "Publications", path: "/publications.html" },
            ],
        },
        {
            label: "About",
            path: "",
            subMenuItems: [
                { label: "Project", path: "/projects.html" },
                { label: "People", path: "/people.html" },
                { label: "Policies", path: "/policies.html" },
                { label: "Programs", path: "/programs.html" },
                { label: "Collaborate", path: "/collaborate.html" },
            ],
        },
        {
            label: "Help",
            path: "",
            subMenuItems: [
                { label: "Contact | Feedback", path: "/contact.html" },
                {
                    label: "Metadata | Data Standards",
                    path: "/metadata-data-standards.html",
                },
                { label: "Tools | Pipelines", path: "/tools-pipelines.html" },
                { label: "Tutorials", path: "/tutorials.html" },
                { label: "News", path: "/news.html" },
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
      style={{ height: '50px', width: 'auto' }}
      src="https://hugeampkpncms.org/sites/default/files/users/user32/pankbase/PanKbase_logo-black-tagline.svg"
      alt="PanKbase Logo"
    />
  );
}

// NavigationSection component - maintained from original script 1
function NavigationSection() {
  return (
    <div className="nav-section">
      {/* Additional navigation elements can go here */}
    </div>
  );
}

function injectFavicon(faviconUrl) {
  let favicon = document.querySelector('link[rel="icon"]');
  if (!favicon) {
    favicon = document.createElement('link');
    favicon.setAttribute('rel', 'icon');
    favicon.setAttribute('type', 'image/png');
    document.head.appendChild(favicon);
  }
  favicon.setAttribute('href', faviconUrl);
}

function injectFont(fontUrl) {
  const linkTag = document.createElement('link');
  linkTag.rel = 'stylesheet';
  linkTag.href = fontUrl;
  document.head.appendChild(linkTag);
}

export default function Header() {
  // State to track if any menu item is active (used in isActive function)
  const [menuItemActive, setMenuItemActive] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Using the same favicon from script 3
      injectFavicon(
        "https://hugeampkpncms.org/sites/default/files/users/user32/pankbase/PanKbase_logo-icon.png"
      );
      injectFont(
        "https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap"
      );
    }
  }, []);

  // Helper to check if a path matches the current URL - follows script 3's logic
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

  return (
    <div className="pkb-nav">
      <div className="logo">
        <Link href="https://pankbase.org">
          <SiteLogo />
        </Link>
      </div>
      
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <div className="menu-wrapper">
          <div className="topmenu">
            {/* Top menu from script 1 */}
            <a className="topmenu-item" href="https://data.pankbase.org">Data Library Home</a>
            <a className="topmenu-item" href="https://data.pankbase.org/profiles">Data Library Schema</a>
            
            {/* Top menu from script 3 */}
            <a className="topmenu-item">
              Search
              <Image
                width={15}
                height={15}
                src="https://hugeampkpncms.org/sites/default/files/users/user32/pankbase/search-icon.svg"
                alt="Search"
              />
            </a>
            <a className="topmenu-item">Analysis</a>
            <a className="topmenu-item">
              Login
              <Image
                width={15}
                height={15}
                src="https://hugeampkpncms.org/sites/default/files/users/user32/pankbase/user-icon.svg"
                alt="Login"
              />
            </a>
            <NavigationSection />
          </div>
          
          <div className="menu">
            {/* Highlight items using the main-menu-items class from script 3 */}
            <div className="main-menu-items">
              {pkbMenu.highlightItems.map((item, index) => (
                <div 
                  key={`highlight-${index}`}
                  className={`menu-item-wrapper ${isActive(item.path) ? 'active' : ''}`}
                >
                  <a
                    className="menu-item menu-item-main"
                    href={item.path}
                    target={item.path.startsWith('http') ? "_blank" : "_self"}
                    rel={item.path.startsWith('http') ? "noopener noreferrer" : ""}
                  >
                    {item.label}
                  </a>
                </div>
              ))}
            </div>
            
            {/* Vertical separator as in script 1 */}
            <span className="menu-separator">|</span>
            
            {/* Regular menu items with submenus */}
            {pkbMenu.menuItems.map((item, index) => (
              <div
                key={`menu-${index}`}
                className={`menu-item-wrapper ${isActive(item.path) ? 'active' : ''}`}
              >
                <a
                  className="menu-item"
                  href={item.path || "#"}
                >
                  {item.label}
                </a>
                {item.subMenuItems && (
                  <div className="submenu">
                    {item.subMenuItems.map((subItem, subIndex) => (
                      <a
                        key={`submenu-${index}-${subIndex}`}
                        className={`submenu-item ${isActive(subItem.path) ? 'active' : ''}`}
                        href={subItem.path || null}
                        target={subItem.path && subItem.path.startsWith('http') ? "_blank" : "_self"}
                        rel={subItem.path && subItem.path.startsWith('http') ? "noopener noreferrer" : ""}
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
        
        {/* HIRN logo from script 3 */}
        <a href="https://hirnetwork.org/" target="_blank" rel="noopener noreferrer">
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

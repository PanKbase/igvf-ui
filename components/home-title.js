import React, { useEffect } from "react";
import Link from "next/link";
import PropTypes from "prop-types";
import { GOOGLE_OAUTH_CLIENT_ID } from "../lib/constants";

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

let menuItemActive = false;

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

export default function Header({ googleOAuthClientId }) {

  useEffect(() => {
    if (typeof window !== "undefined") {
      injectFavicon(
        "https://hugeampkpncms.org/sites/default/files/users/user32/pankbase/PanKbase_logo-icon.png"
      );
      injectFont(
        "https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap"
      );
      loadGoogleIdentityServices();
      handleOAuthCallback();
    }
  }, []);

  function loadGoogleIdentityServices() {
    if (typeof window === "undefined") {
      return;
    }

    // Check if already loaded
    if (window.google?.accounts?.id) {
      return;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onerror = () => {
      console.error("Failed to load Google Identity Services script");
    };
    document.head.appendChild(script);
  }

  function handleOAuthCallback() {
    // Handle Google OAuth callback if id_token is in URL hash
    if (typeof window === "undefined") {
      return;
    }

    const hash = window.location.hash;
    if (hash && hash.includes("id_token=")) {
      const params = new URLSearchParams(hash.substring(1));
      const idToken = params.get("id_token");
      if (idToken) {
        try {
          // Decode the credential (ID token) to get user info
          const base64Url = idToken.split(".")[1];
          const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
          const jsonPayload = decodeURIComponent(
            atob(base64)
              .split("")
              .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
              .join("")
          );
          const userInfo = JSON.parse(jsonPayload);

          // Store user info and token (same as React version)
          localStorage.setItem("google_oauth_user", JSON.stringify(userInfo));
          localStorage.setItem("google_oauth_id_token", idToken);

          // Clean up URL and reload to trigger React session context
          window.history.replaceState(
            {},
            document.title,
            window.location.pathname + window.location.search
          );
          window.location.reload();
        } catch (error) {
          console.error("Error processing Google OAuth callback:", error);
        }
      }
    }
  }

  function handleGoogleLogin() {
    // Try to use the React GoogleOAuthProvider's login function if available
    if (window.__googleOAuthLogin) {
      window.__googleOAuthLogin();
      return;
    }

    // Otherwise, use the same Google OAuth flow as the React component
    const clientId =
      googleOAuthClientId ||
      GOOGLE_OAUTH_CLIENT_ID ||
      process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID ||
      window.GOOGLE_OAUTH_CLIENT_ID;

    if (!clientId) {
      console.error("Google OAuth Client ID is not configured");
      alert(
        "Google OAuth Client ID is not configured. Please contact an administrator."
      );
      return;
    }

    if (typeof window === "undefined") {
      return;
    }

    // Use the same login flow as React GoogleOAuthProvider
    if (window.google?.accounts?.id) {
      try {
        // Initialize Google Identity Services with the same callback as React version
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: (response) => {
            try {
              // Decode the credential (ID token) to get user info
              const base64Url = response.credential.split(".")[1];
              const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
              const jsonPayload = decodeURIComponent(
                atob(base64)
                  .split("")
                  .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                  .join("")
              );
              const userInfo = JSON.parse(jsonPayload);

              // Store user info and token (same as React version)
              localStorage.setItem("google_oauth_user", JSON.stringify(userInfo));
              localStorage.setItem("google_oauth_id_token", response.credential);

              // Reload to trigger React session context to pick up the login
              window.location.reload();
            } catch (error) {
              console.error("Error processing Google ID token:", error);
            }
          },
        });

        // Try to show One Tap prompt (same as React version)
        window.google.accounts.id.prompt((_notification) => {
          // If One Tap can't be shown, redirect to Google OAuth
          const redirectUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(
            window.location.origin
          )}&response_type=id_token&scope=openid%20email%20profile&nonce=${Math.random()}`;
          window.location.href = redirectUrl;
        });
      } catch (error) {
        console.error("Error triggering Google login:", error);
        // Fallback: redirect to Google OAuth
        const redirectUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(
          window.location.origin
        )}&response_type=id_token&scope=openid%20email%20profile&nonce=${Math.random()}`;
        window.location.href = redirectUrl;
      }
    } else {
      // Google Identity Services not loaded, redirect directly to Google OAuth
      const redirectUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(
        window.location.origin
      )}&response_type=id_token&scope=openid%20email%20profile&nonce=${Math.random()}`;
      window.location.href = redirectUrl;
    }
  }

  function isActive(path) {
    //compare menu item's path to current path to set active
    //but only the first instance
    if (typeof window === "undefined") {
      return false;
    }
    if (menuItemActive) {
      return false;
    }
    const currentPath = window.location.pathname;
    if (path === currentPath) {
      menuItemActive = true;
      return true;
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
              <a className="topmenu-item disabled"> Analysis </a>
              <a
                className="topmenu-item"
                onClick={(e) => {
                  e.preventDefault();
                  handleGoogleLogin();
                }}
                style={{ cursor: "pointer" }}
              >
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
      <style jsx>{`
        .pkb-nav {
          position: relative;
          width: 100%;
          background: #fafafa;
          display: flex;
          justify-content: space-between;
          padding: 5px 20px 0 15px;
          border-bottom: 2px solid var(--pkb-primary-green);
          box-shadow: 0px 2px 5px var(--pkb-primary-green);
          z-index: 10;
          font-family: "Open Sans", sans-serif;
        }
        a,
        a:visited {
          color: black !important;
        }
        a:hover {
          text-decoration: none;
        }
        .logo {
          display: flex;
          align-items: baseline;
          cursor: pointer;
          align-self: center;
        }
        .logo-text {
          position: relative;
          font-weight: 800;
          font-size: 18px;
          color: var(--pkb-primary-green);
          margin-left: -10px;
        }
        .logo-super {
          position: absolute;
          bottom: 17px;
          right: 0;
          font-weight: 500;
          font-size: 11px;
          color: var(--pkb-secondary-green);
        }
        .menu-wrapper {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 5px;
        }
        .topmenu {
          display: flex;
          align-items: center;
          gap: 0px;
        }
        .topmenu-item {
          color: var(--pkb-black);
          padding: 5px 10px;
          display: flex;
          align-items: center;
          gap: 5px;
          cursor: pointer;
          font-size: 12px;
        }
        .topmenu-item:hover {
          color: var(--pkb-secondary-green) !important;
        }
        .topmenu-item:hover svg * {
          stroke: var(--pkb-secondary-green) !important;
        }
        .topmenu-item.disabled {
          opacity: 0.5;
          pointer-events: none;
        }
        .menu {
          display: flex;
          font-weight: 600;
        }
        .menu-item-wrapper {
          position: relative;
          display: flex;
        }
        .main-menu-items {
          display: flex;
          position: relative;
          padding-right: 2px;
        }
        .main-menu-items:after {
          content: "";
          position: absolute;
          top: 7px;
          right: 0px;
          width: 2px;
          background-color: var(--pkb-primary-green);
          height: 50%;
        }
        .menu-item {
          position: relative;
          padding: 5px 10px;
          cursor: pointer;
          border-radius: 10px 10px 0 0;
          font-weight: 600;
          color: var(--pkb-black);
          border-bottom: 5px solid transparent;
        }
        .menu-item.menu-item-main {
          color: var(--pkb-primary-green) !important;
        }
        .menu-item.menu-item-selected {
          color: var(--pkb-primary-green);
          border-bottom: 5px solid var(--pkb-primary-green);
        }
        .menu-item-wrapper:hover .menu-item,
        .menu-item-wrapper.active .menu-item,
        .menu-item-wrapper:has(.submenu-item.active) .menu-item {
          color: var(--pkb-primary-green) !important;
          border-bottom: 5px solid var(--pkb-primary-green);
        }
        .menu-item-wrapper:hover > .submenu {
          display: flex;
        }
        .submenu {
          position: absolute;
          top: 100%;
          right: 0;
          background: var(--pkb-secondary-green);
          padding: 10px 10px 15px 15px;
          border-radius: 0 0 5px 5px;
          width: max-content;
          flex-direction: column;
          align-items: flex-end;
          gap: 5px;
          display: none;
          border-top: 2px solid var(--pkb-primary-green);
          box-shadow: inset 0 7px 5px -5px var(--pkb-primary-green);
        }
        .submenu-item {
          color: var(--pkb-black);
          width: -webkit-fill-available;
          text-align: right;
        }
        .submenu-item:hover,
        .submenu-item.active {
          color: white !important;
          cursor: pointer;
        }
        .pkb-beta {
          height: 20px;
          line-height: 16px;
          background: #219197;
          color: white;
          padding: 2px 15px 0;
          position: absolute;
          bottom: -20px;
          left: 19px;
          mix-blend-mode: multiply;
        }
      `}</style>
    </div>
  );
}

Header.propTypes = {
  googleOAuthClientId: PropTypes.string,
};

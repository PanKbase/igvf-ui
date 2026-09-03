import React, { useContext, useEffect, useRef, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { pkbMenu } from "../lib/pkbMenu";
import { loginAuthProvider, logoutAuthProvider } from "../lib/authentication";
import { Button } from "./form-elements";
import Modal from "./modal";
import SessionContext from "./session-context";

const LOGO_URL =
  "https://hugeampkpncms.org/sites/default/files/users/user32/pankbase/PanKbase_logo-black-tagline.svg";
const FUNDING_ICON_URL =
  "https://hugeampkpncms.org/sites/default/files/images/pankbase/icons/funding_icon_black.svg";
const SEARCH_ICON_URL =
  "https://hugeampkpncms.org/sites/default/files/users/user32/pankbase/search-icon.svg";
const USER_ICON_URL =
  "https://hugeampkpncms.org/sites/default/files/users/user32/pankbase/user-icon.svg";
const HIRN_LOGO_URL =
  "https://hugeampkpncms.org/sites/default/files/images/pankbase/logo-hirn.svg";
const FAVICON_URL =
  "https://hugeampkpncms.org/sites/default/files/users/user32/pankbase/PanKbase_logo-icon.png";
const OPEN_SANS_URL =
  "https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap";

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

function HeaderAuthControl() {
  const [isWarningOpen, setIsWarningOpen] = useState(false);
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();
  const { sessionProperties, setAuthStageLogin, setAuthStageLogout } =
    useContext(SessionContext);

  if (isAuthenticated) {
    const userTitle = sessionProperties?.user?.title || "Sign Out";
    return (
      <>
        <button
          type="button"
          className="topmenu-item topmenu-item-login"
          data-testid="navigation-authenticate"
          onClick={() => setIsWarningOpen(true)}
        >
          {userTitle}
          <img
            style={{ height: "15px", width: "15px" }}
            src={USER_ICON_URL}
            alt=""
          />
        </button>
        <Modal isOpen={isWarningOpen} onClose={() => setIsWarningOpen(false)}>
          <Modal.Header
            onClose={() => setIsWarningOpen(false)}
            closeLabel="Cancel signing out"
          >
            <h2 className="text-lg font-semibold">Sign Out {userTitle}</h2>
          </Modal.Header>
          <Modal.Body>
            Once you sign out, you only see publicly released data.
          </Modal.Body>
          <Modal.Footer>
            <Button
              type="secondary"
              onClick={() => setIsWarningOpen(false)}
              label="Cancel signing out"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                setAuthStageLogout?.();
                logoutAuthProvider(logout);
              }}
              label={`Sign out ${userTitle}`}
              id="sign-out-confirm"
            >
              <span data-testid="navigation-signout">Sign Out</span>
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }

  return (
    <button
      type="button"
      className="topmenu-item topmenu-item-login"
      data-testid="navigation-authenticate"
      onClick={() => {
        setAuthStageLogin?.();
        loginAuthProvider(loginWithRedirect);
      }}
    >
      Login
      <img
        style={{ height: "15px", width: "15px" }}
        src={USER_ICON_URL}
        alt=""
      />
    </button>
  );
}

export default function Header() {
  const menuItemActiveRef = useRef(false);

  useEffect(() => {
    injectFavicon(FAVICON_URL);
    injectFont(OPEN_SANS_URL);
  }, []);

  function isActive(path) {
    if (menuItemActiveRef.current) {
      return false;
    }
    if (typeof window !== "undefined" && path === window.location.pathname) {
      menuItemActiveRef.current = true;
      return true;
    }
    return false;
  }

  menuItemActiveRef.current = false;

  return (
    <div style={{ width: "100%" }}>
      <div className="pkb-nav">
        <div className="logo">
          <a href="https://pankbase.org/">
            <img style={{ height: "50px" }} src={LOGO_URL} alt="PanKbase Logo" />
          </a>
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <div className="menu-wrapper">
            <div className="topmenu">
              <a className="topmenu-item" href="https://pankbase.org/funding.html">
                Funding Opportunities
                <img
                  style={{ height: "15px", width: "15px" }}
                  src={FUNDING_ICON_URL}
                  alt=""
                />
              </a>
              <a className="topmenu-item disabled">
                Search
                <img
                  style={{ height: "15px", width: "15px" }}
                  src={SEARCH_ICON_URL}
                  alt=""
                />
              </a>
              <a className="topmenu-item disabled">Analysis</a>
              <HeaderAuthControl />
            </div>
            <div className="menu">
              <div className="main-menu-items">
                {pkbMenu.highlightItems.map((item) => (
                  <div
                    key={item.label}
                    className={`menu-item-wrapper ${isActive(item.path) ? "active" : ""}`}
                  >
                    <a className="menu-item menu-item-main" href={item.path}>
                      {item.label}
                    </a>
                  </div>
                ))}
              </div>
              {pkbMenu.menuItems.map((item) => (
                <div
                  key={item.label}
                  className={`menu-item-wrapper ${isActive(item.path) ? "active" : ""}`}
                >
                  <a className="menu-item" href={item.path || undefined}>
                    {item.label}
                  </a>
                  {item.subMenuItems && (
                    <div className="submenu">
                      {item.subMenuItems.map((subItem) => (
                        <a
                          key={subItem.label}
                          className={`submenu-item ${isActive(subItem.path) ? "active" : ""}`}
                          href={subItem.path || undefined}
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
            <img style={{ height: "37px" }} src={HIRN_LOGO_URL} alt="HIRN Logo" />
          </a>
        </div>
        <div className="pkb-beta">beta</div>
      </div>
    </div>
  );
}

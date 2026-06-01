import React from "react";
import { pkbMenu } from "../lib/pkbMenu";

const SOCIAL_LINKS = [
  {
    href: "https://x.com/PanKbase",
    title: "@PanKbase",
    src: "https://hugeampkpncms.org/sites/default/files/images/logos/external/x-black.svg",
    alt: "X (Twitter)",
  },
  {
    href: "https://bsky.app/profile/pankbase.bsky.social",
    title: "@pankbase.bsky.social",
    src: "https://hugeampkpncms.org/sites/default/files/images/logos/external/bluesky-black.svg",
    alt: "Bluesky",
  },
  {
    href: "https://www.linkedin.com/groups/13199008/",
    title: "LinkedIn",
    src: "https://hugeampkpncms.org/sites/default/files/images/logos/external/linkedin-black.svg",
    alt: "LinkedIn",
  },
  {
    href: "https://github.com/PanKbase",
    title: "GitHub",
    src: "https://hugeampkpncms.org/sites/default/files/images/logos/external/github-black.svg",
    alt: "GitHub",
  },
];

const PANKBASE_LOGO_URL =
  "https://hugeampkpncms.org/sites/default/files/users/user32/pankbase/PanKbase_logo-black.svg";
const HIRN_LOGO_URL =
  "https://hugeampkpncms.org/sites/default/files/images/pankbase/logo-hirn.svg";

export default function PkbFooter() {
  return (
    <div className="pkb-footer">
      <div className="menu">
        <div className="main-menu-items">
          {pkbMenu.highlightItems.map((item) => (
            <div key={item.label} className="menu-item-wrapper">
              <a className="menu-item menu-item-main" href={item.path}>
                {item.label}
              </a>
            </div>
          ))}
        </div>
        {pkbMenu.menuItems.map((item) => (
          <div key={item.label} className="menu-item-wrapper">
            <a className="menu-item" href={item.path || undefined}>
              {item.label}
            </a>
            {item.subMenuItems && (
              <div className="submenu">
                {item.subMenuItems.map((subItem) => (
                  <a
                    key={subItem.label}
                    className="submenu-item"
                    href={subItem.path || undefined}
                  >
                    {subItem.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="f-row align-v-center logos" style={{ gap: "10px" }}>
        {SOCIAL_LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            target="_blank"
            title={link.title}
            rel="noopener noreferrer"
          >
            <img src={link.src} alt={link.alt} />
          </a>
        ))}
      </div>

      <div className="f-row" style={{ gap: "20px" }}>
        <a href="/">
          <img
            style={{ height: "37px" }}
            src={PANKBASE_LOGO_URL}
            alt="PanKbase Logo"
          />
        </a>
        <div>
          Supported by <strong>National Institutes of Health (NIH)</strong> grants{" "}
          <strong>U24 DK138515</strong>, <strong>U24 DK138512</strong>
          <br />
          Supplemental funds from the{" "}
          <strong>NIH Office of Data Science Strategies</strong>
        </div>
        <a href="https://hirnetwork.org/" target="_blank" rel="noopener noreferrer">
          <img style={{ height: "37px" }} src={HIRN_LOGO_URL} alt="HIRN Logo" />
        </a>
      </div>
    </div>
  );
}
